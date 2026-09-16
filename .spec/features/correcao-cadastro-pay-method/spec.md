# Spec: Correção no Cadastro de Métodos de Pagamento

> feature: correcao-cadastro-pay-method
> status: implementada

## Contexto

Ao submeter a criação de novos métodos de pagamento (`POST /api/pay-method/register`) através da tela de configurações (`/settings/pay-methods`), a requisição falha com status HTTP 500 (Internal Server Error). Isso ocorre porque campos exclusivos da interface como `type` ("pix", "money", etc.) são propagados no corpo da requisição e o backend dinamicamente monta a query SQL `INSERT INTO "pay_methods"` com todas as chaves do objeto, resultando em erro no PostgreSQL por coluna inexistente. Esta especificação define a sanitização estrita dos dados nos serviços e modais de formas de pagamento para garantir conformidade com o schema do banco.

## Histórias

### US-062 — Sanitização e Persistência Confiável de Métodos de Pagamento

Como usuário do aplicativo financeiro, quero cadastrar e atualizar métodos de pagamento (dinheiro, pix, cartões e contas vinculadas) sem receber erros internos do servidor (HTTP 500), para que eu possa gerenciar minhas formas de pagamento normalmente.

#### AC-218 — Sanitização estrita no payload de cadastro de método de pagamento
- **Dado** que o usuário preenche o formulário de novo método de pagamento com nome, tipo de método, conta bancária ou dados de cartão
- **Quando** o serviço `payMethodService.registerPayMethod` envia a requisição `POST /api/pay-method/register`
- **Então** o payload transmitido contém exclusivamente os campos persistíveis na tabela `pay_methods` (`name`, `credit_card`, `bank_account_id`, `due_day`, `closing_day`, `last_four_digits`, `credit_limit`, `icon`, `color`), expurgando propriedades de interface como `type` e convertendo valores vazios ou ausentes adequadamente.

#### AC-219 — Sanitização estrita no payload de atualização de método de pagamento
- **Dado** que o usuário edita um método de pagamento existente
- **Quando** o serviço `payMethodService.updatePayMethod` envia a requisição `PATCH /api/pay-method/update/:id`
- **Então** o payload enviado inclui apenas os campos aceitos pelo schema de atualização (`name`, `bank_account_id`, `due_day`, `closing_day`, `icon`, `color`), expurgando `type` ou quaisquer chaves espúrias que não existam na entidade do banco.

#### AC-220 — Envio limpo e feedback no modal de método de pagamento
- **Dado** que o usuário interage com o `PayMethodModal`
- **Quando** submete o formulário com dados válidos tanto para método comum quanto para cartão de crédito
- **Então** o modal submete os dados sem vazar `type` no objeto enviado para mutação, preservando cor e ícone selecionados e tratando erros de rede com feedback visual.

## Fora de escopo

- Alteração da tabela `pay_methods` no banco de dados do backend PostgreSQL.
- Alteração no fluxo de cartão de crédito da tela de cartões (`/credit-cards`), que já possui sanitização via `creditCardService`.

## Suposições

| ID      | Suposição                                                                                                                                                                                          | Status     | Resolução                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| ASM-056 | O backend PostgreSQL mapeia estritamente os campos `name`, `credit_card`, `bank_account_id`, `due_day`, `closing_day`, `last_four_digits`, `credit_limit`, `icon`, `color` na tabela `pay_methods` | confirmada | Confirmado em schema.sql e na análise da query dinâmica do backend |

## Perguntas em aberto

Nenhuma.
