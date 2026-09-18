# SISCABW — guia único de operação, atualização e publicação

Este repositório contém o painel estático de Business Intelligence da Comissão Aeronáutica Brasileira em Washington (CABW). Todo o processamento é executado na geração do pacote; depois de publicado no GitHub Pages, o site funciona somente com HTML, CSS e JavaScript, sem depender do ChatGPT ou de um servidor de aplicação.

## Conteúdo do painel

- **CABW em Números:** visão executiva de crédito, restos a pagar, contratos, requisições, finanças e suprimento de fundos.
- **Gestão de Crédito:** visão do crédito disponível e compatibilização entre créditos e processos.
- **Contratos:** contratos administrativos, finalísticos e casos FMS, com filtros, relatórios e consolidação contínua para prestação de contas.
- **Requisições:** materiais/publicações e reparos, incluindo situação, fluxo logístico, indicadores, gráficos e listas detalhadas.
- **Governança e ARC:** restos a pagar, calendário, PAAC, PTA e indicadores de governança.
- **Finanças:** acesso ao painel externo de pagamentos.
- **Suprimento de Fundos:** crédito, empenho, liquidação e pessoas atendidas.

## Fontes obrigatórias

Cada atualização utiliza nove planilhas. O gerador aceita `.xls` ou `.xlsx`, desde que as colunas obrigatórias sejam preservadas.

| Arquivo canônico | Uso principal |
|---|---|
| `controle_financeiro_contratos.xlsx` | contratos, classificação, vigência e execução financeira |
| `descricao_OM.xlsx` | nomes e siglas das organizações militares |
| `descricao_projetos.xlsx` | descrição dos projetos |
| `Ordem_de_compra_em_assinatura.xlsx` | valores de PO ainda em assinatura |
| `digitos.xlsx` | dotação, saldo, ação, ND, PI, fonte, projeto e objetivo |
| `NL_requisicao.xlsx` | pagamentos, faturas e liquidações por PO |
| `ordem_de_compra.xlsx` | ordens de compra, versões, valores, fornecedor, faturamento e saldo |
| `requisicoes.xlsx` | requisições, certame, cotação, situação, datas, itens e reparos |
| `volumes.xlsx` | volumes, pedidos, PAG e manifesto |

O arquivo `requisicoes` é a referência temporal da publicação. A data exibida no painel usa, nesta ordem: metadado interno da planilha; `modifiedTime` do manifesto de download; ou data/hora de upload do arquivo. A apresentação usa o fuso de Washington (`America/New_York`) e nunca a hora em que o gerador foi executado.

## Regras de negócio essenciais

### Contratos

- Administrativos: Grande Comando `CW`.
- FMS: fornecedor/CAGE `W2525`.
- Finalísticos: contratos restantes, sem duplicidade.
- A última versão de cada PO é a versão financeira vigente.
- O faturamento e o histórico mensal são associados por PO e NL.
- A consolidação para prestação de contas empilha todos os contratos da categoria, independentemente dos filtros correntes.
- Vigência em vermelho: menos de 90 dias, incluindo contratos vencidos. Vigência em amarelo: de 90 a 150 dias.
- No relatório consolidado, o histórico mensal usa cinza para o ano anterior e azul para o ano atual; o rótulo fica sobre a barra e a tooltip relaciona as faturas do mês. A tabela de faturamento é ordenada da NL mais recente para a mais antiga e separada por mês.

### Requisições

- O certame considerado é o **certame SILOMS**, proveniente do ComprAer.
- Materiais/publicações do ComprAer exigem cotação e certame SILOMS preenchidos.
- Reparos do ComprAer exigem cotação e certame SILOMS preenchidos e quarto caractere `R` no número da requisição.
- Requisições cujo quarto caractere não seja `R` não pertencem ao painel de reparos.
- O ano é obtido da data de abertura.
- Mapa aprovado é válido por 60 dias contados da data de abertura.
- Requisição atrasada de material/publicação: situação `Empenho aprovado` e DPE anterior à data de referência dos dados.
- Economia da licitação: valor de referência menos valor total, com valor absoluto e percentual.

### Compatibilização de crédito e processos

- Compatibilidade sempre exige a mesma natureza de despesa entre crédito e requisição.
- Organização Militar e natureza de despesas possuem filtros únicos, aplicados simultaneamente aos créditos e às requisições.
- Empenho imediato exige OM, ND, projeto e mapa válido compatíveis.
- Ajustes de projeto ou PI preservam OM e ND e respeitam o saldo finito de cada dígito.
- Mapas vencidos aparecem apenas como cenário informativo de revalidação, não como valor financiável.

