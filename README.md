# SISCABW — documentação consolidada

Este arquivo reúne os 48 documentos `README_*.md` presentes no pacote de referência de 17/08/2026. As seções abaixo preservam o conteúdo histórico original; datas, nomes de fontes e totais nelas registrados podem representar versões anteriores do painel.

## Estado do pacote consolidado

- Base: `SISCABW_Pacote_Publicacao_17-08-2026.zip`.
- Contratos: 135 registros únicos — 27 administrativos, 56 finalísticos e 52 FMS.
- Os arquivos funcionais do site não foram alterados nesta consolidação documental.

## Documentos incorporados

- `README_AJUSTES_17072026_CREDITO_CONTRATOS_RP.md`
- `README_AJUSTES_17072026_RISCO_SF_RP_PROJECAO.md`
- `README_AJUSTES_17072026_SF_ICON_RP_SALDOS_PROJECAO.md`
- `README_AJUSTES_ROTULOS_RELATORIOS_TABELAS.md`
- `README_AJUSTE_CARDS_RP_INSCRITO_LIQUIDADO.md`
- `README_AJUSTE_DETALHAMENTO_PO_RELATORIO.md`
- `README_AJUSTE_FILTROS_GRAFICOS.md`
- `README_AJUSTE_FILTROS_MEDIA_SF.md`
- `README_AJUSTE_GRAFICO_SF.md`
- `README_AJUSTE_PO_FATURAMENTO_MENSAL.md`
- `README_AJUSTE_RP_DEEP_SEARCH.md`
- `README_AJUSTE_RP_FILTROS_ANO_TIPO.md`
- `README_AJUSTE_VISUAL_KC390.md`
- `README_AJUSTE_VISUAL_REAPLICADO.md`
- `README_ATUALIZACAO_APENAS_DADOS.md`
- `README_ATUALIZACAO_DADOS.md`
- `README_ATUALIZACAO_DADOS_06072026.md`
- `README_ATUALIZACAO_DADOS_16072026.md`
- `README_ATUALIZACAO_EXECUTIVA_CONTRATOS.md`
- `README_ATUALIZACAO_HERO_FAB.md`
- `README_ATUALIZACAO_MULTI_FILTROS.md`
- `README_ATUALIZACAO_OC_OBJETO.md`
- `README_CONTRATOS_ATUALIZADOS.md`
- `README_CORRECAO_AMEND_ASSINATURA.md`
- `README_CORRECAO_ATUALIZACAO_DADOS_16072026.md`
- `README_CORRECAO_CARD_DATAS_FILTROS_20260805.md`
- `README_CORRECAO_CONTRATOS_DADOS.md`
- `README_CORRECAO_CRITERIO_ATRASO_DPE.md`
- `README_CORRECAO_DADOS_COMPLETOS.md`
- `README_CORRECAO_DROPDOWN_MULTIFILTROS.md`
- `README_CORRECAO_DROPDOWN_TAMANHO_OM.md`
- `README_CORRECAO_FILTROS_ORDENACAO.md`
- `README_CORRECAO_FMS_FINALISTICOS.md`
- `README_CORRECAO_GOVERNANCA_RP.md`
- `README_CORRECAO_GRAFICO_LINHAS_RP.md`
- `README_CORRECAO_HERO_RELATORIOS.md`
- `README_CORRECAO_LAYOUT_HERO_RELATORIOS_OM.md`
- `README_CORRECAO_OM_RP_LIQUIDACOES.md`
- `README_CORRECAO_RP_DADOS_17072026.md`
- `README_CORRECAO_RP_DADOS_NAO_EXIBIDOS.md`
- `README_CORRECAO_SUPRIMENTO_FUNDOS_06072026.md`
- `README_CORRECAO_VISUAL_DADOS.md`
- `README_CORRECAO_VISUAL_RESPONSIVIDADE.md`
- `README_FILTROS_OM_PROJETOS.md`
- `README_MELHORIA_TABELA_CONTRATOS_VENCIMENTO.md`
- `README_PUBLICACAO.md`
- `README_RECORRECAO_16072026.md`
- `README_RELATORIOS_FILTROS.md`

---

## Documento original: `README_AJUSTES_17072026_CREDITO_CONTRATOS_RP.md`

# Ajustes de publicação - 17/07/2026

Alterações aplicadas sobre a última versão validada do Painel_CABW:

1. Removidos do menu superior e do pacote os painéis `Detalhamento por OM` e `Detalhamento por Ação`.
2. Painel de Crédito Disponível: restaurada/completada a área de cards de indicadores com segunda linha preenchida, incluindo POs emitidas, empresas com PO, valor faturado e saldo de PO a faturar.
3. Painel de Crédito Disponível: gráfico de pizza `PO por Grande Comando` passa a classificar cada PO pelo Grande Comando do dígito de origem da ordem de compra.
4. Painéis de Contratos: coluna `Risco` movida para o início da tabela, com cores vermelho (<90 dias ou vencido), amarelo (90 a 150 dias) e azul (>150 dias). A coluna `Grande Comando` permanece visível.
5. Painel de RP: tooltips dos gráficos `RP por empresa contratada` e `RP por OM requisitante` reformatados para leitura completa de PO, saldo, empresa e objeto resumido.

As demais correções anteriores foram preservadas.

---

## Documento original: `README_AJUSTES_17072026_RISCO_SF_RP_PROJECAO.md`

# Ajustes 17/07/2026 - contratos, suprimento e RP

Alterações aplicadas ao pacote:

