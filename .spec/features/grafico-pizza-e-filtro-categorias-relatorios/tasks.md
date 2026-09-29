# Tasks: Gráfico de Pizza em Relatórios e Filtro de Categorias em Transações

> feature: grafico-pizza-e-filtro-categorias-relatorios

## T-219 — Harmonização visual e contenção de layout do `CategoryChart` de Relatórios [concluida]
- Refs: US-093, AC-334, AC-335
- Arquivos: src/pages/Reports/CategoryChart.tsx
- Esforço: baixo
- Notas: Atualizar `CategoryChart.tsx` para seguir a mesma arquitetura do `CategoryExpenseChart.tsx` da Dashboard: container de gráfico `h-48`, `innerRadius={55}`, `outerRadius={75}`, remoção do `<Legend>` SVG do Recharts, inclusão de legenda HTML scrollável (`data-testid="category-custom-legend"`), paleta `COLORS` consistente, cabeçalho padronizado e classes Tailwind para modo escuro.

## T-220 — Ação de clique e navegação com filtro no Detalhamento de Categorias [concluida]
- Refs: US-094, AC-336, AC-337
- Arquivos: src/pages/Reports/CategoryReport.tsx
- Esforço: baixo
- Notas: No `CategoryReport.tsx`, integrar `useNavigate` e `useFilterStore`. Tornar cada card mobile e linha da tabela desktop interativos com feedback de hover e cursor pointer. Ao clicar, navegar para `/transactions?category_id=${id}&due_date_from=${startDate}&due_date_to=${endDate}` e atualizar a store `transactionFilters`.

## T-221 — Suporte a filtros de categoria e datas via URL no `TransactionsPage` [concluida]
- Refs: US-094, AC-337
- Arquivos: src/pages/Transactions/index.tsx
- Esforço: baixo
- Notas: Atualizar o hook de inicialização de parâmetros de busca (`searchParams`) no `TransactionsPage` para capturar `category_id`, `due_date_from` e `due_date_to`, populando reativamente os filtros da listagem de transações.

## T-222 — Testes automatizados de especificação AC-334 a AC-337 [concluida]
- Refs: US-093, US-094, AC-334, AC-335, AC-336, AC-337
- Arquivos: test/grafico-pizza-e-filtro-categorias-relatorios.spec.test.js
- Esforço: baixo
- Notas: Criar suíte executável via `node --test` validando a estrutura de layout e legenda HTML contida em `CategoryChart.tsx`, a interatividade com navegação e passagem de filtros em `CategoryReport.tsx`, e a assimilação de filtros via `searchParams` em `TransactionsPage`.