### Restos a pagar

- A OM requisitante é priorizada; UG é apenas fallback.
- RP inicialmente inscrito = saldo atual + liquidações do exercício.
- A projeção é distribuída por DPE.
- Os KPI de 2022 a 2025 são botões: ao selecionar um ano, todos os gráficos, liquidações e a tabela de POs adotam o mesmo filtro. `RP geral` limpa apenas o filtro anual.

### Crédito, finanças e suprimento de fundos

- Crédito disponível = saldo dos dígitos + PO em assinatura que não seja `AMEND`.
- Crédito total recebido = crédito disponível + empenhos realizados.
- Fornecedores pagos qualificados devem estar ligados a contrato ou a requisição com certame SILOMS.
- Suprimento de fundos usa projeto `SF` para crédito, empenho e saldo não liquidado.

## Arquivos gerados

- `contracts-data.js` e `contracts-summary.json`
- `credit-data.js` e arquivos `credit-*.json`
- `processos-data.js`
- `compatibilizacao-data.js`
- `rp-data.js`
- `suprimento-data.js`
- `home-data.js`
- `data-update-status.json`

Os dados mantêm os aliases exigidos pelas páginas legadas, incluindo `contracts`, `records` e `data` em contratos, e `pos`/`purchaseOrders` e `signing`/`signatureOrders` em crédito.

## Atualização dos dados

1. Coloque as nove planilhas em uma pasta de entrada usando os nomes canônicos ou os mesmos nomes com extensão `.xls`.
2. Decodifique o gerador versionado:

   ```bash
   base64 -d automation/generate_data.py.gz.b64 | gzip -d > /tmp/generate_data.py
   ```

3. Execute a geração:

   ```bash
   python /tmp/generate_data.py --inputs /caminho/entrada --repo /caminho/repositorio
   ```

4. Execute as verificações abaixo antes de compactar ou publicar.

O script `automation/download_drive.py` pode preparar as fontes e o `input_manifest.json` em fluxos automatizados. O manifesto preserva o nome original e o `modifiedTime`, usado como referência temporal quando a planilha não contém metadado interno legível.

## Validação obrigatória

- Confirmar a presença e o schema das nove fontes.
- Validar sintaxe de todos os JavaScript com `node --check` e validar os JSON.
- Reconciliar totais de contratos, crédito, requisições, RP, pagamentos e suprimento.
- Confirmar aliases de compatibilidade e a data/hora da fonte `requisicoes`.
- Testar filtros, links, relatórios e comportamento responsivo.
- Executar o gerador do pacote em uma cópia limpa e comparar os dados gerados.
- Compactar o conteúdo na raiz do ZIP, sem pasta intermediária.
- Publicar primeiro em teste e homologar o conteúdo servido pelo GitHub Pages.

As páginas `CHECK_DADOS.html`, `CHECK_COMPATIBILIZACAO.html`, `CHECK_PUBLICACAO.html` e `CHECK_VISUAL_LINKS.html` apoiam a inspeção local. `MANIFESTO_ARQUIVOS.txt` documenta o pacote.

## Estado desta versão

- 139 contratos: 26 administrativos, 60 finalísticos e 53 FMS.
- Valor contratado: US$ 1.125.778.828,19.
- Valor empenhado em contratos: US$ 657.263.613,50.
- Valor faturado em contratos: US$ 550.741.202,30.
- Crédito recebido: US$ 129.578.964,84; disponível: US$ 2.564.134,13.
- Restos a pagar: 905 registros e saldo atual de US$ 36.456.736,12.
- Requisições homologadas em 2026: 491 de materiais/publicações e 69 de reparo.
- Pagamentos em 2026: 2.426 NL, no valor de US$ 105.387.982,85.
- Data de referência: 17/09/2026 às 22:39:54, baseada no upload de `requisicoes`.

## Publicação no GitHub Pages

Extraia o ZIP e publique seu conteúdo diretamente na raiz da branch configurada para o GitHub Pages. Faça primeiro a publicação em `cabwbi/teste`; após a homologação funcional e visual, replique os mesmos arquivos aprovados em `cabwbi/SISCABW`.

Não publique planilhas-fonte, credenciais ou segredos no repositório. O acesso ao Google Drive deve permanecer apenas no GitHub Secrets.