1. Contratos
   - Coluna **Risco / prazo** posicionada como primeira coluna da tabela e do relatório.
   - A própria coluna consolida o risco e os dias para vencimento.
   - Cores: vermelho para vencidos ou com menos de 90 dias, amarelo para 90 a 150 dias, azul para mais de 150 dias e cinza para contratos sem data final.

2. Suprimento de Fundos
   - Tooltips dos gráficos ajustados para exibição legível de pessoa/OM requisitante, empenhado, faturado e saldo empenhado não faturado.
   - Link **Suprimento de Fundos** incluído de forma fixa no menu superior de todas as páginas.
   - Card incluído na página principal com valor total empenhado em SF em 2026 e número de pessoas atendidas.

3. Restos a Pagar
   - Novo gráfico **Evolução mensal do RP total e projeções** incluído no painel de RP.
   - Série azul: RP total apurado por liquidação.
   - Série cinza: projeção linear de redução.
   - Série por DPE: projeção calculada a partir dos prazos de entrega das requisições vinculadas às POs com saldo em RP.

As demais correções existentes foram preservadas.

---

## Documento original: `README_AJUSTES_17072026_SF_ICON_RP_SALDOS_PROJECAO.md`

# Ajustes - Suprimento de Fundos e RP

Alterações aplicadas nesta versão:

1. Incluído ícone próprio no card de entrada de Suprimento de Fundos na página principal.
2. Removidas do painel de RP as ordens de compra com saldo negativo, inclusive saldos residuais negativos que afetavam o total por ano/tipo de processo.
3. A tabela inferior de ordens de compra do painel de RP passa a exibir somente POs com saldo positivo.
4. A projeção linear cinza tracejada do RP foi ajustada para meta de encerramento de dezembro com no máximo 20% do RP inicialmente inscrito.
5. Mantidas as séries históricas de evolução e os registros com saldo atual zero na base de evolução, para preservar a reconstrução do RP inicialmente inscrito e das liquidações realizadas em 2026.

---

## Documento original: `README_AJUSTES_ROTULOS_RELATORIOS_TABELAS.md`

# Ajustes de rótulos, tabelas e relatórios

- Rótulos dos gráficos de empenhos por empresa e por projeto truncados em até 20 caracteres com reticências.
- Nome completo preservado no hover/tooltip do gráfico e nos títulos SVG dos eixos.
- Tabelas inferiores com rolagem vertical e horizontal.
- Área de geração de relatórios incluída em Análise por OM e Análise por Ação.
- Área de relatórios padronizada com o visual da Visão Executiva.
- Imagem principal da página inicial preservada em alta resolução.

---

## Documento original: `README_AJUSTE_CARDS_RP_INSCRITO_LIQUIDADO.md`

# Ajuste dos cards superiores do painel de RP

Foram atualizados os indicadores acima dos filtros do painel de Restos a Pagar.

## Alterações

- Inclusão do card **RP geral**.
- Cards de RP por ano de emissão da PO: 2022, 2023, 2024 e 2025.
- Cada card apresenta:
  - RP atual;
  - RP total inicialmente inscrito;
  - percentual liquidado em 2026.

## Regra de cálculo

O RP total inicialmente inscrito é reconstruído por PO como:

`RP inscrito = saldo atual de RP + liquidações de 2026 constantes da NL_requisicao.xlsx`

O percentual liquidado é calculado como:

`% liquidado = liquidações de 2026 / RP inscrito`

Os cards respeitam os filtros aplicados no painel de RP.

---

## Documento original: `README_AJUSTE_DETALHAMENTO_PO_RELATORIO.md`

# Ajustes de Detalhamento por PO e relatório

- O Detalhamento por PO nos painéis de contratos passa a aparecer automaticamente, sem necessidade de checkbox.
- O campo/checkbox de seleção de Detalhamento por PO foi removido.
- A tabela final de Detalhamento por PO voltou a listar todas as POs associadas aos contratos filtrados, incluindo POs com saldo zero.
- A ordenação da tabela de PO é da data de emissão mais recente para a mais antiga.
- A primeira linha da tabela mostra os totais de valor total da PO, valor faturado e saldo, com negrito e fundo diferenciado.
- No pacote de painéis de contratos, o relatório passou a incluir o gráfico de faturamento mensal por PO associada e a tabela Detalhamento por PO.

---

## Documento original: `README_AJUSTE_FILTROS_GRAFICOS.md`

# Ajuste de filtros e gráficos

- Área de filtros de contratos ajustada para exibir 2 a 3 filtros por linha, conforme largura da tela.
- Menus dropdown ampliados para melhorar a leitura das categorias e botões Marcar todas / Limpar.
- Gráficos dos painéis de contratos passam a exibir a coluna “Saldo empenhado a faturar”, calculada como Total empenhado USD menos Total faturado USD.
- Mantidos os dados atualizados de ordens de compra e a coluna Objeto - resumo no detalhamento por PO.

---

## Documento original: `README_AJUSTE_FILTROS_MEDIA_SF.md`

# Ajuste de filtros, média mensal e Suprimento de Fundos

Pacote atualizado para corrigir:

- Aplicação de seleção múltipla apenas após o botão Selecionar nos filtros.
- Seleção por texto contido nas categorias dos filtros.
- Média mensal faturada calculada com denominador baseado nos meses de vigência dos contratos filtrados no ano.
- Gráfico de Suprimento de Fundos com valor faturado à esquerda e valor empenhado não faturado à direita.
- Tabela de Suprimento de Fundos ordenada por saldo da PO e, em seguida, por valor total da PO.

---

## Documento original: `README_AJUSTE_GRAFICO_SF.md`

