# Plano de execução — lancamento-transacao-global

> gerado conforme metodologia opn-spec-driven em 2026-09-15 18:15

## Resumo — o que vai acontecer

- **3 tarefa(s) planejada(s)**:
  - `T-140`: Centralização e montagem do TransactionModal no AppLayout
  - `T-141`: Saneamento de instâncias locais e ciclo de vida de rota
  - `T-142`: Testes automatizados dos critérios de aceite AC-221, AC-222 e AC-223
- **Branch de trabalho**: `spec/lancamento-transacao-global`

## Detalhamento das Tarefas

### Tarefa T-140 — Centralização e montagem do TransactionModal no AppLayout
- **Objetivo**: Criar o componente `GlobalTransactionModal` conectado à `useTransactionModalStore` e `useTransactionMutations`, inserindo-o no `AppLayout.tsx`.
- **Arquivos**:
  - `src/components/transactions/GlobalTransactionModal.tsx`
  - `src/layouts/AppLayout.tsx`
- **Critérios**: `US-063`, `AC-221`, `AC-222`

### Tarefa T-141 — Saneamento de instâncias locais e ciclo de vida de rota
- **Objetivo**: Remover a duplicação do `TransactionModal` em `DashboardPage.tsx`, garantindo que o Dashboard e outras telas usem a instância global sem duplicação e sem vazamento de estado entre rotas.
- **Arquivos**:
  - `src/pages/Dashboard/DashboardPage.tsx`
  - `src/pages/Transactions/index.tsx`
  - `src/layouts/AppLayout.tsx`
- **Critérios**: `US-063`, `AC-221`, `AC-223`

### Tarefa T-142 — Testes automatizados dos critérios de aceite AC-221, AC-222 e AC-223
- **Objetivo**: Criar suíte executável `test/lancamento-transacao-global.spec.test.js` com anotações `@spec:AC-221`, `@spec:AC-222` e `@spec:AC-223`.
- **Arquivos**:
  - `test/lancamento-transacao-global.spec.test.js`
- **Critérios**: `US-063`, `AC-221`, `AC-222`, `AC-223`

