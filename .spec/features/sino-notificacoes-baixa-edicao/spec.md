# Especificação: Atualização Reativa do Sino de Notificações e Edição de Transações Vencidas

> Feature: `sino-notificacoes-baixa-edicao`  
> Referência de Usuário: `US-071`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

1. **Dessincronização do Sino ao Pagar Conta (AC-261)**: O componente `NotificationsBell` consultava alertas de vencimento usando a chave de query `['overdue-alerts', currentWalletId]`. Contudo, o hook de mutação de transações (`useTransactionMutations`) invalidava `['dashboard']` e `['transactions']`, mas não `['overdue-alerts']`. Como resultado, ao efetuar a baixa de uma conta, o sino não atualizava sozinho e continuava exibindo a conta paga no badge e na listagem.
2. **Falha na Ação de Editar no Modal de Detalhes (AC-262, AC-263)**: Ao abrir uma transação vencida através do sino de notificações, a invocação de `useTransactionDetailsModalStore.openModal` não registrava nenhum callback `onEdit`. Como o `TransactionDetailsModal` apenas fechava o modal quando `onEditCallback` não existia, o usuário ficava impossibilitado de editar transações abertas a partir do sino.
3. **Mapeamento de Status da Transação (AC-264)**: Ao instanciar o objeto `Transaction` a partir do alerta no sino, o status deve refletir `status: 'expired'`, permitindo que o badge "Atrasada" e a opção de efetuar pagamento sejam exibidos de maneira consistente.

---

## Critérios de Aceite

### US-071 — Atualização Reativa do Sino e Edição de Transações Vencidas
- **AC-261**: O componente `NotificationsBell` deve unificar sua consulta de alertas utilizando a chave padrão `DASHBOARD_QUERY_KEYS.overdueAlerts(currentWalletId)` compartilhando o cache do TanStack Query com o Dashboard. Adicionalmente, `useTransactionMutations` deve invalidar explicitamente `['dashboard']` e `['overdue-alerts']`, garantindo atualização instantânea do badge e da lista do sino ao quitar qualquer transação.
- **AC-262**: Ao selecionar um item de transação vencida no sino de notificações (`NotificationsBell`), deve passar callback `onEdit` para `openModal`, que por sua vez aciona o modal global de formulário de transação (`useTransactionModalStore.openModal`) com o tipo e dados da transação.
- **AC-263**: O componente `TransactionDetailsModal` deve implementar fallback defensivo em `handleEdit`: caso `onEditCallback` não tenha sido fornecido pelo chamador, deve automaticamente abrir o formulário global de edição (`useTransactionModalStore.openModal`), prevenindo fechamento sem ação em qualquer ponto do sistema.
- **AC-264**: A transação instanciada no manipulador do sino deve registrar `status: 'expired'`, garantindo que os badges visuais de atraso e o botão de baixa imediata ("Efetuar Pagamento") sejam exibidos corretamente.
- **AC-265**: Prova executável automatizada com suíte de testes `test/sino-notificacoes-baixa-edicao.spec.test.js` e relatório `.spec/verification/sino-notificacoes-baixa-edicao.json`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                                      | Status     | Resolução                                                                              |
| ------- | ---------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| ASM-067 | `GlobalTransactionModal` está disponível na árvore global da aplicação em `AppLayout`.         | confirmada | Montado globalmente respondendo a `useTransactionModalStore`.                          |
| ASM-068 | `DASHBOARD_QUERY_KEYS.overdueAlerts` produz chave `['dashboard', walletId, 'overdue-alerts']`. | confirmada | Permite invalidação unificada por prefixo `['dashboard']` e compartilhamento de cache. |

