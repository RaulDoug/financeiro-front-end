# Especificação: Pagamento Completo de Fatura de Cartão de Crédito

> Feature: `pagamento-fatura-cartao`  
> Referência de Usuário: `US-099`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

Na tela de gerenciamento de Cartões de Crédito (`CreditCardsPage` -> `InvoiceSummary`), o usuário acompanha o fechamento da fatura e as compras associadas ao período, porém não possuía uma funcionalidade direta para liquidação e pagamento total da fatura.

A API disponibilizou suporte à liquidação completa de fatura no endpoint `PATCH /api/transaction/update/:id` utilizando a flag `total_invoice: true`, quitando em lote todas as despesas da fatura, debitando o total do saldo da conta bancária indicada e restabelecendo o limite disponível do cartão.

---

## Critérios de Aceite

### US-099 — Pagamento Completo de Fatura de Cartão de Crédito
- **AC-357**: Botão "Pagar Fatura" em `InvoiceSummary.tsx` com estados dinâmicos (ativo para faturas pendentes, "✓ Fatura Paga" quando todas as compras estiverem concluídas, e desabilitado quando não houver compras).
- **AC-358**: Modal de confirmação `PayInvoiceModal.tsx` com resumo do valor da fatura, mês de referência, quantidade de compras pendentes e seletor de conta bancária de débito (padrão predefinido da transação ou cartão).
- **AC-359**: Disparo da requisição `PATCH /api/transaction/update/:id` com payload `{ status: 'completed', total_invoice: true, bank_account_id }` utilizando o ID de uma transação pertencente à fatura.
- **AC-360**: Tratamento no front-end de erros de negócio HTTP 400 (saldo insuficiente na conta bancária e ausência de fatura vinculada), além de feedback visual de sucesso.
- **AC-361**: Envio do header `x-active-wallet-id` via interceptor do `src/lib/axios.ts` e inclusão do campo `total_invoice?: boolean;` na tipagem `UpdateTransactionPayload`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                       | Status     | Resolução                                                              |
| ------- | ----------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| ASM-096 | O endpoint `PATCH /api/transaction/update/:id` aceita o ID de qualquer transação da fatura.    | confirmada | O front-end envia o ID da primeira transação pendente da fatura.       |
| ASM-097 | Ao liquidar a fatura, todas as compras do mês mudam para `completed` e o limite é restaurado. | confirmada | TanStack Query invalida caches de transações, resumo, cartões e contas. |
