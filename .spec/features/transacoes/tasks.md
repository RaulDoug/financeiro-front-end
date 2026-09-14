# Tasks: Transações

> feature: transacoes

<!--
  T-xxx = tarefa (código de rastreio, único no projeto inteiro).
  Toda tarefa referencia em `Refs:` pelo menos uma US ou AC.
  Toda tarefa lista os arquivos em `Arquivos:` (separados por vírgula).
  Status: pendente | em-andamento | concluida
-->

## T-031 — Tipos TypeScript para transações [concluida]

- Refs: US-011, US-012, US-013, US-015
- Arquivos: src/types/transaction.ts
- Notas: Interfaces para criação, listagem, transferência, atualização e filtros. Inclui os shapes de resposta com pagination (page, limit, total_items, total_pages, has_more) e variações do POST.

## T-032 — Service de comunicação com API de transações [concluida]

- Refs: US-011, US-012, US-013, US-015
- Arquivos: src/services/transactionService.ts
- Notas: Funções para GET (com query params dinâmicos incluindo page e limit), POST, PATCH, DELETE. Trata os 3 shapes de resposta do POST.

## T-033 — Hooks TanStack Query para transações com rolagem infinita [concluida]

- Refs: US-011, AC-043, AC-060
- Arquivos: src/hooks/useTransactions.ts
- Notas: useInfiniteQuery com filtros dinâmicos na queryKey e getNextPageParam baseado em has_more e page da paginação da API. Suporte a invalidação de cache após mutações.

## T-034 — Componente de filtros da listagem [concluida]

- Refs: US-011, AC-044, AC-045
- Arquivos: src/components/transactions/TransactionFilters.tsx
- Notas: Filtros por tipo, status, conta, categoria, contraparte, método, datas, busca textual, ordenação.

## T-035 — Tabela de listagem de transações com IntersectionObserver [concluida]

- Refs: US-011, AC-043, AC-046, AC-060
- Arquivos: src/pages/Transactions/index.tsx, src/components/transactions/TransactionTable.tsx
- Notas: Colunas: data, descrição (com chips), conta/cartão, valor colorido, status, parcela. Observer ou trigger no final da lista para disparar fetchNextPage() da rolagem infinita.

## T-036 — Schemas Zod de validação [concluida]

- Refs: US-012, US-013, AC-048, AC-052
- Arquivos: src/lib/validations/transaction.ts
- Notas: Schemas para receita, despesa, transferência. Descrição min 3 chars, valor positivo, contas distintas em transferência.

## T-037 — Modal de transação com abas [concluida]

- Refs: US-012, US-013, AC-051
- Arquivos: src/components/transactions/TransactionModal.tsx
- Notas: Layout com abas Receita | Despesa | Transferência. Gerenciado por estado global (Zustand store).

## T-038 — Formulário base de transação [concluida]

- Refs: US-012, AC-047
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Campos comuns (valor, descrição, data, status) com React Hook Form. Otimizado para fluxo "Cafézinho" (≤10s).

## T-039 — Lógica do checkbox "Já está pago" [concluida]

- Refs: AC-050
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Ao marcar, define payment_date = hoje automaticamente.

## T-040 — Seletor de categorias filtrado por tipo [concluida]

- Refs: AC-049
- Arquivos: src/components/transactions/CategorySelect.tsx
- Notas: Busca categorias via GET /api/categorie?type=X conforme aba selecionada.

## T-041 — Campos de parcelamento e recorrência [concluida]

- Refs: US-014, AC-054, AC-055
- Arquivos: src/components/transactions/InstallmentFields.tsx
- Notas: Toggle parcelado, campos installments_number, due_day, first_this_month. Bloqueia cartão como receita recorrente.

## T-042 — Mutations de criação de transação [concluida]

- Refs: US-012, US-013, US-014
- Arquivos: src/hooks/useTransactionMutations.ts
- Notas: useMutation para POST. Trata 3 shapes de resposta. Invalida cache de transações + dashboard após sucesso.

## T-043 — Edição de transação e parcelas em lote [concluida]

- Refs: US-015, AC-056, AC-057
- Arquivos: src/components/transactions/TransactionModal.tsx, src/hooks/useTransactionMutations.ts
- Notas: Pré-popula modal com dados existentes. Opção "Aplicar a todas as parcelas" (all_installments).

## T-044 — Diálogo de exclusão com confirmação [concluida]

- Refs: US-015, AC-058, AC-059
- Arquivos: src/components/transactions/TransactionDeleteDialog.tsx, src/hooks/useTransactionMutations.ts
- Notas: Diálogo de confirmação. Opções all_installments e redistribute. Avisa sobre reversão de saldo.
