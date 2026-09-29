# Tasks: Toggle e Filtro de Mês em Transações Recentes do Dashboard

> feature: toggle-transacoes-recentes-dashboard

## T-223 — Suporte a `mode` e datas no hook `useRecentTransactions` e store de filtros [concluida]
- Refs: US-095, AC-338, AC-340, AC-341
- Arquivos: src/hooks/useDashboardData.ts, src/stores/filter.store.ts
- Esforço: baixo
- Notas: Em `src/stores/filter.store.ts`, adicionar estado persistido `recentTransactionsMode: 'month' | 'all'` (padrão `'month'`) e setter correspondente. Em `src/hooks/useDashboardData.ts`, atualizar `useRecentTransactions` e `DASHBOARD_QUERY_KEYS.recentTransactions` para aceitar opções `{ limit, mode, startDate, endDate }`. Quando `mode === 'month'`, buscar via `transactionService.getTransactions` com `due_date_from`, `due_date_to`, `order_by: 'due_date'`, `order_dir: 'DESC'` e mapear para `RecentTransactionItem[]`. Quando `mode === 'all'`, buscar via `dashboardService.getRecentTransactions`.

## T-224 — Implementação do segmented pill toggle no `RecentTransactions.tsx` [concluida]
- Refs: US-095, AC-339, AC-341
- Arquivos: src/pages/Dashboard/components/RecentTransactions.tsx
- Esforço: baixo
- Notas: Adicionar ao `RecentTransactions.tsx` as props `mode?: 'month' | 'all'`, `onModeChange?: (mode: 'month' | 'all') => void`, `dateParams?: { startDate: string; endDate: string }`. Renderizar no cabeçalho o controle com `data-testid="recent-tx-toggle-group"` e botões `data-testid="toggle-recent-month"` e `data-testid="toggle-recent-all"`. Adequar o link `data-testid="link-view-all-transactions"` para direcionar contextualmente para `/transacoes` com filtro de datas no modo mês. Ajustar mensagem de lista vazia.

## T-225 — Conexão de estado e parâmetros no `DashboardPage.tsx` [concluida]
- Refs: US-095, AC-338, AC-339, AC-340
- Arquivos: src/pages/Dashboard/DashboardPage.tsx
- Esforço: baixo
- Notas: No `DashboardPage.tsx`, consumir `recentTransactionsMode` e `setRecentTransactionsMode` de `useFilterStore`. Repassar `dateParams`, `mode` e `onModeChange` para `useRecentTransactions` e `RecentTransactions`.

## T-226 — Testes automatizados de especificação AC-338 a AC-341 [concluida]
- Refs: US-095, AC-338, AC-339, AC-340, AC-341
- Arquivos: test/toggle-transacoes-recentes-dashboard.spec.test.js
- Esforço: baixo
- Notas: Criar suíte executável via `node --test` validando o comportamento do hook `useRecentTransactions` para modo mês e geral, a presença do toggle com `data-testid` no `RecentTransactions.tsx`, o redirecionamento contextual de link e a persistência na store de filtros.