Ajustes: quadro de média mensal sobreposto ao lado direito do gráfico sem comprimir a área; filtros de Suprimento de Fundos convertidos para multisseleção com busca por texto contido; carregamento do Plotly garantido no painel SF.

---

## Documento original: `README_AJUSTE_PO_FATURAMENTO_MENSAL.md`

# Ajuste de detalhamento por PO e faturamento mensal

- Detalhamento por PO passa a exibir apenas ordens de compra com saldo diferente de zero.
- Incluído gráfico de linhas de faturamento mensal por PO associada aos contratos filtrados.
- Linha 2026: azul escuro.
- Linha 2025: cinza.
- Fonte dos valores faturados: NL_requisicao(4).xlsx, campo VALOR PAGO NO PEDIDO, vinculado por PO -> PAG/Contrato.

---

## Documento original: `README_AJUSTE_RP_DEEP_SEARCH.md`

# Ajuste RP e remoção Deep Search

- Área Deep Search removida do menu, da página inicial e do pacote de publicação.
- Painel de Restos a Pagar atualizado com filtro Requisição atrasada (SIM/NÃO), calculado a partir de requisicoes.xlsx pela data DPE e pelo status/quantidade recebida.
- Cards superiores de RP por ano de empenho: 2022, 2023, 2024 e 2025.
- Gráfico de evolução mensal de RP em 2026 recalculado com ordens de compra, saldos atuais e NL de 2026.
- Gráficos adicionais de RP por empresa e por UG requisitante com detalhamento de PO, saldo e objeto no hover.
- Tabela inferior de ordens de compra ordenada por saldo decrescente e, em seguida, data de emissão crescente.

---

## Documento original: `README_AJUSTE_RP_FILTROS_ANO_TIPO.md`

# Ajuste no painel de Restos a Pagar

Foram incluídos dois filtros no painel `governanca-rp.html`:

1. **Ano de emissão da PO**: opções 2022, 2023, 2024 e 2025. Sem seleção, o painel considera todos os anos.
2. **Tipo de processo**: opções Contratos e Varejo.
   - **Contratos**: PO com saldo em restos a pagar e cujo PAG coincide com a coluna `CONTRATO` da planilha `controle_financeiro_contratos(4).xlsx`.
   - **Varejo**: demais ordens de compra em restos a pagar.

Também foram mantidos os filtros de seleção múltipla já existentes, sem pré-seleção inicial, preservando a identidade visual e a estrutura dos relatórios.

PAGs de contrato identificados na fonte: 135.

---

## Documento original: `README_AJUSTE_VISUAL_KC390.md`

# Ajuste visual KC-390 e ícones da página inicial

Este pacote parte do `cabw_painel_site_github_visual_autocontido(1).zip` e altera apenas a tela principal de entrada:

- substitui `assets/img/hero_aircraft_clean.png` por uma arte institucional baseada no KC-390 anexado;
- mantém a identidade visual e o restante do site inalterados;
- preserva os ícones em `assets/icons/`;
- embute os três ícones principais diretamente no `index.html` como fallback, evitando quadrados brancos caso o GitHub Pages não resolva algum caminho relativo.

Publique o conteúdo interno do ZIP diretamente na raiz do GitHub Pages.

---

## Documento original: `README_AJUSTE_VISUAL_REAPLICADO.md`

# Ajuste visual reaplicado

Este pacote parte de `cabw_painel_site_github_contratos_atualizados.zip` e reaplica os elementos visuais já criados anteriormente:

- `assets/img/hero_kc390_cabw.png` como fundo da área de entrada da página principal.
- `assets/icons/home-credit.png`, `assets/icons/home-contract.png` e `assets/icons/home-process.png` nos três primeiros cartões da página inicial.
- Cópias compatíveis em `icons/` e na raiz para evitar quebra de caminhos no GitHub Pages.

O restante do pacote, inclusive a atualização de contratos, foi preservado.

---

## Documento original: `README_ATUALIZACAO_APENAS_DADOS.md`

# Atualizacao apenas de dados

Este pacote foi gerado a partir do pacote base `cabw_painel_site_github_layout_hero_om_corrigido.zip`.

Foram substituidos somente os arquivos de dados:

- `credit-data.js`
- `contracts-data.js`
- `assets/js/credit-data.js`
- `assets/js/contracts-data.js`

Nao foram alterados arquivos HTML, CSS, nem scripts de painel (`credit-panel.js` e `contracts-panel.js`).

---

## Documento original: `README_ATUALIZACAO_DADOS.md`

# Atualização de dados e menu

Pacote atualizado a partir de `cabw_painel_site_github_visual_autocontido_kc390_icons.zip`.

## Alterações
- Área de contratos atualizada com `controle_financeiro_contratos(1).XLS`.
- Contratos administrativos classificados por `GRAND COMANDO = CW`: 26.
- Contratos FMS classificados por `CAGE = W2525`: 53.
- Contratos finalísticos: 57.
- Área de crédito disponível atualizada com `digitos(1).xlsx`.
- Total de crédito disponível carregado: US$ 3.953.301,18.
- Menu e cartão `Requisições` renomeados para `Deep research`.

Publique o conteúdo interno deste ZIP diretamente na raiz do repositório GitHub Pages.

---

## Documento original: `README_ATUALIZACAO_DADOS_06072026.md`

# Atualização de dados - 06/07/2026

Pacote atualizado com os arquivos anexados pelo usuário, mantendo as correções já aplicadas nos painéis.

