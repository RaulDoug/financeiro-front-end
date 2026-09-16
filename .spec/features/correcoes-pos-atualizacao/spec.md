# Spec: Correções Pós-Atualização

> feature: correcoes-pos-atualizacao
> status: pronta

## Contexto

Conjunto de correções identificadas após a última atualização do sistema. Abrange problemas de layout (sino de notificação descentralizado), comportamento do modal de transação na tela de transações, detalhes de transação sem botão de pagamento, formulário de cartão cortado/sem fechamento, transações vencidas ausentes na listagem, transações recentes do dashboard não clicáveis/visual incorreto e erro 500 no cadastro de cartão via API.

## Histórias

### US-043 — Centralização do Ícone de Notificação

Como usuário, quero que o sino de notificação apareça centralizado horizontalmente na tela, para que a interface não pareça quebrada.

#### AC-156 — Sino centralizado na viewport horizontal

- **Dado** que o usuário está em qualquer tela do aplicativo
- **Quando** o header/navbar é renderizado
- **Então** o ícone do sino de notificação está posicionado de forma que seu centro de referência seja a viewport (não o próprio ícone como âncora), sem corte na borda direita

### US-044 — Modal de Transação na Tela de Transações

Como usuário na tela de transações, quero que ao clicar no botão "+" da barra inferior o modal de nova transação abra imediatamente nessa mesma tela, para não precisar navegar para outra tela para criar uma transação.

#### AC-157 — Botão "+" da barra inferior abre modal na tela de transações

- **Dado** que o usuário está na tela de transações em mobile
- **Quando** clica no botão "+" da barra de navegação inferior
- **Então** o modal de nova transação abre imediatamente na tela de transações, sem redirecionar para a tela inicial

#### AC-158 — Estado do modal não vaza entre telas

- **Dado** que o usuário está na tela de transações e clica no botão "+"
- **Quando** navega para outra tela sem fechar o modal
- **Então** ao retornar para a tela inicial o modal NÃO aparece aberto — o estado do modal é limpo ao sair da tela de transações

### US-045 — Botão de Pagamento nos Detalhes da Transação

Como usuário visualizando os detalhes de qualquer transação com status diferente de "completed", quero ter acesso a um botão de "Marcar como Pago" / efetuar pagamento, independente de qual tela abriu os detalhes (dashboard, lista de transações, ou qualquer outra).

#### AC-159 — Botão de pagamento visível em detalhes de transações pendentes

- **Dado** que o usuário abre os detalhes de uma transação com status diferente de "completed" (ex: pending, overdue)
- **Quando** a tela/drawer de detalhes é exibida
- **Então** há um botão visível "Marcar como Pago" ou "Efetuar Pagamento", independente de qual tela originou a navegação

#### AC-160 — Botão de pagamento ausente em transações já concluídas

- **Dado** que o usuário abre os detalhes de uma transação com status "completed"
- **Quando** a tela/drawer de detalhes é exibida
- **Então** o botão de pagamento NÃO é exibido (transação já concluída)

### US-046 — Formulário de Cadastro de Cartão Funcional

Como usuário, quero que o card/modal de cadastro de cartão de crédito seja completamente visível e tenha um botão de fechar funcional, tanto quando aberto pela tela de cartões quanto pelas configurações.

#### AC-161 — Formulário de cartão sem corte superior

- **Dado** que o usuário abre o formulário de cadastro de cartão (qualquer origem)
- **Quando** o card/modal é renderizado
- **Então** a parte superior do formulário (incluindo título e botão de fechar) é completamente visível, sem corte por overflow ou z-index

#### AC-162 — Botão de fechar do formulário de cartão funciona

- **Dado** que o formulário de cadastro de cartão está aberto
- **Quando** o usuário clica no botão "X" ou "Fechar"
- **Então** o formulário é fechado imediatamente, voltando à tela anterior

#### AC-163 — Formulário de cartão acessível pelas configurações

- **Dado** que o usuário acessa Configurações → Métodos de Pagamento e clica em adicionar novo cartão
- **Quando** o formulário é aberto
- **Então** o comportamento é idêntico ao descrito em AC-161 e AC-162 (sem corte, com fechamento funcional)

