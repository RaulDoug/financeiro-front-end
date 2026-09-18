# Tasks: Contagem Fracionada de Parcelas de Cartão de Crédito

> feature: contagem-parcelas-cartao

## T-194 — Especificação formal onp-spec-driven [concluida]
- Refs: US-081, AC-304, AC-305, AC-306, AC-307, AC-308
- Arquivos: `.spec/features/contagem-parcelas-cartao/spec.md`, `.spec/features/contagem-parcelas-cartao/tasks.md`
- Notas: Especificação de critérios fracionados e tarefas de implementação.

## T-195 — Helper formatInstallment e Tipagens TypeScript [concluida]
- Refs: US-081, AC-304, AC-307
- Arquivos: `src/utils/formatInstallment.ts`, `src/types/creditCard.ts`, `src/types/transaction.ts`
- Notas: Criação do formatInstallment e suporte a total_installments e installments_group_id nas interfaces.

## T-196 — Exibição fracionada nas Faturas de Cartão e Telas de Transações [concluida]
- Refs: US-081, AC-305, AC-306
- Arquivos: `src/components/credit-cards/TransactionList.tsx`, `src/components/transactions/TransactionTable.tsx`, `src/components/transactions/TransactionMobileList.tsx`, `src/components/transactions/TransactionDetailsModal.tsx`, `src/components/transactions/TransactionDeleteDialog.tsx`, `src/components/transactions/TransactionFormBase.tsx`
- Notas: Inclusão do badge 1/3 na listagem da fatura e formatação uniforme em modais e tabelas.

## T-197 — Suíte de testes automatizados e validação de regressão [concluida]
- Refs: US-081, AC-304, AC-305, AC-306, AC-307, AC-308
- Arquivos: `test/contagem-parcelas-cartao.spec.test.js`
- Notas: Suíte de testes unitários e estruturais cobrindo todos os ACs da feature via node --test.

