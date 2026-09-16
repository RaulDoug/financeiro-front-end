# Tasks: Atualização Reativa do Sino de Notificações e Edição de Transações Vencidas

> feature: sino-notificacoes-baixa-edicao

## T-172 — Especificação e mapeamento onp-spec-driven [concluida]
- Refs: US-071, AC-261, AC-262, AC-263, AC-264, AC-265
- Arquivos: .spec/features/sino-notificacoes-baixa-edicao/spec.md, .spec/features/sino-notificacoes-baixa-edicao/tasks.md
- Notas: Elaboração formal de especificações e rastreabilidade de tarefas.

## T-173 — Sincronização reativa de query e invalidação de cache [concluida]
- Refs: US-071, AC-261
- Arquivos: src/components/layout/NotificationsBell.tsx, src/hooks/useTransactionMutations.ts
- Notas: Alinhar chave de query com DASHBOARD_QUERY_KEYS.overdueAlerts e adicionar invalidação de ['overdue-alerts'] no hook de mutações.

## T-174 — Suporte a edição a partir do sino e fallback defensivo no modal [concluida]
- Refs: US-071, AC-262, AC-263, AC-264
- Arquivos: src/components/layout/NotificationsBell.tsx, src/components/transactions/TransactionDetailsModal.tsx
- Notas: Registrar callback onEdit no sino, atribuir status 'expired' e implementar fallback para GlobalTransactionModal no TransactionDetailsModal.

## T-175 — Suíte de testes automatizados e relatório de verificação [concluida]
- Refs: US-071, AC-261, AC-262, AC-263, AC-264, AC-265
- Arquivos: test/sino-notificacoes-baixa-edicao.spec.test.js, .spec/verification/sino-notificacoes-baixa-edicao.json
- Notas: Criação e execução da suíte de testes com node --test e geração de JSON de auditoria.
