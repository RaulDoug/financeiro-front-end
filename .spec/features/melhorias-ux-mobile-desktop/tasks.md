# Tasks: Melhorias ux mobile desktop

> feature: melhorias-ux-mobile-desktop

## T-093 — Ocultação de elementos redundantes e ajuste de fontes/cards no Mobile e Dashboard [concluida]
- Refs: US-036, AC-133, AC-134
- Arquivos: src/components/layout/Topbar.tsx, src/pages/Dashboard/components/QuickActions.tsx, src/pages/Dashboard/components/KpiCards.tsx
- Notas: Ocultar botão de menu hambúrguer no Topbar e botão de lançar transações na Dashboard em mobile (< 768px); aplicar tipografia responsiva e fluida nos títulos dos cards KPI.

## T-094 — Seletor de mês/ano e gráfico com scroll horizontal na Dashboard [concluida]
- Refs: US-036, AC-135, AC-136
- Arquivos: src/pages/Dashboard/DashboardPage.tsx, src/pages/Dashboard/components/IncomeExpenseChart.tsx, src/hooks/useDashboardData.ts
- Notas: Implementar seletor de mês/ano na Dashboard com reatividade nas métricas e lista de transações; adicionar espaçamento compacto e touch scroll horizontal no gráfico de receitas x despesas.

## T-095 — Reorganização de filtros e painel de Filtros Avançados na tela de Transações [concluida]
- Refs: US-037, AC-137, AC-138, AC-139
- Arquivos: src/pages/Transactions/index.tsx, src/components/transactions/TransactionFilters.tsx, src/components/transactions/TransactionAdvancedFiltersModal.tsx
- Notas: Esconder botão Nova Transação no mobile; reordenar seleção de período em duas linhas contidas no card; criar modal de filtros avançados por categoria, método de pagamento e conta para desktop e mobile.

## T-096 — Visualização compacta de transações em lista mobile sem scroll horizontal [concluida]

- Refs: US-037, AC-140
- Arquivos: src/components/transactions/TransactionTable.tsx, src/components/transactions/TransactionMobileList.tsx
- Notas: Desenvolver visualização de transações mobile em formato de cards verticais compactos, com todos os dados essenciais e sem scroll horizontal.

## T-097 — Modal global unificado de Detalhes da Transação com ações de edição e exclusão [concluida]

- Refs: US-038, AC-141, AC-142
- Arquivos: src/stores/transactionDetailsModal.store.ts, src/components/transactions/TransactionDetailsModal.tsx, src/layouts/AppLayout.tsx
- Notas: Implementar modal padrão de exibição de dados completos da transação com botões Editar e Excluir integrados ao store e layouts globais.

## T-098 — Centralização do popover de notificações e navegações do sino [concluida]

- Refs: US-039, AC-143, AC-144, AC-145
- Arquivos: src/components/layout/NotificationsBell.tsx
- Notas: Centralizar horizontalmente o popover abaixo do header; abrir modal de detalhes ao clicar na transação atrasada; direcionar para /transactions com filtro de vencidas ao clicar em 'Ver transações vencidas'.

## T-099 — Customização de cores, data da compra e detalhes na fatura de Cartões de Crédito [concluida]

- Refs: US-040, AC-146, AC-147, AC-148, AC-149
- Arquivos: src/pages/CreditCardsPage.tsx, src/components/credit-cards/TransactionList.tsx, src/components/credit-cards/CreditCardModal.tsx, src/components/credit-cards/CreditCardVisual.tsx
- Notas: Exibir data de compra nos itens da fatura; mover dia de vencimento para o resumo de limite; habilitar clique para abrir detalhes da transação; criar seletor de paleta de cores elegantes no cadastro.

## T-100 — Responsividade sem scroll lateral e limpeza visual de gráficos nos Relatórios [concluida]

- Refs: US-041, AC-150, AC-151, AC-152, AC-153
- Arquivos: src/pages/Reports/AnnualChart.tsx, src/pages/Reports/CategoryChart.tsx, src/pages/Reports/AnnualReport.tsx, src/pages/Reports/CategoryReport.tsx, src/pages/Reports/CounterpartyReport.tsx
- Notas: Habilitar zoom e pan no gráfico mensal; remover bordas escuras ao clicar nos gráficos; converter DRE mensal para grid multi-linhas no mobile; adaptar listas de categorias e contrapartes sem scroll lateral.

## T-101 — Correção dinâmica e validação de formulário em Métodos de Pagamento [concluida]

- Refs: US-042, AC-154, AC-155
- Arquivos: src/pages/Settings/PayMethodModal.tsx, src/schemas/settingsSchemas.ts
- Notas: Exibir campos obrigatórios de cartão de crédito dinamicamente ao marcar checkbox; validar todos os campos necessários em métodos de pagamento convencionais.

## T-102 — Testes Automatizados de Especificação da Feature [pendente]

- Refs: US-036, US-037, US-038, US-039, US-040, US-041, US-042, AC-133, AC-134, AC-135, AC-136, AC-137, AC-138, AC-139, AC-140, AC-141, AC-142, AC-143, AC-144, AC-145, AC-146, AC-147, AC-148, AC-149, AC-150, AC-151, AC-152, AC-153, AC-154, AC-155
- Arquivos: test/melhorias-ux-mobile-desktop.spec.test.js
- Notas: Criar suíte de testes de especificação cobrindo os 23 critérios de aceite AC-133 a AC-155.
