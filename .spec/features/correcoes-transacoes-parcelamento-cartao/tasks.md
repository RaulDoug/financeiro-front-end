# Tarefas: Correções de Parcelamento, Recorrência, Limites e Vínculos de Cartão de Crédito

> Feature: `correcoes-transacoes-parcelamento-cartao`  
> Metodologia: `onp-spec-driven`

## T-198 — Especificação formal onp-spec-driven [concluida]
- Refs: US-082, AC-309, AC-310, AC-311, AC-312, AC-313, AC-314
- Escopo: Mapear critérios de aceitação para parcelamento/recorrência com e sem cartão, bloqueio de conta bancária, troca de cartão e redistribuição na exclusão.

## T-199 — Suporte a transações recorrentes e assinaturas com divisão/repetição de valor [concluida]
- Refs: US-082, AC-309
- Escopo: Atualizar `InstallmentFields.tsx` com rádio "Dividir valor" vs "Repetir valor (Recorrente)", tipagem `CreateTransactionPayload` com `is_recurrent` e construção de payload em `TransactionFormBase.tsx`.

## T-200 — Bloqueio e sincronização de conta bancária por cartão de crédito [concluida]
- Refs: US-082, AC-313
- Escopo: No `TransactionFormBase.tsx`, desabilitar edição do seletor de conta bancária quando `isCreditCard === true`, sincronizar `bankAccountId` com a conta vinculada ao cartão e liberar quando for não-cartão.

## T-201 — Exclusão de parcela com opção de redistribuição condicional [concluida]
- Refs: US-082, AC-312
- Escopo: Em `TransactionDeleteDialog.tsx`, exibir checkbox "Redistribuir saldo entre parcelas restantes" apenas quando `!allInstallments`, desmarcando e ocultando ao escolher excluir todas.

## T-202 — Suíte de testes automatizados e validação de regressão [concluida]
- Refs: US-082, AC-309, AC-310, AC-311, AC-312, AC-313, AC-314
- Escopo: Criar `test/correcoes-transacoes-parcelamento-cartao.spec.test.js` com testes para AC-309 a AC-314 e validar com `node --test`.

