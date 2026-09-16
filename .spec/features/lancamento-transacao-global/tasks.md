# Tasks: Lancamento transacao global

> feature: lancamento-transacao-global

## T-140 — Centralização e montagem do TransactionModal no AppLayout [concluida]
- Refs: US-063, AC-221, AC-222
- Arquivos: src/layouts/AppLayout.tsx, src/components/transactions/GlobalTransactionModal.tsx
- Notas: Implementar GlobalTransactionModal acoplado à useTransactionModalStore e useTransactionMutations e inseri-lo no AppLayout, viabilizando a abertura e criação de transações a partir de qualquer rota.

## T-141 — Saneamento de instâncias locais e ciclo de vida de rota [concluida]
- Refs: US-063, AC-221, AC-223
- Arquivos: src/pages/Dashboard/DashboardPage.tsx, src/pages/Transactions/index.tsx, src/layouts/AppLayout.tsx
- Notas: Remover instância duplicada do TransactionModal no DashboardPage para evitar modais sobrepostos e assegurar limpeza correta do modal na transição de rotas sem quebrar os fluxos locais de edição na TransactionsPage.

## T-142 — Testes automatizados dos critérios de aceite AC-221, AC-222 e AC-223 [concluida]
- Refs: US-063, AC-221, AC-222, AC-223
- Arquivos: test/lancamento-transacao-global.spec.test.js
- Notas: Criar suíte de testes unitários anotados com @spec:AC-221, @spec:AC-222 e @spec:AC-223 validando a cobertura de abertura universal, persistência reativa e não vazamento de estado.