## Fontes utilizadas
- controle_financeiro_contratos(5).xlsx
- descricao_OM(7).xlsx
- descricao_projetos(7).xlsx
- digitos(6).xlsx
- NL_requisicao(6).xlsx
- ordem_de_compra(7).xlsx
- Ordem_de_compra_em_assinatura(4).xlsx
- requisicoes(6).xlsx
- volumes(6).xlsx

## Principais preservações
- Correção da OM requisitante no painel de RP por prefixo da requisição associada à PO.
- Filtros de ano da PO e tipo de processo no RP.
- Gráfico de linhas de RP reconstruído por saldo atual + liquidações de 2026.
- Cards de RP com valor atual, RP total inscrito e percentual liquidado.
- Tabela de principais liquidações do mês anterior.
- Filtros sem pré-seleção inicial e seleção por texto contido.

## Totais de controle
- RP atual total: US$ 47,734,177.92
- RP inscrito total reconstruído: US$ 97,552,269.53
- Contratos carregados: 135
- Dígitos carregados: 298
- Ordens de compra 2026 carregadas no crédito: 730

---

## Documento original: `README_ATUALIZACAO_DADOS_16072026.md`

# Atualização de dados do Painel_CABW - 16/07/2026

Pacote gerado a partir da última versão do Painel_CABW, mantendo as correções já aplicadas e atualizando as bases com as novas planilhas anexadas nesta rodada.

Arquivos de dados atualizados:
- `contracts-data.js` e `contracts-summary.json`;
- `credit-data.js` e arquivos `credit-*.json`;
- `rp-data.js`, mantendo os filtros de RP, correção de OM requisitante, gráfico de linhas reconstruído por liquidações e cards de RP inscrito/liquidado;
- `suprimento-data.js`.

Fontes utilizadas:
- controle_financeiro_contratos.xlsx
- descricao_OM.xlsx
- descricao_projetos.xlsx
- digitos.xlsx
- NL_requisicao.xlsx
- ordem_de_compra.xlsx
- Ordem_de_compra_em_assinatura.xlsx
- requisicoes.xlsx
- volumes.xlsx

Para publicar, envie o conteúdo interno deste ZIP diretamente para a raiz do repositório GitHub Pages.

---

## Documento original: `README_ATUALIZACAO_EXECUTIVA_CONTRATOS.md`

# Pacote CABW atualizado

Atualização realizada com base nos arquivos Excel reenviados.

## Crédito disponível
- Fonte: `digitos(2).xlsx`, `ordem_de_compra(2).xlsx` e `Ordem_de_compra_em_assinatura.xlsx`.
- Visão Executiva recalculada como: crédito disponível + empenhos realizados em 2026 + empenhos em processo de assinatura.
- Filtros por UG, ação, natureza de despesa e projeto.
- Análise por UG usa sigla da UG, não código numérico.

## Contratos
- Fonte: `controle_financeiro_contratos.xlsx`.
- Filtros por número de contrato, empresa, unidade, grande comando, ordenador de despesas, ação, moeda, vigência e busca geral.
- Vigência classificada em: acima de 150 dias, entre 90 e 150 dias, até 90 dias, expirada ou sem data.
- Flag de risco para contratos com menos de 90 dias até o fim da vigência.
- Ordenador de despesas CABW calculado como união entre contratos com `GRAND COMANDO = CW` e a lista adicional informada pelo usuário.

## Validações
- Contratos totais: 136
- Administrativos (GC=CW): 26
- FMS (CAGE=W2525): 53
- Finalísticos: 57
- Contratos OD CABW: 46
- Dígitos carregados: 274
- Saldo disponível total nos dígitos: US$ 3,159,204.63
- Empenhos realizados em 2026: US$ 67,447,674.37
- Empenhos em assinatura: US$ 25,891,814.11

---

## Documento original: `README_ATUALIZACAO_HERO_FAB.md`

Atualização: substituida a imagem de fundo da página principal pela arte institucional FAB fornecida pelo usuário, preservando a resolução original 2048x650 e mantendo fallback embutido no index.html.

---

## Documento original: `README_ATUALIZACAO_MULTI_FILTROS.md`

# Atualização de filtros e painéis

- Visão Executiva atualizada com gráficos por Grande Comando, empresa e projeto.
- Lista de dígitos filtrada incluída na parte inferior.
- Filtros de crédito e contratos aceitam múltipla seleção.
- Contratos finalísticos usam filtro de Ordenação de Despesas com as opções CABW e OM Requisitante.
- Dados de contratos atualizados a partir de controle_financeiro_contratos(1).xlsx.

## Validações
- Dígitos: 274
- POs 2026: 673
- POs em assinatura consideradas: 6
- Contratos: 136
- Administrativos: 28
- Finalísticos: 55
- FMS: 53

---

## Documento original: `README_ATUALIZACAO_OC_OBJETO.md`

# Atualização de ordens de compra e detalhamento por PO

- Dados de ordens de compra atualizados a partir de `ordem_de_compra(5).xlsx`.
- Mantidas as melhorias de filtros, painéis e layout já existentes.
- Detalhamento por PO nos contratos passa a exibir `Objeto - resumo` no lugar de `Projeto`.
- POs totais carregadas: 11395.
- POs de 2026 no painel visual: 684.

---

## Documento original: `README_CONTRATOS_ATUALIZADOS.md`

# Atualização da área de Contratos

Este pacote atualiza a área de Contratos com a planilha `controle_financeiro_contratos(2).XLS`.

Resumo carregado:

- Total de contratos: 136
- Contratos administrativos (GRAND COMANDO = CW): 26
- Contratos FMS (CAGE = W2525): 53
- Contratos finalísticos: 57

Arquivos atualizados:

- `assets/js/contracts-data.js`
- `assets/js/contracts-panel.js`
- `assets/data/contracts-summary.json`
- cópias compatíveis na raiz
- `contratos.html`
- `contratos-administrativos.html`
- `contratos-finalisticos.html`
- `fms.html`

A tabela dos painéis também recebeu conteúdo estático de fallback, para que os dados apareçam mesmo se o navegador demorar a executar o JavaScript.

---

## Documento original: `README_CORRECAO_AMEND_ASSINATURA.md`

# Correção de Empenhos em Processo de Assinatura

Atualização aplicada conforme orientação: no cálculo de **Empenhos em Processo de Assinatura**, foram desconsideradas as ordens de compra da planilha `Ordem_de_compra_em_assinatura.xlsx` cuja coluna **ALTERAÇÃO** inicia com `AMEND`.

## Resultado da correção

- Registros originais em assinatura: 9
- Registros desconsiderados por `ALTERAÇÃO` iniciando com `AMEND`: 3
- Registros considerados no cálculo: 6
- Valor desconsiderado: US$ 285,768.87
- Novo total de empenhos em processo de assinatura: US$ 25,606,045.24

A regra foi aplicada nos dados embutidos das páginas de Crédito Disponível / Visão Executiva e nos arquivos `credit-data.js` em raiz e em `assets/js/`.

---

## Documento original: `README_CORRECAO_ATUALIZACAO_DADOS_16072026.md`

# Correção da atualização de dados do Painel_CABW

Este pacote parte da última versão publicada e reaplica as correções anteriores que haviam sido perdidas na atualização apenas dos dados.

## Correções reaplicadas

- Contratos administrativos novamente restritos aos contratos cujo **Grande Comando é CW**.
- Contratos FMS classificados pelo fornecedor/CAGE **W2525**.
- Demais contratos classificados como finalísticos.
- Classificação de **Ordenação de Despesas pela CABW** versus **OM Requisitante** preservada da versão corrigida anterior para todos os contratos já existentes.
- Números das faturas restaurados no detalhamento do gráfico de faturamento mensal por PO, usando o campo `FATURA` da planilha `NL_requisicao.xlsx`.
- Demais arquivos de dados atualizados da última rodada foram mantidos.

## Validação

- Total de contratos: 136
- Administrativos (GC=CW): 28
- Finalísticos: 55
- FMS: 53
- Itens de faturamento mensal com fatura preenchida: 2388 de 2388

Para publicar, envie o conteúdo interno deste ZIP diretamente para a raiz do repositório GitHub Pages.

---

## Documento original: `README_CORRECAO_CARD_DATAS_FILTROS_20260805.md`

# Correção do pacote — 05/08/2026

## Alterações aplicadas

- Card de Contratos da página inicial corrigido para 28 Administrativos, 52 FMS e 56 Finalísticos.
- Incluído rodapé discreto, em cinza-claro, com as datas dos arquivos utilizados em cada painel.
- Padronizada a busca das categorias dos filtros: enquanto houver texto, aparecem somente as opções que contêm os caracteres digitados; ao apagar o texto, todas as opções reaparecem.
- A comparação dos filtros ignora maiúsculas, minúsculas e acentos.
- Correção reforçada nos painéis de Contratos, Crédito, RP e Suprimento de Fundos.

## Dados de contratos

A fonte permanece sendo a nova planilha `controle_financeiro_contratos.XLS`, com 136 contratos e 52 registros FMS.

---

## Documento original: `README_CORRECAO_CONTRATOS_DADOS.md`

# Correção dos dados de contratos

Correção aplicada sem alterar HTML, CSS ou scripts de front-end.

Ajuste realizado:
- `contracts-data.js` e `assets/js/contracts-data.js` passaram a incluir a chave `records`, além das chaves já existentes.
- Cada contrato passou a conter o alias `category`, compatível com o `contracts-panel.js` atual.

Motivo:
- O painel de contratos utiliza `window.CABW_CONTRACTS_DATA.records` e o campo `category` para filtrar as categorias `administrativos`, `finalisticos` e `fms`.
- Os dados atualizados estavam apenas em `contracts` e com o campo `categoria`, o que fazia os cards e tabelas aparecerem zerados.

Front-end preservado.

---

## Documento original: `README_CORRECAO_CRITERIO_ATRASO_DPE.md`

# Correção do critério de requisição atrasada no painel de RP

Esta versão corrige a documentação e consolida o critério usado no painel de RP para o filtro **Requisição atrasada**.

## Regra correta

O campo `DSCPT` não deve ser utilizado como parâmetro para atraso de DPE.

A marcação **SIM** em `requisicaoAtrasada` passa a ser mantida exclusivamente quando a ordem de compra em RP possuir requisição vinculada com DPE identificada como atrasada/vencida na base de requisições.

## Validação desta versão

- Registros de RP marcados como SIM: 131
- Registros de RP marcados como NÃO: 783

A atualização não altera layout, filtros, gráficos, tooltips, classificação de contratos, cards da página inicial ou demais correções já aplicadas.

---

## Documento original: `README_CORRECAO_DADOS_COMPLETOS.md`

# Correção de dados completa

Este pacote corrige somente a estrutura dos arquivos de dados consumidos pelo front-end existente.

Arquivos alterados:
- credit-data.js
- contracts-data.js
- assets/js/credit-data.js
- assets/js/contracts-data.js

O HTML, CSS e scripts de interação dos painéis foram preservados.

Resumo:
- Dígitos: 278
- Ordens de compra 2026: 684
- POs em assinatura: 3
- Contratos: 136
- Saldo disponível: 3,357,645.15
- Valor OC 2026: 93,034,471.08
- Valor assinatura: 16,984.94