### US-047 — Transações Vencidas na Listagem

Como usuário, quero que as transações com status "overdue" (vencidas/atrasadas) apareçam na lista de transações, para que eu possa identificar e resolver os pagamentos em atraso.

#### AC-164 — Transações vencidas exibidas na listagem

- **Dado** que o usuário possui transações com data de vencimento anterior a hoje e status pendente/vencido
- **Quando** acessa a lista de transações
- **Então** essas transações aparecem na listagem com badge visual "Atrasada (X dias)" em vermelho, conforme AC-043 da feature transacoes

### US-048 — Transações Recentes Clicáveis no Dashboard

Como usuário no dashboard, quero poder clicar nas transações recentes para ver seus detalhes, e quero que elas sejam exibidas com o mesmo layout visual da tabela da tela de transações.

#### AC-165 — Transações recentes clicáveis no dashboard

- **Dado** que o usuário está no dashboard e vê a seção "Transações Recentes"
- **Quando** clica em qualquer transação da lista
- **Então** os detalhes daquela transação são abertos (drawer ou modal de detalhes)

#### AC-166 — Layout visual das transações recentes alinhado com a tela de transações

- **Dado** que o usuário visualiza as "Transações Recentes" no dashboard
- **Quando** a seção é renderizada
- **Então** cada item da lista exibe data, descrição (com chips de categoria), valor com cor indicativa (verde/vermelho) e status visual — seguindo o mesmo padrão visual da tabela de transações

### US-049 — Erro 500 no Cadastro de Cartão Corrigido

Como usuário, quero poder cadastrar um cartão de crédito com sucesso, sem receber erro interno do servidor ao submeter o formulário.

#### AC-167 — Cadastro de cartão sem erro 500

- **Dado** que o usuário preenche corretamente os dados do formulário de novo cartão de crédito
- **Quando** clica em salvar
- **Então** a requisição POST para `/api/pay-method/register` retorna sucesso (2xx), o cartão é criado e aparece na listagem

#### AC-168 — Payload de cadastro de cartão correto

- **Dado** que o usuário submete o formulário de cartão
- **Quando** os dados são enviados para a API
- **Então** o payload contém todos os campos obrigatórios no formato esperado pela API (sem campos extras que causem rejeição ou campos faltando que causem erro 500)

## Fora de escopo

- Redesign completo do header/navbar.
- Implementação de sistema de pagamento online de faturas.
- Mudança na estrutura da API backend.

## Suposições

| ID      | Suposição                                                                                                                                                   | Status | Resolução                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| ASM-042 | O erro 500 no cadastro de cartão é causado por payload incorreto no front-end (campos faltando ou com nome/tipo errado), não por bug no backend.            | aberta | A validar ao inspecionar o payload enviado vs contrato da API em api_docs.md. |
| ASM-043 | O estado do modal de transação é gerenciado por Zustand store global; a correção envolve limpeza do estado ao desmontar o componente da tela de transações. | aberta | A confirmar inspecionando transactionModal.store.ts.                          |
| ASM-044 | O sino de notificação usa posicionamento CSS com referência ao próprio elemento; centralizar requer ajuste no container pai com `justify-content: center`.  | aberta | A confirmar ao inspecionar o componente de header/NotificationsBell.tsx.      |

## Perguntas em aberto

| ID    | Pergunta                                                                                                                                                            | Status     | Resposta                                                                                                                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q-034 | O botão de "efetuar pagamento" nos detalhes da transação deve apenas marcar como `completed` com data de hoje, ou abrir um fluxo de seleção de método de pagamento? | respondida | Abrir mini-formulário para o usuário escolher conta/método de pagamento E a data de pagamento antes de confirmar.                                                                                |
| Q-035 | As transações vencidas estão ausentes porque o filtro padrão por `due_date` do mês corrente não as inclui, ou há um bug de consulta à API?                          | respondida | Trazer vencidas independente do filtro de mês — se o filtro é "mês corrente", transações vencidas de meses anteriores devem aparecer mesmo assim (sem restrição de período para status overdue). |
