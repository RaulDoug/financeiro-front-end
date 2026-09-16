# Especificação: Cancelamento, Reativação e Filtro Exclusivo de Transações

> Feature: `cancelamento-transacao-filtro`  
> Referências de Usuário: `US-067`, `US-068`, `US-069`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Falta de Opção de Cancelar na Edição (US-067)**: Ao editar transações existentes, não havia como marcá-las como canceladas.
2. **Poluição da Listagem Padrão (US-067)**: Transações canceladas poluiam a listagem geral ("Todas as transações"), quando deveriam aparecer exclusivamente sob o filtro dedicado de "Cancelados".
3. **Persistência do Status Cancelada ao Desmarcar (US-068)**: Ao desmarcar a opção de cancelamento, a transação voltava para a tela padrão, porém mantinha o status `cancelled` no banco de dados. Além disso, se o vencimento for menor que a data atual, o status recalculado deve ser `expired` (vencida), e se futura deve ser `pending` (pendente).
4. **Perda de IDs de Foreign Key (US-068)**: Ao carregar a edição de transações vindas do backend que continham nomes descritivos em vez de IDs crus, os selects de conta e forma de pagamento resetavam para o primeiro item, ocasionando violação de regra de negócio em compras parceladas no cartão de crédito (Erro 400).
5. **Exibição Incorreta de Expired como Cancelada e Erro 500 na Edição (US-069)**: Transações com status `expired` sincronizadas no banco eram renderizadas erroneamente como "Cancelada" no card mobile e nos detalhes devido a fallback cego e limitação em `calculateOverdue`. Na edição, o envio indevido de `status: 'pending'` com vencimento no passado acionava a trava do backend retornando Erro 500.

---

## Critérios de Aceite

### US-067 — Cancelamento de Transação e Filtro Exclusivo
- **AC-240**: Opção visual de cancelamento no formulário de edição (`data-testid="cancel-transaction-checkbox"`).
- **AC-241**: Mútua exclusão entre status cancelado e status pago/recebido.
- **AC-242**: Envio de payload para API com `status: 'cancelled'` ao salvar com a opção marcada.
- **AC-243**: Ocultação estrita de transações canceladas na listagem padrão ("Todas as transações").
- **AC-244**: Exibição isolada e restrita de transações canceladas apenas ao selecionar o filtro `status === 'cancelled'`.

### US-068 — Reativação e Recálculo de Status ao Desmarcar Cancelamento
- **AC-245**: Função pura utilitária `resolveTransactionStatus` com recálculo automático:
  - Se `isCancelled === true` -> `'cancelled'`
  - Se `!isCancelled && isPaid === true` -> `'completed'`
  - Se `!isCancelled && !isPaid && dueDate < hoje` -> `'expired'`
  - Se `!isCancelled && !isPaid && dueDate >= hoje` -> `'pending'`
- **AC-246**: Preservação robusta de chaves estrangeiras (`bank_account_id`, `pay_methods_id`, `category_id`, `counterparty_id`) buscando por ID e fallback por correspondência de nome.
- **AC-247**: Feedback visual de reativação no formulário com `data-testid="reactivation-preview"` e texto dinâmico no botão de submissão ("Reativar como Vencida", "Reativar como Concluída", "Reativar como Pendente").
- **AC-248**: Envio do status recalculado no payload de submissão na atualização da transação.
- **AC-249**: Normalização defensiva e comparação de datas no formato ISO YYYY-MM-DD.

### US-069 — Exibição de Status Expired e Persistência Segura na Edição
- **AC-250**: Tratamento explícito de `status === 'expired'` na listagem mobile (`TransactionMobileList.tsx`), exibindo rótulo e badge de atrasada/vencida e restringindo badge de cancelada unicamente a `status === 'cancelled'`.
- **AC-251**: Tratamento explícito de `status === 'expired'` no modal de detalhes (`TransactionDetailsModal.tsx`) e dashboard (`RecentTransactions.tsx`), prevenindo exibição indevida de "Cancelada".
- **AC-252**: Suporte a `status === 'expired'` no helper `calculateOverdue` de `transactionService.ts`.
- **AC-253**: Preservação de status `expired` na edição de transações vencidas em `TransactionFormBase.tsx`, sem forçar `pending` no payload.
- **AC-254**: Suíte de testes automatizados completa com cobertura para os novos critérios AC-250 a AC-254.
- **AC-255**: Isolamento estrito de transações atrasadas por tipo no filtro da listagem: despesas atrasadas só aparecem em "Todas" e "Despesas"; receitas atrasadas só aparecem em "Todas" e "Receitas"; "Transferências" não exibe atrasadas de despesas/receitas.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                                                | Status     | Resolução                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------- |
| ASM-061 | O backend aceita status `expired` ou `pending` no helper `updateTransactionsHelper.js`.                                  | confirmada | Backend sincroniza automaticamente `status = 'expired'` quando `due_date < hoje`.               |
| ASM-062 | A API de listagem de transações suporta array de status ou filtro client-side para omitir `cancelled` na listagem geral. | confirmada | Aplicado filtro defensivo duplo (parâmetros de query e filtro em memória `allTransactions`).    |
| ASM-063 | Transações com status `expired` não devem sofrer alteração para `pending` com data no passado.                           | confirmada | Payload preserva status `expired`, impedindo violação da regra de negócio `isExpiredToPending`. |