---

## Documento original: `README_CORRECAO_DROPDOWN_MULTIFILTROS.md`

# Correção dos filtros com múltipla seleção

Este pacote corrige os filtros para funcionarem como dropdowns com checkboxes.

- As opções não ficam mais todas visíveis antes do clique.
- Ao clicar no campo, a lista abre.
- É possível marcar mais de uma opção em cada filtro.
- A lógica foi aplicada nos filtros da Visão Executiva/Crédito e nos filtros dos painéis de Contratos.
- Os selects originais são mantidos ocultos para preservar a lógica de filtragem já existente.

---

## Documento original: `README_CORRECAO_DROPDOWN_TAMANHO_OM.md`

# Correção de dropdowns e filtro de OM

- Ajustado o CSS dos dropdowns multiseleção para que a janela abra compacta e proporcional ao campo.
- Corrigido o tamanho dos checkboxes para evitar zoom/desproporção visual.
- Removidas opções de OM sem letras, incluindo `96212924.24 - 96212924.24`, mantendo somente siglas/nomes de OM.
- Mantida a seleção múltipla por checkbox em cada filtro.

---

## Documento original: `README_CORRECAO_FILTROS_ORDENACAO.md`

# Correção de filtros e ordenação

Correções aplicadas neste pacote:

- Os menus multiseleção dos filtros permanecem fechados ao carregar a página.
- O seletor nativo original fica oculto após a criação do componente customizado.
- Ao abrir um filtro, as opções aparecem em camada sobreposta sem expandir a área dos filtros.
- A tabela de dígitos da Visão Executiva passou a ser ordenada pelo maior saldo disponível para o menor.
- A tabela de detalhamento também usa a mesma ordenação por saldo decrescente.

---

## Documento original: `README_CORRECAO_FMS_FINALISTICOS.md`

# Correção de dados de contratos FMS e finalísticos

Pacote atualizado com a nova planilha controle_financeiro_contratos.xlsx, restaurando os dados das categorias Administrativos, Finalísticos e FMS, preservando os demais ajustes de filtros, relatórios, suprimento de fundos e autenticação existentes no pacote base.

---

## Documento original: `README_CORRECAO_GOVERNANCA_RP.md`

# Correção Governança e RP

Atualizações realizadas:
- Suprimento de Fundos: rótulo de empresa do gráfico agora inclui Unidade Requisitante.
- Governança: cards com identidade visual alinhada à área de contratos.
- RP: card de saldo acumulado calculado a partir de POs anteriores a 2026.
- PAAC, Calendário Administrativo e CABW em números: exibem apenas "Em desenvolvimento".
- Painel RP criado com filtros, relatório e gráfico de evolução mensal dos saldos de RP em 2026.

Validações:
- Total RP: US$ 47,791,150.30
- Registros RP 2022-2025: 10711
- NL 2026 vinculadas a RP: 1180
- Ordens SF: 1046

---

## Documento original: `README_CORRECAO_GRAFICO_LINHAS_RP.md`

# Correção do gráfico de linhas do painel de RP

Ajustes aplicados:

1. O gráfico de linhas do painel de Restos a Pagar passou a reconstruir a evolução mensal do saldo de RP a partir de duas bases:
   - `ordem_de_compra.xlsx`, para o saldo atual das POs emitidas de 2022 a 2025;
   - `NL_requisicao.xlsx`, para identificar as liquidações de 2026 que abateram saldo de POs inscritas em RP.

2. A regra adotada foi:
   - saldo inicial em janeiro de 2026 = saldo atual da PO + soma das liquidações de 2026 da mesma PO;
   - saldo de cada mês = saldo anterior abatido pelas NLs de liquidação daquele mês.

3. A série de POs de 2025 foi corrigida para iniciar em aproximadamente US$ 92,4 milhões, conforme esperado para o saldo inscrito no início de 2026.

4. O gráfico deixa de exibir meses futuros ainda não ocorridos. Com a base atual, são exibidos apenas o ponto inicial de janeiro e os meses com liquidações já registradas em 2026.

5. O eixo Y foi ajustado para usar autorange dinâmico. Ao ocultar uma série pela legenda, o eixo se reajusta para permitir a análise de séries com valores menores.

6. A informação complementar de liquidações 2026 passa a considerar a base reconstruída de RP, inclusive POs que já foram totalmente liquidadas em 2026.

---

## Documento original: `README_CORRECAO_HERO_RELATORIOS.md`

Correção aplicada: restauração da imagem de fundo institucional na página principal e reposicionamento da área de relatórios ao lado direito dos filtros nos painéis solicitados.

---

## Documento original: `README_CORRECAO_LAYOUT_HERO_RELATORIOS_OM.md`

# Correção de layout, fundo e detalhamento por OM

Ajustes aplicados:

- Reforçada a imagem institucional da página principal como fundo do hero, também embutida no HTML para evitar falha de caminho no GitHub Pages.
- Corrigido o layout de filtros e relatórios nos painéis de Visão Executiva e Contratos para manter áreas separadas lado a lado.
- O menu passou a exibir “Detalhamento por OM” no lugar de “Análise por UG”.
- Removidos da página de detalhamento por OM os elementos estáticos antigos de ranking/gráfico por UG que não estavam baseados na planilha de dígitos.
- Mantidos os componentes dinâmicos de filtros, relatório, gráfico e tabela do detalhamento por OM.

---

## Documento original: `README_CORRECAO_OM_RP_LIQUIDACOES.md`

# Correção de OM requisitante no painel de RP e tabela de liquidações

