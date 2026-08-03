#!/usr/bin/env python3
"""Baixa, sem interação, as nove planilhas autorizadas do Google Drive."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

EXPECTED = (
    "controle_financeiro_contratos.xlsx",
    "digitos.xlsx",
    "volumes.xlsx",
    "NL_requisicao.xlsx",
    "Ordem_de_compra_em_assinatura.xlsx",
    "ordem_de_compra.xlsx",
    "requisicoes.xlsx",
    "descricao_OM.xlsx",
    "descricao_projetos.xlsx",
)
SCOPES = ("https://www.googleapis.com/auth/drive.readonly",)
STEM_ALIASES = {"ordem_de_compras": "ordem_de_compra.xlsx"}


def session_from_secret() -> AuthorizedSession:
    raw = os.environ.get("GDRIVE_SERVICE_ACCOUNT_JSON", "")
    if not raw:
        raise SystemExit("Secret GDRIVE_SERVICE_ACCOUNT_JSON ausente.")
    try:
        info = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise SystemExit("Secret GDRIVE_SERVICE_ACCOUNT_JSON não contém JSON válido.") from exc
    credentials = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return AuthorizedSession(credentials)


def list_files(session: AuthorizedSession, folder_id: str) -> list[dict]:
    query = f"'{folder_id}' in parents and trashed = false"
    params = {
        "q": query,
        "fields": "files(id,name,mimeType,modifiedTime,size,md5Checksum)",
        "pageSize": 1000,
        "orderBy": "modifiedTime desc",
        "supportsAllDrives": "true",
        "includeItemsFromAllDrives": "true",
    }
    response = session.get("https://www.googleapis.com/drive/v3/files", params=params, timeout=60)
    response.raise_for_status()
    return response.json().get("files", [])


def download(session: AuthorizedSession, item: dict, target: Path) -> None:
    with session.get(
        f"https://www.googleapis.com/drive/v3/files/{item['id']}",
        params={"alt": "media", "supportsAllDrives": "true"},
        stream=True,
        timeout=300,
    ) as response:
        response.raise_for_status()
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("wb") as handle:
            for block in response.iter_content(1024 * 1024):
                if block:
                    handle.write(block)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--folder-id", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--zip-folder-id")
    parser.add_argument("--zip-output", type=Path)
    args = parser.parse_args()
    session = session_from_secret()
    files = list_files(session, args.folder_id)
    expected_by_stem = {Path(name).stem.lower(): name for name in EXPECTED}
    by_name: dict[str, list[dict]] = {}
    for item in files:
        source = Path(item.get("name", ""))
        if source.suffix.lower() not in {".xls", ".xlsx"}:
            continue
        canonical = expected_by_stem.get(source.stem.lower()) or STEM_ALIASES.get(source.stem.lower())
        if canonical:
            by_name.setdefault(canonical, []).append(item)
    missing = sorted(set(EXPECTED) - set(by_name))
    if missing:
        raise SystemExit(f"Planilhas obrigatórias ausentes no Drive: {missing}")
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {"folderId": args.folder_id, "files": []}
    for name in EXPECTED:
        item = sorted(by_name[name], key=lambda x: x.get("modifiedTime", ""), reverse=True)[0]
        suffix = Path(item["name"]).suffix.lower()
        target = args.output / f"{Path(name).stem}{suffix}"
        download(session, item, target)
        signature = target.read_bytes()[:8]
        if suffix == ".xlsx" and not signature.startswith(b"PK"):
            raise SystemExit(f"Arquivo não é XLSX válido: {item['name']}")
        if suffix == ".xls" and not signature.startswith(bytes.fromhex("D0CF11E0A1B11AE1")):
            raise SystemExit(f"Arquivo não é XLS válido: {item['name']}")
        manifest["files"].append({
            **{k: item.get(k) for k in ("id", "name", "modifiedTime", "size", "md5Checksum")},
            "canonicalName": name,
            "downloadedAs": target.name,
        })
    (args.output / "input_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    if args.zip_folder_id:
        if not args.zip_output:
            raise SystemExit("--zip-output é obrigatório com --zip-folder-id")
        zip_files = [x for x in list_files(session, args.zip_folder_id) if Path(x.get("name", "")).suffix.lower() == ".zip"]
        if not zip_files:
            raise SystemExit("Nenhum ZIP-base encontrado na pasta 02_ZIP_Base.")
        selected = sorted(zip_files, key=lambda x: x.get("modifiedTime", ""), reverse=True)[0]
        download(session, selected, args.zip_output)
        if not args.zip_output.read_bytes()[:4].startswith(b"PK"):
            raise SystemExit("O pacote-base baixado não é um ZIP válido.")
        print(f"ZIP-base selecionado: {selected['name']} ({selected.get('modifiedTime', '')})")
    print(f"Nove planilhas baixadas em {args.output}")


if __name__ == "__main__":
    main()
