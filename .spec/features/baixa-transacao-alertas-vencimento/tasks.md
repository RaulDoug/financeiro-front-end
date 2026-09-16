# Tasks: Baixa de Transações Vencidas via Card de Alertas no Dashboard

> feature: baixa-transacao-alertas-vencimento

## T-168 — Especificação e mapeamento onp-spec-driven [concluida]
- Refs: US-070, AC-256, AC-257, AC-258, AC-259, AC-260
- Arquivos: .spec/features/baixa-transacao-alertas-vencimento/spec.md, .spec/features/baixa-transacao-alertas-vencimento/tasks.md
- Notas: Elaboração formal da especificação, histórias de usuário, critérios de aceite e rastreabilidade de tarefas.

## T-169 — Acessibilidade e clique interativo em OverdueAlerts [concluida]
- Refs: US-070, AC-256, AC-257
- Arquivos: src/pages/Dashboard/components/OverdueAlerts.tsx
- Notas: Adicionar cursor-pointer, role="button", tabIndex, suporte a eventos onClick e onKeyDown (Enter/Espaço), e integração com useTransactionDetailsModalStore.

## T-170 — Integração com o fluxo de detalhes e baixa de transação [concluida]
- Refs: US-070, AC-258, AC-259
- Arquivos: src/pages/Dashboard/components/OverdueAlerts.tsx, src/pages/Dashboard/DashboardPage.tsx
- Notas: Conectar abertura de detalhes com o TransactionDetailsModal e disparar callback de edição se solicitado.

## T-171 — Suíte de testes automatizados e relatório de verificação [concluida]
- Refs: US-070, AC-256, AC-257, AC-258, AC-259, AC-260
- Arquivos: test/baixa-transacao-alertas-vencimento.spec.test.js, .spec/verification/baixa-transacao-alertas-vencimento.json
- Notas: Testes executáveis via node --test e geração de JSON de auditoria de conformidade.
