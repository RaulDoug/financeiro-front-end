# Spec: Cartoes de Credito

> feature: cartoes-credito
> status: implementada

## Contexto

Gerenciamento de cartões de crédito, permitindo visualizar o uso do limite através de representações visuais, verificar os totais da fatura atual e cadastrar novos cartões.

## Histórias

### US-016 — Visualização de cartões e limites

Como usuário, quero visualizar meus cartões de crédito e o consumo dos seus limites, para que eu possa controlar meus gastos sem estourar o limite.

#### AC-069 — Listagem dos cartões
- **Dado** que possuo cartões de crédito cadastrados
- **Quando** acesso a página de cartões de crédito (`/credit-cards`)
- **Então** vejo meus cartões representados visualmente de forma semelhante a cartões físicos, exibindo nome, 4 últimos dígitos, dia de vencimento, dia de fechamento, limite total e limite utilizado.

#### AC-070 — Indicador de limite saudável (Verde)
- **Dado** que possuo um cartão cujo limite utilizado é menor que 60%
- **Quando** visualizo este cartão na listagem
- **Então** a barra de progresso do limite é exibida na cor verde.

#### AC-071 — Indicador de limite em atenção (Amarelo)
- **Dado** que possuo um cartão cujo limite utilizado está entre 60% e 80% (inclusive)
- **Quando** visualizo este cartão na listagem
- **Então** a barra de progresso do limite é exibida na cor amarela.

#### AC-072 — Indicador de limite crítico (Vermelho)
- **Dado** que possuo um cartão cujo limite utilizado é maior que 80%
- **Quando** visualizo este cartão na listagem
- **Então** a barra de progresso do limite é exibida na cor vermelha.

### US-017 — Acompanhamento da fatura e transações

Como usuário, quero visualizar os totais da minha fatura atual e as transações nela incluídas, para que eu saiba detalhadamente com o que estou gastando.

#### AC-073 — Resumo da fatura com navegação por mês
- **Dado** que um cartão possui movimentações
- **Quando** o usuário visualiza os detalhes da fatura e altera o mês através do seletor (< Mês/Ano >)
- **Então** a API busca os dados via `GET /api/dashboard-report/credit-card-summary?includeTransactions=true&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` exibindo o total da fatura e o limite disponível para o período selecionado.

#### AC-074 — Lista de transações da fatura
- **Dado** que existem transações recentes na fatura atual do cartão
- **Quando** visualizo os detalhes desta fatura
- **Então** as transações correspondentes são listadas com data, descrição e valor.

### US-018 — Cadastro de cartão de crédito

Como usuário, quero registrar um novo cartão de crédito informando seus dados, para que eu possa começar a usá-lo no sistema.

#### AC-075 — Cadastro com sucesso
- **Dado** que estou no formulário de novo cartão de crédito
- **Quando** preencho o nome, conta bancária associada, dia do vencimento, dia do fechamento, 4 últimos dígitos e limite de crédito corretamente e envio
- **Então** o cartão é criado com sucesso, o sistema informa a criação e me redireciona ou atualiza a lista mostrando o novo cartão (com `credit_card` travado como `true`).

#### AC-076 — Validação de campos obrigatórios
- **Dado** que deixei de preencher a conta bancária associada ou os dias de vencimento/fechamento
- **Quando** tento enviar o formulário
- **Então** mensagens de erro claras são exibidas indicando os campos necessários e o formulário não é enviado.

#### AC-077 — Edição do cartão via menu do card
- **Dado** que o usuário clica no menu de ações de um card de crédito
- **Quando** seleciona a opção "Editar", altera os dados (nome, conta, dias de fechamento/vencimento) e salva
- **Então** o cartão é atualizado via `PATCH /api/pay-method/update/:id` e a interface reflete as alterações imediatamente

#### AC-078 — Exclusão do cartão via menu do card
- **Dado** que o usuário clica na opção "Excluir" no menu do card de crédito
- **Quando** confirma a exclusão no diálogo de confirmação
- **Então** o cartão é removido via `DELETE /api/pay-method/delete/:id`, a lista é recarregada e um toast de sucesso é exibido

#### AC-215 — Payload estrito em conformidade com o schema de persistência
- **Dado** que o usuário preenche o formulário de cadastro de cartão com nome, conta, limite, datas e bandeira
- **Quando** a requisição POST para `/api/pay-method/register` é disparada
- **Então** o payload transmitido contém exclusivamente colunas existentes na tabela `pay_methods` (`name`, `credit_card`, `bank_account_id`, `due_day`, `closing_day`, `last_four_digits`, `credit_limit`, `icon`, `color`), mapeando a bandeira estritamente para o campo `icon` e omitindo `brand`.

#### AC-216 — Uso de display_id nas rotas de edição e exclusão de cartões
- **Dado** que o usuário executa edição ou exclusão de um cartão na interface
- **Quando** as requisições `PATCH /api/pay-method/update/:id` ou `DELETE /api/pay-method/delete/:id` são chamadas
- **Então** o parâmetro `:id` enviado na URL corresponde ao `display_id` do cartão (fallback para `id` se inexistente), atendendo ao schema de validação do backend.

#### AC-217 — Estado de carregamento e feedback visual de erro
- **Dado** que o usuário submete o formulário de cartão
- **Quando** a requisição estiver em processamento ou ocorrer erro na resposta
- **Então** o botão de envio exibe indicador de carregamento desabilitado (`isSubmitting`) e eventuais erros da API exibem mensagem de alerta na interface em vez de falha silenciosa.

## Fora de escopo

- Pagamento da fatura não é tratado aqui (será tratado em outra feature de transações ou faturas).
- Edição do campo `credit_card` (o backend trava a propriedade `credit_card` na criação).

## Suposições

| ID      | Suposição                                                                                                                                                      | Status     | Resolução                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| ASM-019 | O resumo da fatura e as transações vêm do endpoint `/api/dashboard-report/credit-card-summary?includeTransactions=true` com suporte a `startDate` e `endDate`. | confirmada | Confirmado: endpoint suporta período, permitindo histórico de faturas. |
| ASM-020 | Apenas cartões de crédito (`credit_card: true`) devem ser exibidos nesta tela; cartões de débito pertencem a outra seção (ou ficam ocultos).                   | confirmada | Confirmado conforme separação de módulos.                              |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                | Status     | Resposta                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-016 | A exclusão ou edição (limite, nome) de um cartão de crédito faz parte do escopo inicial ou só a criação e visualização? | respondida | Sim, edição (nome, conta, dias de vencimento/fechamento) e exclusão estarão disponíveis diretamente no menu do card na tela de cartões e em Configurações. |
| Q-017 | Como exibir as faturas de meses anteriores? Estão no escopo desta feature, ou haverá navegação de meses futuramente?    | respondida | Suportado nativamente via parâmetros startDate e endDate no endpoint credit-card-summary, com seletor de mês (< Mês/Ano >) na tela de detalhe da fatura.   |
