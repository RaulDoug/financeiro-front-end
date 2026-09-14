# Spec: Contas Bancarias

> feature: contas-bancarias
> status: implementada

## Contexto

Gerenciamento das contas bancárias do usuário, permitindo o cadastro, visualização de saldos (individuais e total), edição e remoção das contas, garantindo uma visão geral do dinheiro disponível.

## Histórias

### US-019 — Visualização de contas e saldos

Como usuário, quero visualizar minhas contas bancárias e os respectivos saldos, para que eu tenha uma visão geral do meu dinheiro e saiba onde ele está alocado.

#### AC-081 — Listagem das contas e saldos
- **Dado** que possuo contas bancárias cadastradas
- **Quando** acesso a página de contas bancárias (`/bank-accounts`)
- **Então** vejo uma lista de cartões (cards) representando cada conta com o nome do banco e o saldo formatado como moeda (R$).

#### AC-082 — Destacar saldo negativo
- **Dado** que uma conta possui saldo negativo
- **Quando** a visualizo na listagem de contas
- **Então** o valor do saldo é exibido na cor vermelha, e um selo (badge) avisa que a conta permite saldo negativo.

#### AC-083 — Totalizador geral de saldos
- **Dado** que estou na página de contas bancárias
- **Quando** a tela é carregada
- **Então** visualizo no topo da página um totalizador somando o saldo de todas as minhas contas.

### US-020 — Gerenciamento de contas bancárias

Como usuário, quero poder cadastrar novas contas, bem como editar ou excluir contas existentes, para manter a minha estrutura financeira atualizada no aplicativo.

#### AC-084 — Criar nova conta
- **Dado** que abri o formulário para adicionar conta bancária
- **Quando** preencho o nome do banco, saldo inicial e se permite saldo negativo, e salvo
- **Então** a conta é registrada no sistema e passa a aparecer na minha listagem.

#### AC-085 — Validação de regras na criação
- **Dado** que tento criar uma conta com nome muito curto (menos de 2 caracteres)
- **Quando** tento enviar o formulário
- **Então** um erro é exibido no campo indicando a restrição, e os dados não são salvos.

#### AC-086 — Editar conta existente e ajuste de saldo
- **Dado** que escolhi editar os dados de uma conta listada
- **Quando** atualizo suas configurações (nome, permissão de saldo negativo ou ajuste manual do valor de saldo com aviso explícito de conciliação) e confirmo
- **Então** as informações da conta são enviadas via `PATCH /api/bank-account/update/:id` e atualizadas imediatamente na tela e no saldo consolidado.

#### AC-087 — Excluir conta com confirmação e tratamento de vínculos
- **Dado** que escolhi excluir uma conta da lista
- **Quando** o modal de confirmação é exibido com aviso preventivo sobre transações vinculadas e eu confirmo a exclusão
- **Então** se não houver vínculos, a conta é excluída com sucesso; caso o backend recuse por existirem transações, um alerta explicativo orienta a transferir ou remover as movimentações antes de tentar novamente

#### AC-088 — Cancelamento da exclusão
- **Dado** que escolhi excluir uma conta e o aviso de confirmação apareceu
- **Quando** eu cancelo a ação no modal
- **Então** o aviso fecha e a conta permanece inalterada na lista.

## Fora de escopo

- Lançamento de despesas e receitas; esta feature foca apenas no cadastro do meio "conta".
- Ajustes automáticos de saldo por importação (OFX).

## Suposições

| ID      | Suposição                                                                                                                                                                   | Status     | Resolução                                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------- |
| ASM-022 | O endpoint da API utiliza o `display_id` numérico para a identificação da conta nas rotas de PATCH e DELETE.                                                                | confirmada | Confirmado via documentação da API (:id = display_id inteiro). |
| ASM-023 | A string de saldo recebida da listagem deve ser convertida para numérico (`Number()`) no frontend antes de ser formatada, pois a API retorna o valor monetário como string. | confirmada | —                                                              |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                                             | Status     | Resposta                                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-019 | Ao tentar excluir uma conta, a API impede a deleção se existirem transações vinculadas, ou exclui em cascata? Devemos prever tratamento especial de erro no frontend para este caso? | respondida | Sim: exibir aviso preventivo no modal e tratar o erro de rejeição da API com alerta explicativo orientando a transferir ou remover as transações antes. |
| Q-020 | Ao editar uma conta existente, o campo `balance` pode ser ajustado diretamente, ou a alteração de saldo só ocorre via transações (exceto saldo inicial)?                             | respondida | Sim, o campo balance pode ser ajustado manualmente na edição com aviso explícito de conciliação, usando o suporte nativo do PATCH da API.               |
