# Tasks: Persistência de Filtros e Limpeza Padrão em Transações e Dashboard

> feature: persistencia-filtros-navegacao

## T-211 — Store Zustand de filtros e persistência (`filter.store.ts`) [concluida]
- Refs: US-089, US-090, AC-325, AC-327, AC-328, AC-329
- Arquivos: src/stores/filter.store.ts, src/stores/index.ts
- Esforço: medio
- Notas: Criar store Zustand com middleware de persistência gerenciando transactionFilters e dashboardDate. Implementar função de reset para valores padrão (mês atual) e listener para redefinição em troca de carteira.

## T-212 — Persistência e restauração do período no Dashboard [concluida]
- Refs: US-090, AC-328
- Arquivos: src/pages/Dashboard/DashboardPage.tsx
- Esforço: baixo
- Notas: Conectar o seletor de mês e ano do Dashboard ao filter.store.ts para manter a data selecionada entre navegações de tela.

## T-213 — Limpeza com retorno ao mês padrão e persistência de Transações [concluida]
- Refs: US-089, US-090, AC-325, AC-326, AC-327, AC-329
- Arquivos: src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
- Esforço: medio
- Notas: Ajustar handleClear para retornar ao mês atual padrão e zerar filtros secundários; conectar TransactionsPage ao filter.store.ts; tratar precedência de searchParams da URL e visibilidade condicional do botão de limpar filtros.

## T-214 — Testes automatizados de especificação AC-325 a AC-329 [concluida]
- Refs: US-089, US-090, AC-325, AC-326, AC-327, AC-328, AC-329
- Arquivos: test/persistencia-filtros-navegacao.spec.test.js
- Esforço: baixo
- Notas: Criar testes executáveis via node --test validando restauração do mês atual no limpar filtros, visibilidade condicional, persistência do Dashboard, retenção de busca/filtros em Transações e regras de troca de carteira.
