# Especificação: Baixa de Transações Vencidas via Card de Alertas no Dashboard

> Feature: `baixa-transacao-alertas-vencimento`  
> Referência de Usuário: `US-070`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Falta de Interatividade nos Alertas de Vencimento**: No Dashboard, o card "Alertas de Vencimento" lista as transações em atraso, mas os itens eram puramente estáticos. O usuário não conseguia clicar em uma transação vencida para visualizar seus detalhes ou executar a quitação direta.
2. **Necessidade de Fluxo Ágil de Baixa**: Para dar baixa em uma conta vencida visualizada no card de alerta, o usuário precisava navegar até a página completa de Transações, localizar a transação manualmente e abrir o modal de detalhes.
3. **Resolução**: Permitir que o clique em qualquer transação vencida no componente `OverdueAlerts` abra imediatamente o modal global de detalhes (`TransactionDetailsModal`), onde o usuário pode acionar "Efetuar Pagamento", preencher conta e data, e concluir a baixa em poucos segundos com recálculo reativo do dashboard.

---

## Critérios de Aceite

### US-070 — Acesso e Baixa de Transações Vencidas via Card de Alertas
- **AC-256**: Cada item de transação vencida renderizado no componente `OverdueAlerts` deve apresentar affordance visual e acessibilidade de clique (`cursor-pointer`, estilo hover diferenciado, `role="button"`, `tabIndex={0}`, ativação por `onClick` e teclado `Enter`/`Space`).
- **AC-257**: Ao acionar uma transação vencida em `OverdueAlerts`, deve invocar `openModal` de `useTransactionDetailsModalStore`, mapeando os dados do alerta (`id`, `description`, `value`, `due_date`, `type`, `status: 'expired'`) e callback opcional de edição.
- **AC-258**: O modal de detalhes (`TransactionDetailsModal`) deve reconhecer o status vencido (`status !== 'completed'`) e exibir o botão de ação de quitação (`data-testid="btn-details-pay"`), abrindo o mini-formulário de confirmação de pagamento (`data-testid="payment-mini-form"`).
- **AC-259**: A confirmação do pagamento no mini-formulário (`data-testid="btn-confirm-payment"`) deve disparar a mutação com status `completed`, fechando o modal e invalidando a query `['dashboard']`, o que remove a transação paga do card de alertas e atualiza os totalizadores.
- **AC-260**: Suíte de testes automatizados de especificação cobrindo os critérios AC-256 a AC-260 com prova executável (`test/baixa-transacao-alertas-vencimento.spec.test.js`) e arquivo de verificação `.spec/verification/baixa-transacao-alertas-vencimento.json`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                       | Status     | Resolução                                                                    |
| ------- | ----------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| ASM-064 | O modal `TransactionDetailsModal` já está montado globalmente na aplicação via `AppLayout`.     | confirmada | Montado na raiz do layout (`AppLayout.tsx:91`), respondendo à store Zustand. |
| ASM-065 | O objeto `OverdueAlertItem` possui os dados essenciais para montagem do payload de baixa.       | confirmada | Contém `id`, `description`, `value`, `due_date`, `type` e `days_overdue`.    |
| ASM-066 | A mutação de atualização de transação invalida o cache de queries do dashboard automaticamente. | confirmada | `useTransactionMutations.ts` invalida `['dashboard']` no hook `onSuccess`.   |

