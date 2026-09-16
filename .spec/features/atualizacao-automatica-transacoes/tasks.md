# Tasks: Atualização Automática de Transações

> feature: atualizacao-automatica-transacoes

## T-130 — Orquestração de invalidação e refetch no hook useTransactionMutations [concluida]
- Refs: US-061, AC-211, AC-214
- Arquivos: src/hooks/useTransactionMutations.ts
- Esforço: baixo
- Notas: Atualizar o helper `invalidate` para ser `async`, executando `queryClient.invalidateQueries` e `queryClient.refetchQueries` de queries ativas (`transactions`, `transactions-overdue-past`, `dashboard`, `bank-accounts`, `credit-cards`), e retornando a Promise para que `mutateAsync` aguarde a conclusão da sincronização.

## T-131 — Sincronização síncrona na submissão do modal em TransactionsPage [concluida]
- Refs: US-061, AC-210, AC-214
- Arquivos: src/pages/Transactions/index.tsx
- Esforço: baixo
- Notas: No `handleModalSubmit` e `handleConfirmDelete`, aguardar a mutação e chamar explicitamente `refetch()` do `useTransactions` antes de fechar o modal ou limpar o estado de edição.

## T-132 — Sincronização nos modais de Detalhes da Transação e Dashboard [concluida]
- Refs: US-061, AC-212, AC-213, AC-214
- Arquivos: src/components/transactions/TransactionDetailsModal.tsx, src/pages/Dashboard/DashboardPage.tsx
- Esforço: baixo
- Notas: Em `TransactionDetailsModal.tsx`, aguardar o `updateMutation.mutateAsync` no pagamento e garantir refetch antes de fechar o modal. Em `DashboardPage.tsx`, aguardar mutação e sincronização completa no onSubmit do TransactionModal.

## T-133 — Testes automatizados da especificação de atualização automática [concluida]
- Refs: US-061, AC-210, AC-211, AC-212, AC-213, AC-214
- Arquivos: test/atualizacao-automatica-transacoes.spec.test.js
- Esforço: baixo
- Notas: Criar suíte de testes unitários e de integração checando as anotações `@spec:AC-210` a `@spec:AC-214`, verificando as chaves invalidadas, o comportamento assíncrono das mutações e o refetch ativo das telas.
