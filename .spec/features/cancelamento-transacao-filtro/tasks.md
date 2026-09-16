# Tasks: Cancelamento, Reativação e Filtro Exclusivo de Transações

> feature: cancelamento-transacao-filtro

## T-156 — Suporte visual e checkbox de cancelamento na edição [concluida]
- Refs: US-067, AC-240, AC-241
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Adicionar checkbox de cancelamento com data-testid="cancel-transaction-checkbox" visível apenas em modo de edição (initialData presente), com mútua exclusão contra status pago.

## T-157 — Envio de payload com status cancelled [concluida]
- Refs: US-067, AC-242
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Atualizar handleSubmit para definir status: 'cancelled' quando a opção estiver ativa.

## T-158 — Filtro exclusivo de transações canceladas [concluida]
- Refs: US-067, AC-243, AC-244
- Arquivos: src/pages/Transactions/index.tsx, src/components/transactions/TransactionFilters.tsx
- Notas: Ocultar canceladas da visualização padrão "Todas as transações" e exibir apenas quando o filtro de status Cancelados estiver selecionado.

## T-159 — Utilitário de recálculo de status e regras de vencimento [concluida]
- Refs: US-068, AC-245, AC-249
- Arquivos: src/utils/transactionStatus.ts
- Notas: Criar função pura resolveTransactionStatus avaliando isCancelled, isPaid e comparação de due_date contra a data atual.

## T-160 — Mapeamento defensivo de chaves estrangeiras na edição [concluida]
- Refs: US-068, AC-246
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Preservar IDs de conta bancária, forma de pagamento, categoria e contraparte mesmo quando a API retornar apenas nomes descritivos.

## T-161 — Feedback de reativação e integração de salvamento [concluida]
- Refs: US-068, AC-247, AC-248
- Arquivos: src/components/transactions/TransactionFormBase.tsx
- Notas: Exibir banner de preview com data-testid="reactivation-preview", alterar botão de submissão e enviar status recalculado no payload.

## T-162 — Testes automatizados de especificação AC-240 a AC-249 [concluida]
- Refs: US-067, US-068, AC-240, AC-241, AC-242, AC-243, AC-244, AC-245, AC-246, AC-247, AC-248, AC-249
- Arquivos: test/cancelamento-transacao-filtro.spec.test.js
- Notas: Suíte completa com 10 testes cobrindo todos os critérios de aceite com execução via node --test.

