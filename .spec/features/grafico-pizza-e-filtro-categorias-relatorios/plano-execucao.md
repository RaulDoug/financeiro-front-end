# Plano de execução — grafico-pizza-e-filtro-categorias-relatorios

> fluxo onp-spec — branch: `spec/grafico-pizza-e-filtro-categorias-relatorios`

## Resumo — o que vai acontecer

- **4 tarefas planejadas**: 3 tarefas em paralelo (Onda 1) + 1 tarefa de testes (Onda 2)
- Escopo 100% contido no front-end (`Front-End_Financeiro`), preservando o back-end somente leitura.

## Faixas e ondas

### Onda 1 — Implementação Paralela

#### Faixa 1 — Layout e Contenção do Gráfico
- **Tarefa**: `T-219` — Harmonização visual e contenção de layout do `CategoryChart` de Relatórios
- **Arquivo**: `src/pages/Reports/CategoryChart.tsx`
- **Ação**: Substituir `<Legend>` SVG por legenda HTML scrollável (`data-testid="category-custom-legend"`), container `h-48`, `innerRadius={55}`, `outerRadius={75}`, e estilização Tailwind dark mode idêntica à Dashboard.

#### Faixa 2 — Interatividade e Navegação no Relatório
- **Tarefa**: `T-220` — Ação de clique e navegação com filtro no Detalhamento de Categorias
- **Arquivo**: `src/pages/Reports/CategoryReport.tsx`
- **Ação**: Adicionar `useNavigate`, `onClick` nos cards mobile e linhas desktop, repassando `category_id`, `startDate` e `endDate` para a rota `/transactions`.

#### Faixa 3 — Consumo de Filtros via URL em Transações
- **Tarefa**: `T-221` — Suporte a filtros de categoria e datas via URL no `TransactionsPage`
- **Arquivo**: `src/pages/Transactions/index.tsx`
- **Ação**: Capturar `category_id`, `due_date_from` e `due_date_to` de `searchParams` no `useEffect` de inicialização para filtrar a listagem.

### Onda 2 — Verificação

#### Faixa 4 — Testes Automatizados de Especificação
- **Tarefa**: `T-222` — Testes automatizados de especificação AC-334 a AC-337
- **Arquivo**: `test/grafico-pizza-e-filtro-categorias-relatorios.spec.test.js`
- **Ação**: Validar a contenção do layout sem `<Legend>` SVG rígido, legenda customizada com `data-testid`, interatividade de clique em `CategoryReport` e suporte a query params em `TransactionsPage`.
