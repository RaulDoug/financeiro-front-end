# Tasks: Alinhamento de Layout com Design de Referência

> feature: alinhamento-layout-design

## T-116 — Auditoria visual comparativa de todos os layouts [concluida]

- Refs: US-057, AC-187, AC-188, AC-189, AC-190, AC-191, AC-192, AC-193
- Arquivos: src/pages/Dashboard/DashboardPage.tsx, src/pages/Transactions/index.tsx, src/pages/CreditCardsPage.tsx, src/pages/Reports/index.tsx, src/pages/Settings/index.tsx
- Esforço: medio
- Notas: Comparar cada tela com seu respectivo design de referência em `Docs/front_layout`. Documentar as diferenças encontradas (espaçamento, cores, disposição de elementos, tipografia) antes de executar os ajustes. Esta tarefa é pre-requisito das demais desta feature.

## T-117 — Ajuste de layout do dashboard [concluida]

- Refs: US-055, AC-181, AC-182, AC-183
- Arquivos: src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/components/KpiCards.tsx, src/pages/Dashboard/components/AccountBalances.tsx, src/pages/Dashboard/components/RecentTransactions.tsx, src/pages/Dashboard/components/QuickActions.tsx
- Esforço: alto
- Notas: Alinhar grid, espaçamentos e hierarquia ao `Docs/front_layout/dashboard_finflow/screen.png`. KPIs com fonte equilibrada (sem quebra de linha). Ajustar cores, bordas, sombras e layout dos cards de saldo de contas. Verificar seção de ações rápidas e transações recentes.

## T-118 — Ajuste de layout do relatório DRE [concluida]

- Refs: US-056, AC-184, AC-185, AC-186
- Arquivos: src/pages/Reports/AnnualReport.tsx, src/pages/Reports/AnnualChart.tsx
- Esforço: medio
- Notas: Alinhar tabela de meses, badges de poupança/déficit e gráfico de barras ao `Docs/front_layout/relat_rios_anal_ticos_dre/screen.png`. Garantir cores corretas (verde/vermelho), formatação dos valores e estilo do seletor de ano.

## T-119 — Ajuste de layout da tela de transações (web) [concluida]

- Refs: US-057, AC-187
- Arquivos: src/pages/Transactions/index.tsx, src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx
- Esforço: medio
- Notas: Alinhar ao `Docs/front_layout/finflow_web_transa_es_lan_amentos`. Verificar disposição dos filtros, colunas da tabela, badges de status e KPIs de resumo. Fontes dos KPIs dimensionadas para não quebrar linha.

## T-120 — Ajuste de layout da tela de cartões de crédito [concluida]

- Refs: US-057, AC-188
- Arquivos: src/pages/CreditCardsPage.tsx, src/components/credit-cards/CreditCardVisual.tsx, src/components/credit-cards/InvoiceSummary.tsx
- Esforço: baixo
- Notas: Alinhar ao `Docs/front_layout/finflow_web_cart_es_de_cr_dito_faturas`. Verificar layout do card visual, barra de limite, espaçamentos e lista de transações da fatura.

## T-121 — Ajuste de layout das telas de configurações [concluida]

- Refs: US-057, AC-189, AC-190, AC-191, AC-192
- Arquivos: src/pages/Settings/index.tsx, src/pages/Settings/CategoriesSettings.tsx, src/pages/Settings/PayMethodsSettings.tsx, src/pages/Settings/CounterpartiesSettings.tsx, src/pages/BankAccountsPage.tsx
- Esforço: medio
- Notas: Alinhar cada sub-tela ao seu respectivo design de referência em `Docs/front_layout/`. Verificar abas, listagens, botões e empty states.

## T-122 — Ajuste de layout da tela de investimentos [concluida]

- Refs: US-057, AC-193
- Arquivos: src/pages/Investments/index.tsx
- Esforço: baixo
- Notas: Alinhar ao `Docs/front_layout/finflow_web_investimentos_ativos`. Verificar cards de ativos, valores e gráficos.
