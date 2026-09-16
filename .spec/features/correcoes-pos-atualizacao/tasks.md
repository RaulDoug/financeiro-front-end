# Tasks: Correções Pós-Atualização

> feature: correcoes-pos-atualizacao

<!--
  T-xxx = tarefa (código de rastreio, único no projeto inteiro).
  Toda tarefa referencia em `Refs:` pelo menos uma US ou AC.
  Toda tarefa lista os arquivos em `Arquivos:` (separados por vírgula).
  Status: pendente | em-andamento | concluida
-->

## T-103 — Centralizar sino de notificação na viewport [concluida]

- Refs: US-043, AC-156
- Arquivos: src/components/layout/Topbar.tsx, src/components/layout/NotificationsBell.tsx
- Esforço: baixo
- Notas: Localizar o container do ícone do sino; remover posicionamento com âncora no ícone; usar `justify-center` ou `mx-auto` no container pai para centralizar em relação à viewport horizontal. Verificar posicionamento do popover de notificações como já tratado em T-098 — pode ser somente o ícone que está fora de posição.

## T-104 — Corrigir abertura do modal de transação na tela de Transações [concluida]

- Refs: US-044, AC-157, AC-158
- Arquivos: src/pages/Transactions/index.tsx, src/stores/transactionModal.store.ts, src/components/layout/MobileNav.tsx
- Esforço: baixo
- Notas: O botão "+" da barra inferior deve acionar a store global de modal também quando o usuário está na tela de transações. Adicionar limpeza (reset) do estado do modal ao desmontar a tela de transações para evitar que o modal apareça aberto ao navegar de volta para o dashboard.

## T-105 — Adicionar botão de pagamento nos detalhes de transação [concluida]

- Refs: US-045, AC-159, AC-160
- Arquivos: src/components/transactions/TransactionDetailsModal.tsx, src/hooks/useTransactionMutations.ts
- Esforço: medio
- Notas: Identificar o componente de detalhes de transação (drawer ou modal — ver T-097 da feature melhorias-ux-mobile-desktop). Adicionar botão "Marcar como Pago" condicional — visível apenas quando `status !== 'completed'`. Ao clicar, chamar PATCH de atualização de transação definindo status como completed e payment_date como hoje. O componente deve funcionar independente da tela que abriu o detalhe.

## T-106 — Corrigir corte e fechamento do formulário de cadastro de cartão [concluida]

- Refs: US-046, AC-161, AC-162, AC-163
- Arquivos: src/components/credit-cards/CreditCardModal.tsx, src/components/credit-cards/CreditCardForm.tsx
- Esforço: baixo
- Notas: Verificar overflow, z-index e max-height do modal/card. Garantir que o cabeçalho com botão "X" não fique cortado — usar `overflow-y: auto` no corpo e `position: sticky top-0` no cabeçalho. Verificar que o onClose do botão está conectado ao handler correto. Testar abrindo tanto pela tela de cartões quanto pelas configurações (Métodos de Pagamento).

## T-107 — Corrigir exibição de transações vencidas na listagem [concluida]

- Refs: US-047, AC-164
- Arquivos: src/pages/Transactions/index.tsx, src/components/transactions/TransactionFilters.tsx, src/hooks/useTransactions.ts
- Esforço: medio
- Notas: Investigar se transações vencidas estão sendo excluídas pelo filtro padrão. O filtro padrão por `due_date_from` e `due_date_to` do mês corrente pode estar omitindo transações com vencimento em meses anteriores. Avaliar se o status `overdue` deve fazer parte de um filtro separado ou se a consulta deve buscar pendentes sem restrição de data de vencimento quando há filtro de status ativo.

## T-108 — Tornar transações recentes do dashboard clicáveis com layout correto [concluida]

- Refs: US-048, AC-165, AC-166
- Arquivos: src/pages/Dashboard/components/RecentTransactions.tsx, src/components/transactions/TransactionDetailsModal.tsx
- Esforço: medio
- Notas: Adicionar handler onClick em cada linha de transação recente que abre o modal de detalhes da transação (implementado em T-097) passando o ID. Atualizar o layout do componente RecentTransactions para usar o mesmo padrão visual da tabela de transações (chips de categoria, cor verde/vermelho no valor, ícone de status).

## T-109 — Corrigir erro 500 no cadastro de cartão de crédito [concluida]

- Refs: US-049, AC-167, AC-168
- Arquivos: src/services/api/creditCards.ts, src/components/credit-cards/CreditCardForm.tsx, src/schemas/creditCardSchema.ts
- Esforço: medio
- Notas: Inspecionar o payload enviado em POST `/api/pay-method/register` comparando com o contrato em `Docs/front_layout/api_docs.md`. Verificar campos obrigatórios (nome, conta bancária, limite, dias de vencimento/fechamento, credit_card:true, dígitos). Garantir que o schema Zod e a montagem do body no service correspondem ao contrato da API. Adicionar log de debug temporário para capturar o payload antes do envio.
