# Relatório de auditoria

- Resultado: ❌ FAIL
- Features: 10 · Histórias de usuário: 30 · Critérios de aceite: 104
- Critérios com teste: 0/104 · Critérios provados: 0/104
- Suposições abertas: 27 · Perguntas abertas: 29

| Severidade | Problema | Feature | Detalhe | Local |
|---|---|---|---|---|
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | app-shell | status "concluída" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\app-shell\spec.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-021 (Exibição do layout base) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-022 (Menu responsivo em dispositivos móveis) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-023 (Indicador de notificações) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-024 (Menu de perfil do usuário) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-025 (Seletor de carteira) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-026 (Recarregamento ao trocar de carteira) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-027 (Header obrigatório nas requisições) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | app-shell | AC-028 (Rota protegida sem carteira) não é coberto por nenhuma tarefa | .spec\features\app-shell\tasks.md |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-021 (Exibição do layout base) não tem nenhum teste anotado com @spec:AC-021 | .spec\features\app-shell\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-022 (Menu responsivo em dispositivos móveis) não tem nenhum teste anotado com @spec:AC-022 | .spec\features\app-shell\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-023 (Indicador de notificações) não tem nenhum teste anotado com @spec:AC-023 | .spec\features\app-shell\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-024 (Menu de perfil do usuário) não tem nenhum teste anotado com @spec:AC-024 | .spec\features\app-shell\spec.md:31 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-025 (Seletor de carteira) não tem nenhum teste anotado com @spec:AC-025 | .spec\features\app-shell\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-026 (Recarregamento ao trocar de carteira) não tem nenhum teste anotado com @spec:AC-026 | .spec\features\app-shell\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-027 (Header obrigatório nas requisições) não tem nenhum teste anotado com @spec:AC-027 | .spec\features\app-shell\spec.md:50 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | app-shell | AC-028 (Rota protegida sem carteira) não tem nenhum teste anotado com @spec:AC-028 | .spec\features\app-shell\spec.md:55 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | auth | status "pronto" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\auth\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-001 mapeia src/stores/auth.store.ts, que não existe | .spec\features\auth\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-001 mapeia src/lib/axios.ts, que não existe | .spec\features\auth\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-002 mapeia src/services/auth.service.ts, que não existe | .spec\features\auth\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-003 mapeia src/layouts/AuthLayout.tsx, que não existe | .spec\features\auth\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-003 mapeia src/components/ui/AuthCard.tsx, que não existe | .spec\features\auth\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-004 mapeia src/pages/auth/LoginPage.tsx, que não existe | .spec\features\auth\tasks.md:20 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-005 mapeia src/pages/auth/RegisterPage.tsx, que não existe | .spec\features\auth\tasks.md:25 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-006 mapeia src/pages/auth/ForgotPasswordPage.tsx, que não existe | .spec\features\auth\tasks.md:30 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-007 mapeia src/routes/PrivateRoute.tsx, que não existe | .spec\features\auth\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-007 mapeia src/routes/PublicRoute.tsx, que não existe | .spec\features\auth\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-008 mapeia src/App.tsx, que não existe | .spec\features\auth\tasks.md:40 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | auth | a tarefa T-008 mapeia src/routes/index.tsx, que não existe | .spec\features\auth\tasks.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-001 (Login com sucesso) não tem nenhum teste anotado com @spec:AC-001 | .spec\features\auth\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-002 (Credenciais inválidas) não tem nenhum teste anotado com @spec:AC-002 | .spec\features\auth\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-003 (Limite de tentativas excedido (Rate limit)) não tem nenhum teste anotado com @spec:AC-003 | .spec\features\auth\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-004 (Senha forte) não tem nenhum teste anotado com @spec:AC-004 | .spec\features\auth\spec.md:35 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-005 (Registro com sucesso) não tem nenhum teste anotado com @spec:AC-005 | .spec\features\auth\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-006 (E-mail já em uso) não tem nenhum teste anotado com @spec:AC-006 | .spec\features\auth\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-007 (Redirecionamento de não autenticados) não tem nenhum teste anotado com @spec:AC-007 | .spec\features\auth\spec.md:54 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-008 (Sessão expirada) não tem nenhum teste anotado com @spec:AC-008 | .spec\features\auth\spec.md:59 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-009 (Redirecionamento de logados da tela de login) não tem nenhum teste anotado com @spec:AC-009 | .spec\features\auth\spec.md:64 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-010 (Acesso à página de recuperação) não tem nenhum teste anotado com @spec:AC-010 | .spec\features\auth\spec.md:69 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-011 (Validação do placeholder) não tem nenhum teste anotado com @spec:AC-011 | .spec\features\auth\spec.md:74 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | auth | AC-012 (Ação de Sair (Logout)) não tem nenhum teste anotado com @spec:AC-012 | .spec\features\auth\spec.md:79 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | cartoes-credito | status "pronto" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\cartoes-credito\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-045 mapeia src/services/api/creditCards.ts, que não existe | .spec\features\cartoes-credito\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-045 mapeia src/types/creditCard.ts, que não existe | .spec\features\cartoes-credito\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-046 mapeia src/hooks/useCreditCards.ts, que não existe | .spec\features\cartoes-credito\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-047 mapeia src/components/credit-cards/CreditCardVisual.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-047 mapeia src/components/credit-cards/CreditCardVisual.css, que não existe | .spec\features\cartoes-credito\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-048 mapeia src/components/credit-cards/LimitBar.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:20 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-049 mapeia src/components/credit-cards/InvoiceSummary.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:25 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-049 mapeia src/components/credit-cards/TransactionList.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:25 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-050 mapeia src/pages/CreditCardsPage.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:30 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-051 mapeia src/services/api/creditCards.ts, que não existe | .spec\features\cartoes-credito\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-051 mapeia src/hooks/useCreditCardMutations.ts, que não existe | .spec\features\cartoes-credito\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-052 mapeia src/components/credit-cards/NewCreditCardForm.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:40 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-052 mapeia src/components/credit-cards/NewCreditCardModal.tsx, que não existe | .spec\features\cartoes-credito\tasks.md:40 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | cartoes-credito | a tarefa T-052 mapeia src/schemas/creditCardSchema.ts, que não existe | .spec\features\cartoes-credito\tasks.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-069 (Listagem dos cartões) não tem nenhum teste anotado com @spec:AC-069 | .spec\features\cartoes-credito\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-070 (Indicador de limite saudável (Verde)) não tem nenhum teste anotado com @spec:AC-070 | .spec\features\cartoes-credito\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-071 (Indicador de limite em atenção (Amarelo)) não tem nenhum teste anotado com @spec:AC-071 | .spec\features\cartoes-credito\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-072 (Indicador de limite crítico (Vermelho)) não tem nenhum teste anotado com @spec:AC-072 | .spec\features\cartoes-credito\spec.md:31 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-073 (Resumo da fatura) não tem nenhum teste anotado com @spec:AC-073 | .spec\features\cartoes-credito\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-074 (Lista de transações da fatura) não tem nenhum teste anotado com @spec:AC-074 | .spec\features\cartoes-credito\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-075 (Cadastro com sucesso) não tem nenhum teste anotado com @spec:AC-075 | .spec\features\cartoes-credito\spec.md:54 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | cartoes-credito | AC-076 (Validação de campos obrigatórios) não tem nenhum teste anotado com @spec:AC-076 | .spec\features\cartoes-credito\spec.md:59 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | configuracoes | status "pendente" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\configuracoes\spec.md |
| erro | referência quebrada (`REF_QUEBRADA`) | configuracoes | a tarefa T-071 referencia AC-118, que não existe em nenhuma especificação | .spec\features\configuracoes\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-071 mapeia src/services/categories.service.ts, que não existe | .spec\features\configuracoes\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-071 mapeia src/hooks/useCategories.ts, que não existe | .spec\features\configuracoes\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-072 mapeia src/pages/Settings/CategoriesSettings.tsx, que não existe | .spec\features\configuracoes\tasks.md:11 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-072 mapeia src/pages/Settings/CategoryModal.tsx, que não existe | .spec\features\configuracoes\tasks.md:11 |
| erro | referência quebrada (`REF_QUEBRADA`) | configuracoes | a tarefa T-073 referencia AC-118, que não existe em nenhuma especificação | .spec\features\configuracoes\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-073 mapeia src/services/counterparties.service.ts, que não existe | .spec\features\configuracoes\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-073 mapeia src/hooks/useCounterparties.ts, que não existe | .spec\features\configuracoes\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-074 mapeia src/pages/Settings/CounterpartiesSettings.tsx, que não existe | .spec\features\configuracoes\tasks.md:23 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-074 mapeia src/pages/Settings/CounterpartyModal.tsx, que não existe | .spec\features\configuracoes\tasks.md:23 |
| erro | referência quebrada (`REF_QUEBRADA`) | configuracoes | a tarefa T-075 referencia AC-118, que não existe em nenhuma especificação | .spec\features\configuracoes\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-075 mapeia src/services/pay-methods.service.ts, que não existe | .spec\features\configuracoes\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-075 mapeia src/hooks/usePayMethods.ts, que não existe | .spec\features\configuracoes\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-076 mapeia src/pages/Settings/PayMethodsSettings.tsx, que não existe | .spec\features\configuracoes\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-076 mapeia src/pages/Settings/PayMethodModal.tsx, que não existe | .spec\features\configuracoes\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-077 mapeia src/services/wallet.service.ts, que não existe | .spec\features\configuracoes\tasks.md:41 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-077 mapeia src/hooks/useWalletSettings.ts, que não existe | .spec\features\configuracoes\tasks.md:41 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-078 mapeia src/pages/Settings/WalletSettings.tsx, que não existe | .spec\features\configuracoes\tasks.md:47 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-078 mapeia src/pages/Settings/WalletDeleteAlert.tsx, que não existe | .spec\features\configuracoes\tasks.md:47 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-079 mapeia src/pages/Settings/MembersSettings.tsx, que não existe | .spec\features\configuracoes\tasks.md:53 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-080 mapeia src/pages/Settings/index.tsx, que não existe | .spec\features\configuracoes\tasks.md:59 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-080 mapeia src/pages/Settings/SettingsSidebar.tsx, que não existe | .spec\features\configuracoes\tasks.md:59 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-081 mapeia src/pages/Settings/settingsSchemas.ts, que não existe | .spec\features\configuracoes\tasks.md:65 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-082 mapeia src/pages/Settings/SettingsListLayout.tsx, que não existe | .spec\features\configuracoes\tasks.md:71 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | configuracoes | a tarefa T-082 mapeia src/pages/Settings/ActionMenu.tsx, que não existe | .spec\features\configuracoes\tasks.md:71 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-106 (Listagem Agrupada) não tem nenhum teste anotado com @spec:AC-106 | .spec\features\configuracoes\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-107 (Criação de Categoria) não tem nenhum teste anotado com @spec:AC-107 | .spec\features\configuracoes\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-108 (Restrição de Exclusão Padrão) não tem nenhum teste anotado com @spec:AC-108 | .spec\features\configuracoes\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-109 (Listagem Agrupada de Contrapartes) não tem nenhum teste anotado com @spec:AC-109 | .spec\features\configuracoes\spec.md:35 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-110 (Criação e Edição de Contraparte) não tem nenhum teste anotado com @spec:AC-110 | .spec\features\configuracoes\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-111 (Indicador de Cartão de Crédito) não tem nenhum teste anotado com @spec:AC-111 | .spec\features\configuracoes\spec.md:49 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-112 (Bloqueio de Edição do Tipo do Cartão) não tem nenhum teste anotado com @spec:AC-112 | .spec\features\configuracoes\spec.md:54 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-113 (Criação de Método de Pagamento) não tem nenhum teste anotado com @spec:AC-113 | .spec\features\configuracoes\spec.md:59 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-114 (Renomear Carteira) não tem nenhum teste anotado com @spec:AC-114 | .spec\features\configuracoes\spec.md:68 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-115 (Exclusão Restrita a Owner) não tem nenhum teste anotado com @spec:AC-115 | .spec\features\configuracoes\spec.md:73 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-116 (Interface de Equipe) não tem nenhum teste anotado com @spec:AC-116 | .spec\features\configuracoes\spec.md:82 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | configuracoes | AC-117 (Navegação das Configurações) não tem nenhum teste anotado com @spec:AC-117 | .spec\features\configuracoes\spec.md:87 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | contas-bancarias | status "pronto" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\contas-bancarias\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-053 mapeia src/services/api/bankAccounts.ts, que não existe | .spec\features\contas-bancarias\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-053 mapeia src/types/bankAccount.ts, que não existe | .spec\features\contas-bancarias\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-054 mapeia src/hooks/useBankAccounts.ts, que não existe | .spec\features\contas-bancarias\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-054 mapeia src/hooks/useBankAccountMutations.ts, que não existe | .spec\features\contas-bancarias\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-055 mapeia src/components/bank-accounts/AccountCard.tsx, que não existe | .spec\features\contas-bancarias\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-055 mapeia src/utils/formatCurrency.ts, que não existe | .spec\features\contas-bancarias\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-056 mapeia src/components/bank-accounts/AccountsTotalizer.tsx, que não existe | .spec\features\contas-bancarias\tasks.md:20 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-057 mapeia src/pages/BankAccountsPage.tsx, que não existe | .spec\features\contas-bancarias\tasks.md:25 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-058 mapeia src/components/bank-accounts/AccountFormModal.tsx, que não existe | .spec\features\contas-bancarias\tasks.md:30 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-058 mapeia src/components/bank-accounts/DeleteConfirmModal.tsx, que não existe | .spec\features\contas-bancarias\tasks.md:30 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | contas-bancarias | a tarefa T-058 mapeia src/schemas/bankAccountSchema.ts, que não existe | .spec\features\contas-bancarias\tasks.md:30 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-081 (Listagem das contas e saldos) não tem nenhum teste anotado com @spec:AC-081 | .spec\features\contas-bancarias\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-082 (Destacar saldo negativo) não tem nenhum teste anotado com @spec:AC-082 | .spec\features\contas-bancarias\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-083 (Totalizador geral de saldos) não tem nenhum teste anotado com @spec:AC-083 | .spec\features\contas-bancarias\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-084 (Criar nova conta) não tem nenhum teste anotado com @spec:AC-084 | .spec\features\contas-bancarias\spec.md:35 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-085 (Validação de regras na criação) não tem nenhum teste anotado com @spec:AC-085 | .spec\features\contas-bancarias\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-086 (Editar conta existente) não tem nenhum teste anotado com @spec:AC-086 | .spec\features\contas-bancarias\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-087 (Excluir conta com confirmação) não tem nenhum teste anotado com @spec:AC-087 | .spec\features\contas-bancarias\spec.md:50 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | contas-bancarias | AC-088 (Cancelamento da exclusão) não tem nenhum teste anotado com @spec:AC-088 | .spec\features\contas-bancarias\spec.md:55 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | dashboard | status "concluída" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\dashboard\spec.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-029 (Cartões de KPI Principais) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-030 (Saldos das Contas) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-031 (Resumo de Cartões de Crédito) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-032 (Estado vazio para KPIs) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-033 (Lista de transações recentes) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-034 (Transações recentes vazias) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-035 (Gráfico de Receitas vs Despesas (Barras)) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-036 (Gráfico de Despesas por Categoria (Rosca)) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-037 (Interatividade nos gráficos) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-038 (Tratamento de gráficos sem dados) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-039 (Alertas de Atraso) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-040 (Estado "Tudo em dia") não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-041 (Ações rápidas de lançamento (Receita/Despesa)) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| aviso | critério de aceite sem tarefa (`AC_SEM_TASK`) | dashboard | AC-042 (Ação rápida de transferência) não é coberto por nenhuma tarefa | .spec\features\dashboard\tasks.md |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-029 (Cartões de KPI Principais) não tem nenhum teste anotado com @spec:AC-029 | .spec\features\dashboard\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-030 (Saldos das Contas) não tem nenhum teste anotado com @spec:AC-030 | .spec\features\dashboard\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-031 (Resumo de Cartões de Crédito) não tem nenhum teste anotado com @spec:AC-031 | .spec\features\dashboard\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-032 (Estado vazio para KPIs) não tem nenhum teste anotado com @spec:AC-032 | .spec\features\dashboard\spec.md:31 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-033 (Lista de transações recentes) não tem nenhum teste anotado com @spec:AC-033 | .spec\features\dashboard\spec.md:36 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-034 (Transações recentes vazias) não tem nenhum teste anotado com @spec:AC-034 | .spec\features\dashboard\spec.md:41 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-035 (Gráfico de Receitas vs Despesas (Barras)) não tem nenhum teste anotado com @spec:AC-035 | .spec\features\dashboard\spec.md:50 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-036 (Gráfico de Despesas por Categoria (Rosca)) não tem nenhum teste anotado com @spec:AC-036 | .spec\features\dashboard\spec.md:55 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-037 (Interatividade nos gráficos) não tem nenhum teste anotado com @spec:AC-037 | .spec\features\dashboard\spec.md:60 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-038 (Tratamento de gráficos sem dados) não tem nenhum teste anotado com @spec:AC-038 | .spec\features\dashboard\spec.md:65 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-039 (Alertas de Atraso) não tem nenhum teste anotado com @spec:AC-039 | .spec\features\dashboard\spec.md:74 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-040 (Estado "Tudo em dia") não tem nenhum teste anotado com @spec:AC-040 | .spec\features\dashboard\spec.md:79 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-041 (Ações rápidas de lançamento (Receita/Despesa)) não tem nenhum teste anotado com @spec:AC-041 | .spec\features\dashboard\spec.md:84 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | dashboard | AC-042 (Ação rápida de transferência) não tem nenhum teste anotado com @spec:AC-042 | .spec\features\dashboard\spec.md:89 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | investimentos | status "pendente" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\investimentos\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-059 mapeia src/services/investment-asset.service.ts, que não existe | .spec\features\investimentos\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-059 mapeia src/hooks/useInvestmentAssets.ts, que não existe | .spec\features\investimentos\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-060 mapeia src/pages/Investments/index.tsx, que não existe | .spec\features\investimentos\tasks.md:11 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-060 mapeia src/pages/Investments/InvestmentList.tsx, que não existe | .spec\features\investimentos\tasks.md:11 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-061 mapeia src/pages/Investments/InvestmentFormModal.tsx, que não existe | .spec\features\investimentos\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-061 mapeia src/pages/Investments/investmentSchema.ts, que não existe | .spec\features\investimentos\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-062 mapeia src/pages/Investments/InvestmentDeleteAlert.tsx, que não existe | .spec\features\investimentos\tasks.md:23 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-063 mapeia src/pages/Investments/PendingFeaturesBanner.tsx, que não existe | .spec\features\investimentos\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | investimentos | a tarefa T-063 mapeia src/pages/Investments/index.tsx, que não existe | .spec\features\investimentos\tasks.md:29 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-089 (Listagem de Ativos) não tem nenhum teste anotado com @spec:AC-089 | .spec\features\investimentos\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-090 (Criação de Ativo de Investimento) não tem nenhum teste anotado com @spec:AC-090 | .spec\features\investimentos\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-091 (Edição de Ativo de Investimento) não tem nenhum teste anotado com @spec:AC-091 | .spec\features\investimentos\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-092 (Exclusão de Ativo de Investimento) não tem nenhum teste anotado com @spec:AC-092 | .spec\features\investimentos\spec.md:31 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-093 (Validação de Nome Inválido) não tem nenhum teste anotado com @spec:AC-093 | .spec\features\investimentos\spec.md:36 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-094 (Conta Bancária Obrigatória) não tem nenhum teste anotado com @spec:AC-094 | .spec\features\investimentos\spec.md:41 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | investimentos | AC-095 (Banner de Em Breve) não tem nenhum teste anotado com @spec:AC-095 | .spec\features\investimentos\spec.md:50 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | onboarding | status "pronto" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\onboarding\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-009 mapeia src/hooks/useOnboardingCheck.ts, que não existe | .spec\features\onboarding\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-009 mapeia src/routes/PrivateRoute.tsx, que não existe | .spec\features\onboarding\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-009 mapeia src/stores/wallet.store.ts, que não existe | .spec\features\onboarding\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-010 mapeia src/services/wallet.service.ts, que não existe | .spec\features\onboarding\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-010 mapeia src/services/bankAccount.service.ts, que não existe | .spec\features\onboarding\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-010 mapeia src/services/payMethod.service.ts, que não existe | .spec\features\onboarding\tasks.md:10 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-011 mapeia src/pages/onboarding/OnboardingPage.tsx, que não existe | .spec\features\onboarding\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-011 mapeia src/components/onboarding/Stepper.tsx, que não existe | .spec\features\onboarding\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-011 mapeia src/stores/onboarding.store.ts, que não existe | .spec\features\onboarding\tasks.md:15 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-012 mapeia src/components/onboarding/steps/StepWallet.tsx, que não existe | .spec\features\onboarding\tasks.md:20 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-013 mapeia src/components/onboarding/steps/StepBankAccount.tsx, que não existe | .spec\features\onboarding\tasks.md:25 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | onboarding | a tarefa T-014 mapeia src/components/onboarding/steps/StepCreditCard.tsx, que não existe | .spec\features\onboarding\tasks.md:30 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-013 (Redirecionamento forçado ao onboarding) não tem nenhum teste anotado com @spec:AC-013 | .spec\features\onboarding\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-014 (Criação da primeira carteira (Step 1)) não tem nenhum teste anotado com @spec:AC-014 | .spec\features\onboarding\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-015 (Criação da primeira conta bancária (Step 2)) não tem nenhum teste anotado com @spec:AC-015 | .spec\features\onboarding\spec.md:30 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-016 (Saldo inicial padrão (Conta Bancária)) não tem nenhum teste anotado com @spec:AC-016 | .spec\features\onboarding\spec.md:35 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-017 (Adição de Cartão de Crédito (Step 3 - Opcional)) não tem nenhum teste anotado com @spec:AC-017 | .spec\features\onboarding\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-018 (Pular adição de Cartão de Crédito (Step 3 - Opcional)) não tem nenhum teste anotado com @spec:AC-018 | .spec\features\onboarding\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-019 (Prevenção de abandono do Wizard) não tem nenhum teste anotado com @spec:AC-019 | .spec\features\onboarding\spec.md:50 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | onboarding | AC-020 (Registro do estado concluído) não tem nenhum teste anotado com @spec:AC-020 | .spec\features\onboarding\spec.md:55 |
| aviso | status de especificação inválido (`STATUS_INVALIDO`) | relatorios | status "pendente" não é um de: rascunho, pronta, em-implementacao, implementada, auditada | .spec\features\relatorios\spec.md |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-064 mapeia src/services/reports.service.ts, que não existe | .spec\features\relatorios\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-064 mapeia src/hooks/useReports.ts, que não existe | .spec\features\relatorios\tasks.md:5 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-065 mapeia src/pages/Reports/index.tsx, que não existe | .spec\features\relatorios\tasks.md:11 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-065 mapeia src/pages/Reports/ReportsNavigation.tsx, que não existe | .spec\features\relatorios\tasks.md:11 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-066 mapeia src/pages/Reports/AnnualReport.tsx, que não existe | .spec\features\relatorios\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-066 mapeia src/pages/Reports/AnnualChart.tsx, que não existe | .spec\features\relatorios\tasks.md:17 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-067 mapeia src/pages/Reports/CategoryReport.tsx, que não existe | .spec\features\relatorios\tasks.md:23 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-067 mapeia src/pages/Reports/CategoryChart.tsx, que não existe | .spec\features\relatorios\tasks.md:23 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-068 mapeia src/lib/reportUtils.ts, que não existe | .spec\features\relatorios\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-068 mapeia src/hooks/useCounterpartyReport.ts, que não existe | .spec\features\relatorios\tasks.md:29 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-069 mapeia src/pages/Reports/CounterpartyReport.tsx, que não existe | .spec\features\relatorios\tasks.md:35 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-070 mapeia src/components/ChartEmptyState.tsx, que não existe | .spec\features\relatorios\tasks.md:41 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | relatorios | a tarefa T-070 mapeia src/pages/Reports/index.tsx, que não existe | .spec\features\relatorios\tasks.md:41 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-096 (Resumo Mensal DRE) não tem nenhum teste anotado com @spec:AC-096 | .spec\features\relatorios\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-097 (Seleção de Ano) não tem nenhum teste anotado com @spec:AC-097 | .spec\features\relatorios\spec.md:21 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-098 (Gráfico de Barras DRE) não tem nenhum teste anotado com @spec:AC-098 | .spec\features\relatorios\spec.md:26 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-099 (Listagem por Categorias) não tem nenhum teste anotado com @spec:AC-099 | .spec\features\relatorios\spec.md:35 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-100 (Filtro de Período para Categorias) não tem nenhum teste anotado com @spec:AC-100 | .spec\features\relatorios\spec.md:40 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-101 (Gráfico de Pizza ou Rosca) não tem nenhum teste anotado com @spec:AC-101 | .spec\features\relatorios\spec.md:45 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-102 (Consolidação de Contrapartes via Frontend) não tem nenhum teste anotado com @spec:AC-102 | .spec\features\relatorios\spec.md:54 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-103 (Tabela de Contrapartes) não tem nenhum teste anotado com @spec:AC-103 | .spec\features\relatorios\spec.md:59 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-104 (Diferenciação de Despesas e Receitas por Contraparte) não tem nenhum teste anotado com @spec:AC-104 | .spec\features\relatorios\spec.md:64 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | relatorios | AC-105 (Navegação na Rota de Relatórios) não tem nenhum teste anotado com @spec:AC-105 | .spec\features\relatorios\spec.md:69 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-031 mapeia src/types/transaction.ts, que não existe | .spec\features\transacoes\tasks.md:12 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-032 mapeia src/services/transactionService.ts, que não existe | .spec\features\transacoes\tasks.md:18 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-033 mapeia src/hooks/useTransactions.ts, que não existe | .spec\features\transacoes\tasks.md:24 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-034 mapeia src/components/transactions/TransactionFilters.tsx, que não existe | .spec\features\transacoes\tasks.md:30 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-035 mapeia src/pages/Transactions/index.tsx, que não existe | .spec\features\transacoes\tasks.md:36 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-035 mapeia src/components/transactions/TransactionTable.tsx, que não existe | .spec\features\transacoes\tasks.md:36 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-036 mapeia src/lib/validations/transaction.ts, que não existe | .spec\features\transacoes\tasks.md:42 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-037 mapeia src/components/transactions/TransactionModal.tsx, que não existe | .spec\features\transacoes\tasks.md:48 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-038 mapeia src/components/transactions/TransactionFormBase.tsx, que não existe | .spec\features\transacoes\tasks.md:54 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-039 mapeia src/components/transactions/TransactionFormBase.tsx, que não existe | .spec\features\transacoes\tasks.md:60 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-040 mapeia src/components/transactions/CategorySelect.tsx, que não existe | .spec\features\transacoes\tasks.md:66 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-041 mapeia src/components/transactions/InstallmentFields.tsx, que não existe | .spec\features\transacoes\tasks.md:72 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-042 mapeia src/hooks/useTransactionMutations.ts, que não existe | .spec\features\transacoes\tasks.md:78 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-043 mapeia src/components/transactions/TransactionModal.tsx, que não existe | .spec\features\transacoes\tasks.md:84 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-043 mapeia src/hooks/useTransactionMutations.ts, que não existe | .spec\features\transacoes\tasks.md:84 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-044 mapeia src/components/transactions/TransactionDeleteDialog.tsx, que não existe | .spec\features\transacoes\tasks.md:90 |
| aviso | arquivo não existe (`ARQUIVO_INEXISTENTE`) | transacoes | a tarefa T-044 mapeia src/hooks/useTransactionMutations.ts, que não existe | .spec\features\transacoes\tasks.md:90 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-043 (Listagem padrão de transações) não tem nenhum teste anotado com @spec:AC-043 | .spec\features\transacoes\spec.md:16 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-044 (Filtro por tipo de transação) não tem nenhum teste anotado com @spec:AC-044 | .spec\features\transacoes\spec.md:22 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-045 (Filtro por data e busca textual) não tem nenhum teste anotado com @spec:AC-045 | .spec\features\transacoes\spec.md:28 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-046 (Indicador visual de parcelamento) não tem nenhum teste anotado com @spec:AC-046 | .spec\features\transacoes\spec.md:34 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-047 (Fluxo "Cafézinho" rápido (≤ 10 segundos)) não tem nenhum teste anotado com @spec:AC-047 | .spec\features\transacoes\spec.md:44 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-048 (Validação de formulário de transação) não tem nenhum teste anotado com @spec:AC-048 | .spec\features\transacoes\spec.md:50 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-049 (Categorias filtradas pelo tipo de transação) não tem nenhum teste anotado com @spec:AC-049 | .spec\features\transacoes\spec.md:56 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-050 (Marcação de "Já está pago") não tem nenhum teste anotado com @spec:AC-050 | .spec\features\transacoes\spec.md:62 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-051 (Aba de transferência no modal) não tem nenhum teste anotado com @spec:AC-051 | .spec\features\transacoes\spec.md:72 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-052 (Validação de contas distintas) não tem nenhum teste anotado com @spec:AC-052 | .spec\features\transacoes\spec.md:78 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-053 (Confirmação visual de transferência criada) não tem nenhum teste anotado com @spec:AC-053 | .spec\features\transacoes\spec.md:84 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-054 (Campos de parcelamento) não tem nenhum teste anotado com @spec:AC-054 | .spec\features\transacoes\spec.md:94 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-055 (Bloqueio de cartão como receita recorrente) não tem nenhum teste anotado com @spec:AC-055 | .spec\features\transacoes\spec.md:100 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-056 (Edição de transação simples) não tem nenhum teste anotado com @spec:AC-056 | .spec\features\transacoes\spec.md:110 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-057 (Edição em lote de parcelas) não tem nenhum teste anotado com @spec:AC-057 | .spec\features\transacoes\spec.md:116 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-058 (Exclusão de transação concluída com aviso) não tem nenhum teste anotado com @spec:AC-058 | .spec\features\transacoes\spec.md:122 |
| erro | critério de aceite sem teste (`AC_SEM_TESTE`) | transacoes | AC-059 (Exclusão de transferência remove ambos registros) não tem nenhum teste anotado com @spec:AC-059 | .spec\features\transacoes\spec.md:128 |
| aviso | verificação não olha nenhum arquivo (`GLOB_SEM_ARQUIVOS`) | — | P-002: o glob `src/**/*.js` não casa nenhum arquivo — verificação inerte (typo no glob?) | .spec\constituicao.md:27 |
