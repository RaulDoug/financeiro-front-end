# Plano de execução — toggle-transacoes-recentes-dashboard

> fluxo onp-spec — branch: `spec/toggle-transacoes-recentes-dashboard`

## Resumo — o que vai acontecer

- **4 tarefas planejadas**: 3 tarefas em paralelo/sequencial (Onda 1) + 1 tarefa de testes (Onda 2)
- Escopo 100% contido no front-end (`Front-End_Financeiro`), preservando o back-end somente leitura.

## Faixas e ondas

### Onda 1 — Implementação

#### Faixa 1 — Hooks e State Management
- **Tarefa**: `T-223` — Suporte a `mode` e datas no hook `useRecentTransactions` e store de filtros
- **Arquivos**: `src/hooks/useDashboardData.ts`, `src/stores/filter.store.ts`
- **Ação**: Implementar `recentTransactionsMode` em `useFilterStore` e suporte a busca com `due_date_from`/`due_date_to` no `useRecentTransactions`.

#### Faixa 2 — Componente Visual de Transações Recentes
- **Tarefa**: `T-224` — Implementação do segmented pill toggle no `RecentTransactions.tsx`
- **Arquivo**: `src/pages/Dashboard/components/RecentTransactions.tsx`
- **Ação**: Inserir toggle segmented pill com `data-testid="recent-tx-toggle-group"`, botões `toggle-recent-month` e `toggle-recent-all`, e link contextual `link-view-all-transactions`.

#### Faixa 3 — Integração na Página do Dashboard
- **Tarefa**: `T-225` — Conexão de estado e parâmetros no `DashboardPage.tsx`
- **Arquivo**: `src/pages/Dashboard/DashboardPage.tsx`
- **Ação**: Conectar a store e repassar os parâmetros de data e modo para o hook e o componente.

### Onda 2 — Verificação

#### Faixa 4 — Testes Automatizados de Especificação
- **Tarefa**: `T-226` — Testes automatizados de especificação AC-338 a AC-341
- **Arquivo**: `test/toggle-transacoes-recentes-dashboard.spec.test.js`
- **Ação**: Validar a lógica de filtragem mensal, renderização dos seletores toggle, links dinâmicos e persistência da preferência do usuário.