Alterações realizadas:

1. A OM requisitante das ordens de compra do painel de RP passou a ser identificada pelo prefixo de dois caracteres da requisição vinculada à PO, com tradução pela planilha `descricao_OM.xlsx`.
2. O filtro, o gráfico e a tabela passaram a exibir **OM Requisitante** com base nessa regra, evitando uso indevido da unidade registrada diretamente na ordem de compra.
3. Foi incluída uma tabela abaixo dos gráficos de barras e acima da tabela de PO com as principais liquidações do mês anterior (`05/2026`), usando `NL_requisicao.xlsx`.
4. A tabela mostra até 10 itens, com PO, data da PO, empresa contratada, descrição da requisição liquidada e valor liquidado, ordenados do maior para o menor valor.
5. A tabela de liquidações respeita os filtros aplicados no painel de RP.

Registros com OM recalculada: 282.

---

## Documento original: `README_CORRECAO_RP_DADOS_17072026.md`

# Correção do painel de RP sem dados

Correção aplicada no pacote de 17/07/2026 para restaurar a exibição dos dados no painel de Restos a Pagar.

O problema foi causado pela ausência, no `rp-panel.js` publicado, das funções auxiliares usadas pelos cards superiores de RP (`rpCardStats`, `compactMoney` e `pctLiquidado`). Como essas funções eram chamadas antes da renderização dos gráficos e tabelas, o JavaScript era interrompido e os dados não apareciam no painel.

Ajustes aplicados:

- restauradas as funções auxiliares dos cards de RP;
- mantido o cálculo de RP atual, RP inscrito e percentual liquidado;
- preservado o gráfico de evolução por ano e o novo gráfico de evolução mensal/projeções;
- mantidas as correções anteriores de filtros, OM requisitante, tipo de processo, liquidações e tooltips.

---

## Documento original: `README_CORRECAO_RP_DADOS_NAO_EXIBIDOS.md`

# Correção - Painel de RP sem exibição de dados

Correção aplicada ao pacote `17072026_risco_sf_rp_projecao`.

## Problema identificado

O painel de RP não exibia os dados porque o arquivo `rp-panel.js` chamava funções auxiliares dos cards superiores de RP sem que elas estivessem definidas no pacote entregue:

- `rpCardStats()`
- `compactMoney()`
- `pctLiquidado()`

Com isso, a execução do JavaScript era interrompida no início da renderização do painel, antes de preencher indicadores, gráficos, filtros e tabelas.

## Correção aplicada

Foram reinseridas as funções auxiliares no `rp-panel.js`, preservando as demais correções já realizadas:

- cards de RP geral, RP 2022, RP 2023, RP 2024 e RP 2025;
- cálculo de RP inscrito como saldo atual + liquidações 2026;
- percentual liquidado;
- gráfico de evolução por ano;
- gráfico de evolução total com projeção linear e projeção por DPE;
- tooltips de RP;
- tabela de principais liquidações;
- filtros sem seleção inicial.

A mesma correção foi aplicada também na cópia `assets/js/rp-panel.js`, para manter a consistência do pacote.

## Validação

Foi validado que o script volta a preencher:

- saldo total de RP;
- quantidade de ordens de compra;
- cards superiores;
- tabela de ordens de compra.

---

## Documento original: `README_CORRECAO_SUPRIMENTO_FUNDOS_06072026.md`

# Correção da área de Suprimento de Fundos

Pacote gerado a partir da última versão corrigida do Painel_CABW, preservando as correções já aplicadas e ajustando a área de Suprimento de Fundos para manter a apresentação validada em 06/07/2026.

Ajustes aplicados:
- restauração dos nomes e rótulos da área de Suprimento de Fundos para a visão por pessoa / OM requisitante;
- correção dos rótulos do gráfico de barras para permitir leitura das categorias longas;
- tooltips do gráfico de barras com nome completo da pessoa/empresa, OM requisitante, valor faturado, total empenhado e saldo empenhado não faturado;
- tooltip do gráfico de pizza com valor e percentual;
- manutenção da base de dados atualizada e das demais correções já incorporadas ao painel.

Arquivos alterados em relação à última versão corrigida:
- `suprimento-fundos.html`;
- `suprimento-fundos.js`;
- este README.

---

## Documento original: `README_CORRECAO_VISUAL_DADOS.md`

# Correção visual e atualização de dados

Este pacote corrige os pontos indicados:

- Fundo da entrada atualizado para `assets/img/hero_kc390_cabw.png`, criado a partir da imagem KC-390 anexada, sem etapa generativa.
- Ícones dos cartões principais substituídos por ícones Bootstrap embutidos no HTML, evitando quadrados brancos quando imagens não carregam.
- Contratos atualizados com `controle_financeiro_contratos(1).XLS`.
  - Administrativos por `GRAND COMANDO = CW`: 26.
  - FMS por `CAGE = W2525`: 53.
  - Finalísticos: 57.
- Crédito disponível atualizado com `digitos(1).xlsx`.
  - Total de saldo disponível: US$ 3.953.301,18.
  - Painéis ajustados aos nomes dos campos existentes na planilha.
- Menu e cartão `Requisições` renomeados para ``.

Publique o conteúdo interno do ZIP diretamente na raiz do repositório GitHub Pages.

---

## Documento original: `README_CORRECAO_VISUAL_RESPONSIVIDADE.md`

# Correção visual e responsividade

Pacote corrigido para publicação no GitHub Pages.

Ajustes aplicados:
- removido vazamento de código JavaScript/texto na parte inferior dos painéis;
- restaurado o fundo institucional da página principal com imagem embutida em alta resolução;
- mantidas as melhorias de responsividade para celular/tablet;
- preservados os dados e a estrutura atual do site.

