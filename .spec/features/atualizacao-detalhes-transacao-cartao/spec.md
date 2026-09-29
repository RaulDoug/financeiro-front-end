# Especificação: Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão

> Feature: `atualizacao-detalhes-transacao-cartao`  
> Referência de Usuário: `US-098`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

Ao abrir os detalhes de uma transação a partir da tela de Cartões (`CreditCardsPage` -> `InvoiceSummary` -> `TransactionList`):
1. **Cache desatualizado na reabertura**: Ao efetuar o pagamento diretamente pelo modal (`TransactionDetailsModal`), o modal fecha. Ao reabrir a transação pela listagem da fatura, ela continuava sendo exibida com status "Pendente" até que a página inteira fosse recarregada (`F5`).
2. **Invalidação incompleta de mutações**: `useTransactionMutations` invalidava consultas genéricas mas não invalidava a chave `['transaction-detail']` e não refetchava ativamente `['credit-card-summary']` e `['credit-cards']`.
3. **Stale time excessivo**: `TransactionDetailsModal` continha `staleTime: 1000 * 30`, impedindo a busca de dados frescos ao reabrir a transação dentro de 30 segundos.
4. **Mapeamento estático na lista**: `TransactionList` definia `payment_date: null` de forma fixa e não repassava os identificadores de conta e pagamento.

---

## Critérios de Aceite

### US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
- **AC-352**: Invalidação de `transaction-detail` e refetch ativo com `type: 'active'` para `credit-card-summary` e `credit-cards` na rotina `invalidate()` de `useTransactionMutations.ts`.
- **AC-353**: Configuração de `staleTime: 0` na query sob demanda do `TransactionDetailsModal.tsx` e importação de `useQueryClient` para controle direto de cache.
- **AC-354**: Mapeamento completo de `payment_date`, `bank_account_id` e `pay_methods_id` em `TransactionList.tsx`, tipagem atualizada em `CreditCardTransaction` e exibição de badge "Paga" para transações concluídas.
- **AC-355**: Atualização imediata do cache (`setQueryData`) e invalidação direcionada em `handleConfirmPayment` no `TransactionDetailsModal.tsx`.
- **AC-356**: Conformidade e rastreabilidade da especificação onp-spec-driven para a US-098 com 100% dos testes aprovados em `test/atualizacao-detalhes-transacao-cartao.spec.test.js`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                    | Status     | Resolução                                                              |
| ------- | -------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| ASM-094 | O back-end já retorna status `completed` e campos `payment_date` ao atualizar transações.    | confirmada | Validado nos serviços da API e verificado nos contratos de resposta.   |
| ASM-095 | A sincronização deve ocorrer reativamente sem exigir recarregamento forçado da página (F5). | confirmada | Implementado via TanStack Query invalidation e setQueryData otimista. |
