# Especificação: Contagem Fracionada de Parcelas de Cartão de Crédito

> Feature: `contagem-parcelas-cartao`  
> Referência de Usuário: `US-081`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Ausência de Totalizador de Parcelas (AC-304, AC-306)**: Ao visualizar transações parceladas no sistema, a interface exibia apenas o número cru da parcela atual (ex: `1`) ou `Parcela 1`, sem indicar ao usuário a quantidade total de parcelas da compra (ex: `1/3`, `2/3`, `3/3`).
2. **Omissão de Parcelas na Fatura de Cartões de Crédito (AC-305)**: No detalhamento da fatura de cartão de crédito (`TransactionList.tsx`), as compras parceladas não exibiam qualquer badge identificador de parcela, e ao clicar para abrir o modal de detalhes, o valor de `current_installment` era repassado como `null`.
3. **Contrato de Dados e Resiliência (AC-307)**: O back-end foi atualizado para retornar `total_installments` através de subquery agregada em `GET /api/dashboard-report/credit-card-summary` e `GET /transaction`. O front-end deve tipar adequadamente esses campos (`total_installments`, `installments_group_id`) e formatar de forma defensiva quando o total não estiver disponível.
4. **Padronização Visual com os Layouts de Referência (AC-305, AC-306)**: O layout de referência (`detalhamento_do_cart_o_fatura`) estabelece a exibição fracionada no formato `X/Y` (ex: `3/10`), com badge estilizado em destaque legível e harmonizado com o tema claro e escuro.

---

## Critérios de Aceite

### US-081 — Exibição Fracionada de Parcelas de Cartão e Transações
- **AC-304**: O helper `formatInstallment(current, total)` deve formatar strings no formato `X/Y` (ex: `1/3`), manter strings que já venham no formato fracionado, retornar apenas o número atual caso o total não esteja disponível e retornar `null` se não houver parcela informada.
- **AC-305**: O componente `TransactionList.tsx` na tela de cartões de crédito deve exibir o badge com a contagem fracionada (ex: `1/3`) ao lado da descrição da compra para itens parcelados, e repassar `current_installment`, `total_installments` e `installments_group_id` ao abrir o modal de detalhes.
- **AC-306**: A tabela de transações (`TransactionTable.tsx`), a lista mobile (`TransactionMobileList.tsx`), o modal de detalhes (`TransactionDetailsModal.tsx`), o diálogo de exclusão (`TransactionDeleteDialog.tsx`) e o formulário de edição (`TransactionFormBase.tsx`) devem renderizar a contagem no formato fracionado `X/Y`.
- **AC-307**: As interfaces `CreditCardTransaction` em `src/types/creditCard.ts` e `Transaction` em `src/types/transaction.ts` devem conter as propriedades tipadas `total_installments` e `installments_group_id`.
- **AC-308**: Prova executável automatizada com suíte de testes `test/contagem-parcelas-cartao.spec.test.js` cobrindo todos os critérios de aceitação com `node --test`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                      | Status     | Resolução                                                                             |
| ------- | ---------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| ASM-072 | `GET /api/dashboard-report/credit-card-summary` retorna `total_installments` via subquery SQL. | confirmada | Back-end atualizado pelo usuário com subquery correlacionada filtrando status ativos. |
| ASM-073 | `GET /transaction` retorna `total_installments` e `installments_group_id`.                     | confirmada | Back-end atualizado pelo usuário com subquery correlacionada no select do find.       |
| ASM-074 | O back-end é somente leitura para o assistente conforme governança do projeto.                 | confirmada | Todas as alterações de código foram realizadas exclusivamente no front-end.           |