---

## Documento original: `README_FILTROS_OM_PROJETOS.md`

# Correção de filtros de OM e Projetos

Atualização aplicada para detalhar os filtros com base em `descricao_OM(3).xlsx` e `descricao_projetos(3).xlsx`.

- O filtro de OM não apresenta números de UG.
- As opções de OM são exibidas como `SIGLA - NOME DA OM`.
- As opções de projeto são exibidas como `SIGLA - NOME DO PROJETO`.
- A filtragem foi ajustada para usar esses rótulos detalhados sem perder a compatibilidade com os dados internos.

---

## Documento original: `README_MELHORIA_TABELA_CONTRATOS_VENCIMENTO.md`

# Melhoria da tabela de contratos - vencimentos e Grande Comando

Pacote atualizado para melhorar a leitura da tabela de contratos nos painéis de Contratos Administrativos, Contratos Finalísticos e FMS.

## Alterações aplicadas

1. A tabela de contratos passou a ser ordenada pelo vencimento mais próximo, facilitando a identificação dos contratos vencidos ou próximos do fim da vigência.
2. Foi incluída a coluna **Dias p/ vencer**, com indicação visual por etiqueta.
3. A coluna **Grande Comando** foi mantida e destacada por chip visual para facilitar a leitura.
4. A coluna **Vigência** foi renomeada visualmente para **Situação**, mantendo a mesma regra de classificação:
   - Vigência expirada;
   - Vencimento em até 90 dias;
   - Vencimento entre 90 e 150 dias;
   - Vencimento acima de 150 dias;
   - Sem data final.
5. As linhas de contratos vencidos ou próximos do vencimento receberam destaque visual:
   - vencidos: destaque em vermelho claro;
   - até 90 dias: destaque amarelo;
   - entre 90 e 150 dias: destaque amarelo suave.
6. O relatório gerado pelo painel também recebeu a nova coluna **Dias p/ vencer** e passou a listar os contratos na mesma ordem de criticidade.

## Arquivos alterados

- `contracts-panel.js`
- `assets/js/contracts-panel.js`
- `contratos-administrativos.html`
- `contratos-finalisticos.html`
- `fms.html`
- `style.css`
- `css/style.css`

As demais correções já aplicadas no pacote foram preservadas.

---

## Documento original: `README_PUBLICACAO.md`

# Publicação no GitHub Pages - Painel CABW

Este pacote foi gerado com o CSS visual crítico embutido diretamente nos arquivos HTML. Assim, a página de entrada não deve aparecer com fundo branco mesmo que o navegador demore a carregar `css/style.css`.

## Como publicar

1. Apague o conteúdo antigo do repositório/pasta publicada.
2. Extraia este ZIP.
3. Envie o conteúdo interno diretamente para a raiz publicada do GitHub Pages.
4. A estrutura esperada é:

```text
index.html
css/style.css
assets/img/hero_aircraft_clean.png
assets/img/hero_eagle.png
assets/icons/home-credit.png
assets/js/contracts-data.js
```

Não publique uma pasta contendo esses arquivos; publique os arquivos na raiz.

## Teste

Depois da publicação, abra:

```text
https://cabwbi.github.io/siscab/CHECK_PUBLICACAO.html
```

Todos os itens devem aparecer como OK. Se algum item falhar, o arquivo não foi enviado no caminho correto.

## Observação

A identidade visual foi preservada com os arquivos e classes do site de referência, e o CSS foi também embutido nos HTMLs para evitar tela branca causada por ausência ou cache de `css/style.css`.

---

## Documento original: `README_RECORRECAO_16072026.md`

# Recorreção e atualização - Painel_CABW 16/07/2026

Pacote gerado a partir da última versão corrigida, preservando a estrutura visual e funcional da versão validada de 06/07/2026 e reaplicando correções específicas que haviam regredido.

Correções aplicadas nesta rodada:

1. Painel de RP: tooltip dos gráficos de RP por empresa e por OM requisitante reformatado com quebras de linha, alinhamento à esquerda e detalhamento legível de PO, empresa, objeto resumido e valor de RP.
2. Painel de RP: identificação de requisições atrasadas corrigida. O marcador agora considera somente requisição com DPE vencida/registrada como atrasada na requisição vinculada à PO. O campo `DSCPT` não é parâmetro para atraso de DPE.
3. Página inicial: cards de entrada passaram a apresentar indicadores macro:
   - Crédito Disponível: crédito total disponível (US$ 3,2 mi);
   - Contratos: 28 Administrativos, 53 FMS e 55 Finalísticos;
   - Governança: RP total atual (US$ 47,1 mi).
4. A classificação de contratos administrativos foi preservada como somente contratos com Grande Comando `CW`.
5. Mantidas as correções anteriores do RP: ano da PO, tipo de processo, cards com RP inscrito/liquidado, gráfico de linhas reconstruído pelas liquidações da NL, OM requisitante por prefixo da requisição e tabela de liquidações do mês anterior.

Validação rápida:
- Requisições em RP marcadas como atrasadas: 131.
- Requisições em RP marcadas como não atrasadas: 783.
- RP atual total: US$ 47,1 mi.

Publicação: enviar o conteúdo interno do ZIP diretamente para a raiz do repositório GitHub Pages.

---

## Documento original: `README_RELATORIOS_FILTROS.md`

Atualização: área de relatórios nos painéis de Visão Executiva e Contratos; filtros iniciam sem seleção; logo CABW ajustado para não sobrepor menu.

