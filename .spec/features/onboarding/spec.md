# Spec: Onboarding

> feature: onboarding
> status: pronto

## Contexto

Acesso inicial de novos usuários ao sistema. Para evitar uma tela vazia ("Empty State" frustrante), o sistema deve obrigar e guiar o usuário a criar sua estrutura financeira básica no primeiro acesso: uma Carteira, uma Conta Bancária atrelada e, opcionalmente, um Cartão de Crédito.

## Histórias

### US-004 — Assistente de primeiros passos (Wallet e Redirecionamento)

Como um novo usuário que acabou de fazer o primeiro login, quero ser guiado na configuração do meu espaço financeiro inicial, para que eu possa começar a usar o aplicativo corretamente e não caia em uma tela em branco.

#### AC-013 — Redirecionamento forçado ao onboarding
- **Dado** que o usuário fez login com sucesso no sistema
- **Quando** o front-end consulta `GET /api/wallet` e recebe `walletsList` vazio
- **Então** ele é imediatamente redirecionado para a tela do Wizard de Onboarding ao invés do Dashboard principal

#### AC-014 — Criação da primeira carteira (Step 1)
- **Dado** que o usuário está no passo inicial (Step 1) do onboarding
- **Quando** ele preenche o nome da carteira desejado e clica para avançar
- **Então** o sistema aciona a API para criar a carteira (`POST /api/wallet/register`) e avança para o Step 2

### US-005 — Configuração das contas e cartões no onboarding

Como um usuário no assistente inicial, quero adicionar minha primeira conta bancária e, caso queira, meu cartão de crédito, para ter meus saldos reais e limites refletidos no app assim que terminar.

#### AC-015 — Criação da primeira conta bancária (Step 2)
- **Dado** que o usuário completou o Step 1 e está no Step 2
- **Quando** ele preenche os dados (nome da conta, banco emissor) informando ou não um saldo inicial e avança
- **Então** o sistema cadastra a conta no backend (`POST /api/bank-account/register`), atrelando-a ao cabeçalho `x-wallet-id` da carteira recém-criada, e avança para o Step 3

#### AC-016 — Saldo inicial padrão (Conta Bancária)
- **Dado** que o usuário está criando a sua conta bancária no Step 2
- **Quando** ele opta por deixar o saldo inicial em branco ou omite o valor
- **Então** o sistema assume e cadastra o valor "0.00" como saldo padrão

#### AC-017 — Adição de Cartão de Crédito (Step 3 - Opcional)
- **Dado** que o usuário chegou ao Step 3 (Opcional)
- **Quando** ele informa os dados do cartão de crédito (limite, dias de fechamento/vencimento da fatura) e clica em Finalizar
- **Então** o sistema cadastra o meio de pagamento (`POST /api/pay-method/register` indicando ser cartão de crédito) na carteira, salva o `wallet_id` na sessão ativa e o direciona ao Dashboard

#### AC-018 — Pular adição de Cartão de Crédito (Step 3 - Opcional)
- **Dado** que o usuário chegou ao Step 3 e não deseja cadastrar cartão de crédito
- **Quando** ele clica no botão "Pular esta etapa" ou similar
- **Então** nenhum cartão é registrado, mas o sistema salva o `wallet_id` ativo da sessão e avança o usuário diretamente para o Dashboard

#### AC-019 — Prevenção de abandono do Wizard
- **Dado** que o usuário iniciou o onboarding, mas não concluiu (não possui configuração mínima registrada)
- **Quando** ele tentar acessar diretamente qualquer outra rota da área logada como `/dashboard` pela URL
- **Então** o sistema o barra e o força de volta para o ambiente de Onboarding

#### AC-020 — Registro do estado concluído
- **Dado** que o usuário acaba de finalizar ou pular o último passo do onboarding
- **Quando** ocorre a transição final para a aplicação
- **Então** o sistema assegura que a carteira (Wallet) criada está configurada globalmente no front-end como a carteira corrente (`currentWalletId`) e as próximas requisições já incluirão este identificador

## Fora de escopo

- Suporte para criar múltiplas carteiras de uma única vez durante o onboarding.
- Validação real de saldo via integrações Open Finance/Bancárias.

## Suposições

| ID      | Suposição                                                                                                                                                                     | Status     | Resolução                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| ASM-004 | A verificação da existência de carteira acontece logo após o login e durante cada carregamento da aplicação (para lidar com refreshes no browser).                            | confirmada | O hook de checagem será executado globalmente dentro de área logada. |
| ASM-005 | O backend não trava as requisições normais sem carteira diretamente (exceto pelo erro do cabeçalho). O fluxo do Wizard é primariamente uma regra de engajamento no front-end. | confirmada | —                                                                    |
| ASM-006 | O cabeçalho `x-wallet-id` será estritamente necessário para as requisições já durante o passo 2 e 3 do onboarding.                                                            | confirmada | —                                                                    |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                                                     | Status     | Resposta                                                                                                                                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-004 | Se o usuário der "Refresh" na página (F5) estando no Step 2, perdemos o ID da carteira já criada? A abordagem será manter o andamento armazenado no Zustand com persistência para restaurar? | respondida | O front-end consulta GET /api/wallet para recuperar a carteira já criada e restaura o passo corrente do Wizard persistido no Zustand.          |
| Q-005 | Os endpoints dos passos 2 e 3 retornam os dados consolidados para já popularmos a Store ou teremos que realizar um refetch geral dos dados financeiros ao entrar no dashboard?               | respondida | Ao concluir o onboarding e navegar para o dashboard, o TanStack Query executa um refetch geral dos dados financeiros para sincronização limpa. |
