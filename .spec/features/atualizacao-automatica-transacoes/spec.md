# Spec: Atualização Automática de Transações

> feature: atualizacao-automatica-transacoes
> status: pronta

## Contexto

Ao cadastrar, editar ou pagar uma transação, as telas (Listagem de Transações e Dashboard) não atualizam seus dados automaticamente, obrigando o usuário a alternar filtros ou sair e voltar da página para visualizar o novo registro. Esta especificação define a sincronização reativa imediata via TanStack Query para que qualquer lançamento reflita na interface instantaneamente.

## Histórias

### US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações

Como usuário do sistema financeiro, quero que a tela atualize imediatamente após cadastrar, editar ou pagar qualquer transação, para que eu visualize o resultado na listagem e nos saldos sem precisar recarregar a página ou alternar filtros manualmente.

#### AC-210 — Atualização imediata na listagem de transações após criação
- **Dado** que o usuário está na tela de Transações (`/transactions`) visualizando a listagem do mês
- **Quando** cadastra uma nova transação (receita, despesa ou transferência) através do modal de transação
- **Então** a listagem de transações é atualizada automaticamente e exibe o novo registro assim que o modal se fecha, sem necessidade de alterar filtros ou sair da página

#### AC-211 — Invalidação abrangente com refetch de consultas ativas no hook de mutações
- **Dado** que qualquer mutação de transação é disparada (`createMutation`, `updateMutation`, `deleteMutation`)
- **Quando** a requisição à API é concluída com sucesso
- **Então** o hook `useTransactionMutations` dispara a invalidação e o refetch síncrono das queries ativas de `transactions`, `transactions-overdue-past`, `dashboard` e `bank-accounts`

#### AC-212 — Atualização imediata após efetivar pagamento nos detalhes da transação
- **Dado** que o usuário abre o modal de detalhes de uma transação pendente (`TransactionDetailsModal`)
- **Quando** clica em "Confirmar Pagamento" e preenche os dados de quitação
- **Então** o status da transação passa para compensado e a listagem reflete a alteração imediatamente sem exigir navegação

#### AC-213 — Atualização imediata do Dashboard após criação rápida de transação
- **Dado** que o usuário está na tela de Dashboard
- **Quando** lança uma transação através dos botões de Ações Rápidas
- **Então** os cards de saldo, resumo financeiro e lista de transações recentes são refetched e atualizados na tela imediatamente após o salvamento

#### AC-214 — Bloqueio do fechamento de modal até sincronização concluída
- **Dado** que o usuário submete o formulário de cadastro ou edição de transação
- **Quando** o salvamento estiver em processamento
- **Então** a interface aguarda a confirmação da mutação e o refetch da query antes de fechar o modal, garantindo que o usuário veja a tela já preenchida com os dados novos

## Fora de escopo

- Implementação de WebSockets ou Server-Sent Events (SSE).
- Alteração no layout visual ou campos do formulário de transações.
- Alteração de regras de negócio ou rotas no backend.

## Suposições

| ID      | Suposição                                                                                                                                                          | Status     | Resolução                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------- |
| ASM-054 | O uso de `queryClient.refetchQueries({ queryKey: ['transactions'], type: 'active' })` aguarda e traz dados frescos do backend antes da re-renderização da listagem | confirmada | Confirmado pelo comportamento padrão do TanStack Query v5     |
| ASM-055 | A query `transactions-overdue-past` requer invalidação explícita pois sua chave de busca não compartilha o prefixo base com `transactions`                         | confirmada | Confirmado pela separação de chaves em `TransactionsPage.tsx` |

## Perguntas em aberto

| ID    | Pergunta                                                                                   | Status     | Resposta                                                              |
| ----- | ------------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------- |
| Q-042 | Nenhuma. Requisito plenamente definido e focado na atualização automática reativa de tela. | respondida | Escopo aprovado e alinhado com o funcionamento esperado pelo usuário. |
