# Tasks: Relatórios

> feature: relatorios

## T-064 — Integração da API de Relatórios (Dashboard) [concluida]

- Refs: US-023, AC-096, AC-097, US-024, AC-099, AC-100
- Arquivos: src/services/reports.service.ts, src/hooks/useReports.ts
- Notas: Implementar chamadas GET para `income-vs-expense?year=` e `expense-by-category?startDate=&endDate=`.

## T-065 — Layout da Tela de Relatórios e Navegação [concluida]

- Refs: US-025, AC-105
- Arquivos: src/pages/Reports/index.tsx, src/pages/Reports/ReportsNavigation.tsx
- Notas: Estrutura base da página `/reports` com abas (Tabs) para alternar entre Anual, Categorias e Contrapartes.

## T-066 — UI do DRE / Comparativo Anual [concluida]

- Refs: US-023, AC-096, AC-097, AC-098
- Arquivos: src/pages/Reports/AnnualReport.tsx, src/pages/Reports/AnnualChart.tsx
- Notas: Tabela com meses (receitas, despesas, saldo, savingsRate) e gráfico de barras (Recharts). Filtro de ano.

## T-067 — UI de Despesas por Categoria [concluida]

- Refs: US-024, AC-099, AC-100, AC-101
- Arquivos: src/pages/Reports/CategoryReport.tsx, src/pages/Reports/CategoryChart.tsx
- Notas: Tabela (posição, categoria, total, porcentagem). Gráfico de pizza/rosca. DatePicker para filtro de datas.

## T-068 — Cálculo e Agrupamento de Contrapartes [concluida]

- Refs: US-025, AC-102
- Arquivos: src/lib/reportUtils.ts, src/hooks/useCounterpartyReport.ts
- Notas: Lógica para buscar transações normais, filtrar por data e agregar somatórios baseados em `counterparty_name`.

## T-069 — UI de Gastos por Contraparte [concluida]

- Refs: US-025, AC-103, AC-104
- Arquivos: src/pages/Reports/CounterpartyReport.tsx
- Notas: Tabela ranqueada mostrando contrapartes, divisão entre receitas/despesas, e percentuais sobre o total.

## T-070 — Refinamentos de Visualização e Tratamento de Erros [concluida]

- Refs: US-023, US-024, US-025
- Arquivos: src/components/ChartEmptyState.tsx, src/pages/Reports/index.tsx
- Notas: Loading states usando Skeletons, formatação monetária robusta nos eixos dos gráficos e tooltips.
