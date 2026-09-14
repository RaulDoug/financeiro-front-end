# Tasks: Contas bancarias

> feature: contas-bancarias

## T-053 — Criar Tipos e Integração API para Contas Bancárias [pendente]
- Refs: US-019, US-020
- Arquivos: src/services/api/bankAccounts.ts, src/types/bankAccount.ts
- Notas: Funções GET `/api/bank-account`, POST `/api/bank-account/register`, PATCH `/api/bank-account/update/:display_id`, DELETE `/api/bank-account/delete/:display_id`, além de GET `/api/dashboard-report/account-balances`.

## T-054 — Implementar Hooks React Query (Listar, Criar, Editar, Excluir) [pendente]
- Refs: US-019, US-020
- Arquivos: src/hooks/useBankAccounts.ts, src/hooks/useBankAccountMutations.ts
- Notas: Implementar hooks de query para carregar e hooks de mutação (useMutation) com invalidação da cache. Prever a conversão de `balance` (string) para número (Number) no sucesso da resposta.

## T-055 — Componente: Card da Conta Bancária [pendente]
- Refs: AC-081, AC-082
- Arquivos: src/components/bank-accounts/AccountCard.tsx, src/utils/formatCurrency.ts
- Notas: Construir a exibição do cartão. Se `balance < 0` e `allow_negative_balance` for true, renderizar badge vermelho; exibir o valor monetário formatado. Adicionar menus/botões para Editar e Excluir.

## T-056 — Componente: Totalizador de Saldos [pendente]
- Refs: AC-083
- Arquivos: src/components/bank-accounts/AccountsTotalizer.tsx
- Notas: Utilizar os dados do endpoint de dashboard report (`totalBalances`) para renderizar no topo da página um destaque do saldo somado.

## T-057 — Página Principal de Contas Bancárias [pendente]
- Refs: US-019, US-020
- Arquivos: src/pages/BankAccountsPage.tsx
- Notas: Estruturar o layout integrando `AccountsTotalizer` e a grid de `AccountCard`. Prever botão "Nova Conta". Lidar com os modais de cadastro e deleção.

## T-058 — Formulários e Modais de CRUD [pendente]
- Refs: AC-084, AC-085, AC-086, AC-087, AC-088
- Arquivos: src/components/bank-accounts/AccountFormModal.tsx, src/components/bank-accounts/DeleteConfirmModal.tsx, src/schemas/bankAccountSchema.ts
- Notas: Implementar modal com `react-hook-form` e `zod`. Validar banco (mín 2 chars), balance (default 0), e checkbox de saldo negativo. Modal separado para confirmação da deleção (com botões Confirmar/Cancelar).
