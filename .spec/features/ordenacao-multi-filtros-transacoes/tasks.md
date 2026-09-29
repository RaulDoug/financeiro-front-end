# Tasks: Ordenação por Colunas e Filtro Multi-Seleção em Transações

> feature: ordenacao-multi-filtros-transacoes

## T-208 — Componente MultiSelect e integração nos Filtros Avançados [concluida]
- Refs: US-088, AC-322, AC-323, AC-324
- Arquivos: src/components/common/MultiSelect.tsx, src/components/transactions/TransactionAdvancedFiltersModal.tsx, src/pages/Transactions/index.tsx
- Esforço: medio
- Notas: Criar componente MultiSelect com busca, checkboxes, chips e contagem. Integrar em TransactionAdvancedFiltersModal para Categorias, Contas e Métodos. Atualizar TransactionsPage para repassar os filtros para pastOverdueData.

## T-209 — Ordenação dinâmica pelas colunas da tabela e barra de filtros [concluida]
- Refs: US-087, AC-320, AC-321
- Arquivos: src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionFilters.tsx, src/pages/Transactions/index.tsx
- Esforço: medio
- Notas: Adicionar cabeçalhos clicáveis e indicadores de ordenação em TransactionTable. Sincronizar com TransactionFilters e TransactionsPage mantendo order_by e order_dir nas ações de filtro.

## T-210 — Testes automatizados de especificação AC-320 a AC-324 [concluida]
- Refs: US-087, US-088, AC-320, AC-321, AC-322, AC-323, AC-324
- Arquivos: test/ordenacao-multi-filtros-transacoes.spec.test.js
- Esforço: baixo
- Notas: Testes automatizados validando cabeçalhos de ordenação, estado de ordenação nos filtros, componente MultiSelect, passagem de múltiplos IDs e limpeza dos filtros.
