# Spec: Investimentos

> feature: investimentos
> status: pendente

## Contexto

Os usuários precisam cadastrar e visualizar seus ativos de investimento, mesmo que as movimentações detalhadas (aportes, resgates, rendimentos) ainda não estejam disponíveis no sistema.

## Histórias

### US-021 — Gerenciamento de Ativos de Investimento

Como usuário, quero listar, criar, editar e excluir meus ativos de investimento, para manter meu portfólio registrado.

#### AC-089 — Listagem de Ativos
- **Dado** que o usuário acessou a tela de investimentos
- **Quando** a página carregar
- **Então** ele deve ver uma lista de ativos de investimento com nome, conta bancária associada e data de vencimento (se houver).

#### AC-090 — Criação de Ativo de Investimento
- **Dado** que o usuário está na tela de investimentos
- **Quando** preencher o formulário com um nome (mínimo de 2 caracteres) e uma conta bancária, e salvar
- **Então** um novo ativo de investimento deve ser criado e aparecer na listagem.

#### AC-091 — Edição de Ativo de Investimento
- **Dado** que o usuário visualiza a lista de ativos
- **Quando** selecionar um ativo para edição e alterar os dados permitidos
- **Então** o ativo deve ser atualizado e as mudanças devem refletir na listagem.

#### AC-092 — Exclusão de Ativo de Investimento
- **Dado** que o usuário visualiza a lista de ativos
- **Quando** confirmar a exclusão de um ativo
- **Então** o ativo deve ser removido da listagem.

#### AC-093 — Validação de Nome Inválido
- **Dado** que o usuário tenta criar um ativo
- **Quando** informar um nome com menos de 2 caracteres
- **Então** o sistema deve exibir uma mensagem de erro e não permitir o salvamento.

#### AC-094 — Conta Bancária Obrigatória
- **Dado** que o usuário tenta criar um ativo
- **Quando** não selecionar uma conta bancária
- **Então** o sistema deve bloquear o salvamento e informar que o campo é obrigatório.

### US-022 — Visualização de Funcionalidades Futuras

Como usuário, quero entender por que não consigo adicionar aportes aos investimentos, para alinhar minhas expectativas sobre a ferramenta.

#### AC-095 — Banner de Em Breve
- **Dado** que o usuário acessa a tela de investimentos
- **Quando** visualizar a interface
- **Então** ele deve ver um banner ou aviso informando que as "Movimentações de investimento em breve" estarão disponíveis (aportes, rendimentos, liquidação, impostos).

## Fora de escopo

- Transações de investimento (aportes, resgates, imposto de renda, rendimentos) não estão contempladas nesta fase, pois o backend ainda não suporta a rota `investments_transactions`.

## Suposições

| ID      | Suposição                                                                                                           | Status     | Resolução                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| ASM-025 | Os ativos de investimento não possuem um valor de saldo total nesta fase, já que não existem transações associadas. | confirmada | Confirmado: apenas visualização de cadastro de ativos.          |
| ASM-026 | A conta bancária associada não precisa necessariamente do saldo deduzido na criação do ativo nesta fase.            | confirmada | Confirmado: sem movimentação contábil até existirem transações. |
| ASM-027 | A interface de listagem será em cards com dados do ativo (nome, conta vinculada, vencimento).                       | confirmada | Confirmado: cards informativos com banner no topo.              |

## Perguntas em aberto

| ID    | Pergunta                                                                                                           | Status     | Resposta                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| Q-021 | Como devemos apresentar o ativo de investimento visualmente se ele não tem saldo ou valor inicial?                 | respondida | Cards com nome do ativo, conta bancária vinculada e data de vencimento, além do banner explicativo. |
| Q-022 | O campo de conta bancária (`bank_account_id`) precisa ser preenchido por um select buscando das contas existentes? | respondida | Sim, select obrigatório alimentado pelas contas bancárias ativas da carteira.                       |
| Q-023 | Devemos esconder o botão de 'Detalhes' no ativo até as transações estarem prontas?                                 | respondida | Sim, botão de Detalhes ocultado até o backend disponibilizar as transações de investimento.         |
