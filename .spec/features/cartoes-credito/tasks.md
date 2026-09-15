# Tasks: Cartoes credito

> feature: cartoes-credito

## T-045 — Implementar Tipos e Integração API para Cartões [concluida]
- Refs: US-016, US-017
- Arquivos: src/services/api/creditCards.ts, src/types/creditCard.ts
- Notas: Criar chamadas para GET `/api/pay-method` filtrando `credit_card === true` e GET `/api/dashboard-report/credit-card-summary?includeTransactions=true&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.

## T-046 — Implementar Hook de Cartões [concluida]
- Refs: US-016, US-017
- Arquivos: src/hooks/useCreditCards.ts
- Notas: Implementar hooks do React Query para buscar a listagem e o resumo das faturas com suporte a parâmetros startDate e endDate.

## T-047 — Componente: Cartão Visual Interativo com Menu de Ações [concluida]
- Refs: AC-069, AC-077, AC-078
- Arquivos: src/components/credit-cards/CreditCardVisual.tsx, src/components/credit-cards/CreditCardMenu.tsx
- Notas: Construir a representação visual (simulando cartão físico) com menu de 3 pontos para editar (nome, conta, datas) e excluir.

## T-048 — Componente: Barra de Limite Colorida [concluida]
- Refs: AC-070, AC-071, AC-072
- Arquivos: src/components/credit-cards/LimitBar.tsx
- Notas: Exibir a barra e alterar a cor dinamicamente: verde (<60%), amarela (60%-80%), vermelha (>80%).

## T-049 — Componente: Resumo da Fatura com Navegação Mensal [concluida]
- Refs: AC-073, AC-074
- Arquivos: src/components/credit-cards/InvoiceSummary.tsx, src/components/credit-cards/TransactionList.tsx, src/components/credit-cards/InvoiceMonthSelector.tsx
- Notas: Mostrar totais e listar transações com seletor de mês (< Mês/Ano >) para navegação no histórico de faturas.

## T-050 — Página Principal de Cartões [concluida]
- Refs: US-016, US-017
- Arquivos: src/pages/CreditCardsPage.tsx
- Notas: Compor a lista de `CreditCardVisual` e exibir os dados, incluindo estados de loading e erro.

## T-051 — Integração API e Hook para Mutações de Cartão (Criar/Editar/Excluir) [concluida]
- Refs: US-018, AC-075, AC-076, AC-077, AC-078
- Arquivos: src/services/api/creditCards.ts, src/hooks/useCreditCardMutations.ts
- Notas: Funções POST `/api/pay-method/register`, PATCH `/api/pay-method/update/:id` e DELETE `/api/pay-method/delete/:id`. Invalida queries de pay-methods e dashboard.

## T-052 — Formulário e Modal de Cadastro/Edição de Cartão [concluida]
- Refs: US-018, AC-075, AC-076, AC-077
- Arquivos: src/components/credit-cards/CreditCardModal.tsx, src/components/credit-cards/CreditCardForm.tsx, src/components/credit-cards/CreditCardDeleteDialog.tsx, src/schemas/creditCardSchema.ts
- Notas: Criar formulário reutilizável para cadastro e edição com react-hook-form + zod validando conta bancária, datas e dígitos. Diálogo de confirmação para exclusão.
