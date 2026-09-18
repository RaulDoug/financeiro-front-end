# Especificação: Correções de Parcelamento, Recorrência, Limites e Vínculos de Cartão de Crédito

> Feature: `correcoes-transacoes-parcelamento-cartao`  
> Referência de Usuário: `US-082`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Recorrência e Parcelamento sem Cartão (Bug 1, AC-309)**: Usuários não conseguiam lançar despesas/receitas recorrentes (como aluguel ou assinaturas) sem cartão de crédito com modo de repetição de valor.
2. **Assinaturas Recorrentes de Cartão de Crédito (Bug 2, AC-309)**: Ao lançar uma assinatura mensal em cartão (ex: Netflix, Spotify), o sistema dividia compulsoriamente o valor em vez de repetir o mesmo valor fixo a cada mês (`is_recurrent: true`).
3. **Imutabilidade Estrutural de Parcelas na Edição (Bug 3, AC-310)**: O formulário de edição não deve permitir transformar transações simples em parceladas/recorrentes (`!initialData`). Transações já parceladas devem apenas permitir aplicar alterações em lote em todas as parcelas (`all_installments`).
4. **Atualização de Limite Usado na Troca de Cartão (Bug 4, AC-311)**: Ao alterar a forma de pagamento de um cartão de crédito para outro cartão na edição, o diff de atualização (`buildUpdateTransactionDiff`) preserva e encaminha `pay_methods_id` para o endpoint PATCH, permitindo a sincronização dos limites no back-end.
5. **Redistribuição de Saldo Exclusiva para Parcela Única (Bug 5, AC-312)**: No diálogo de exclusão (`TransactionDeleteDialog`), a opção de redistribuir o saldo entre as parcelas restantes deve ser exibida exclusivamente ao excluir uma única parcela (`!allInstallments`), sendo ocultada e resetada ao selecionar exclusão de todas as parcelas.
6. **Vínculo Automático e Bloqueio da Conta Bancária para Cartão (Bug 6, AC-313)**: Quando o método de pagamento selecionado for cartão de crédito, o seletor de conta bancária deve ser automaticamente preenchido com a conta vinculada ao cartão e ter sua edição desabilitada (`disabled`), sendo liberado imediatamente caso a forma de pagamento seja trocada para um método que não seja cartão de crédito.

---

## Critérios de Aceite

### US-082 — Correções no Fluxo de Parcelamento, Recorrência, Limites e Vínculos de Cartão de Crédito
- **AC-309**: `InstallmentFields` deve fornecer os modos "Dividir valor" e "Repetir valor (Recorrente)", permitindo lançar despesas e assinaturas com `is_recurrent: true` tanto em cartão quanto em métodos não-cartão.
- **AC-310**: Na edição de transação (`initialData`), o bloco de criação de parcelamento não é exibido, mantendo apenas a opção "Aplicar alterações a todas as parcelas desta série" para transações que já possuem `current_installment`.
- **AC-311**: O utilitário `buildUpdateTransactionDiff` e o formulário `TransactionFormBase` preservam e enviam `pay_methods_id` quando a forma de pagamento for alterada entre cartões de crédito na edição.
- **AC-312**: O diálogo `TransactionDeleteDialog` exibe a opção "Redistribuir saldo entre parcelas restantes" apenas quando o usuário escolher excluir uma única parcela (`!allInstallments`), ocultando e desmarcando caso opte por excluir todas as parcelas.
- **AC-313**: Em `TransactionFormBase`, ao selecionar um método de pagamento com `credit_card: true`, a conta bancária vinculada ao cartão é auto-selecionada e o campo de Conta Bancária fica desabilitado para edição, voltando a ficar editável caso o usuário selecione um método que não seja cartão de crédito.
- **AC-314**: Prova executável automatizada com suíte de testes `test/correcoes-transacoes-parcelamento-cartao.spec.test.js` cobrindo todos os critérios de aceitação AC-309 a AC-313 com `node --test`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                       | Status     | Resolução                                                                           |
| ------- | ----------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| ASM-075 | O back-end aceita `is_recurrent: true` tanto em compras de cartão quanto em outras despesas.    | confirmada | Verificado em `creditCardHelper.js` e `recurrentTransactions.js`.                   |
| ASM-076 | O back-end reverte e credita os limites de cartões quando `pay_methods_id` é alterado no PATCH. | confirmada | Ajustado e confirmado pelo usuário no back-end.                                     |
| ASM-077 | O front-end bloqueia a conta bancária quando o método for cartão em criação e edição.           | confirmada | `disabled={isCreditCard}` implementado com sincronização automática do ID da conta. |

