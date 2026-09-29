# Spec: Centralização do Diálogo de Exclusão e Exibição de Erros de Validação

> feature: centralizacao-delete-e-validacao-transacao
> status: implementada

## Contexto

Atualmente, ao acionar a exclusão de uma transação na listagem de transações, o diálogo de confirmação (`TransactionDeleteDialog`) é renderizado dentro do container da página e do layout animado (`animate-view-fade-in`), ficando restrito à área da seção de transações em vez de centralizado na tela geral (viewport). Além disso, ao tentar lançar uma transação com descrição inferior a 3 caracteres (ex: 2 caracteres), o formulário rápido mobile não valida o tamanho mínimo previamente, e ao receber a rejeição HTTP 400 da API (`{ status: 'fail', errors: [{ field: 'body.description', message: 'A descrição deve conter no mínimo 3 caracteres' }] }`), o aplicativo descarta a lista de erros e exibe apenas a mensagem genérica do Axios "Request failed with status code 400", sem informar o motivo real ao usuário. Esta feature corrige o posicionamento do diálogo de exclusão através de React Portal (`createPortal`) e implementa a extração e exibição clara dos erros de validação da API e no formulário.

## Histórias

### US-091 — Centralização do Diálogo de Exclusão no Viewport Geral

Como usuário do FinFlow gerenciando transações, quero que a caixa de confirmação de exclusão surja centralizada no meio da tela inteira com backdrop cobrindo a viewport, para que o foco de confirmação fique claro e não confinado apenas ao container da tabela.

#### AC-330 — Renderização do diálogo de exclusão via Portal no body com centralização total

- **Dado** que o usuário está na tela de transações e clica no ícone de lixeira de um lançamento
- **Quando** o diálogo de confirmação de exclusão for acionado
- **Então** ele deve ser renderizado diretamente em `document.body` via `createPortal`, cobrindo toda a janela (`fixed inset-0 z-50 flex items-center justify-center bg-black/60`) e centralizando o modal perfeitamente na tela geral, independente do scroll e limites do container da listagem.

#### AC-331 — Animações de transição suave e suporte ao fechamento por tecla ESC

- **Dado** que o diálogo de confirmação de exclusão de transação está aberto
- **Quando** o usuário pressiona a tecla ESC ou clica no backdrop/botão Cancelar
- **Então** o diálogo executa a transição suave de saída (`animate-modal-out` e `animate-backdrop-out`) gerenciada por `useModalTransition` e é desmontado de forma limpa.

### US-092 — Validação e Exibição Amigável de Erros na Criação de Transação

Como usuário lançando despesas ou receitas no FinFlow, quero ser avisado de forma clara quando a descrição não atingir a quantidade mínima de 3 caracteres ou quando a API acusar erro de validação, para que eu saiba exatamente o que corrigir sem ver códigos de erro genéricos como "Request failed with status code 400".

#### AC-332 — Validação prévia de tamanho mínimo de descrição no lançamento rápido mobile

- **Dado** que o usuário está utilizando o lançamento rápido mobile (`MobileQuickEntry`)
- **Quando** digita um texto de descrição com menos de 3 caracteres (1 ou 2 caracteres) e tenta salvar
- **Então** o envio da requisição é bloqueado e uma mensagem de validação em português ("A descrição deve conter no mínimo 3 caracteres") é apresentada no banner de erro do formulário.

#### AC-333 — Extração automática de mensagens de validação da API (status 400 com errors)

- **Dado** que qualquer formulário ou modal de transação submete dados rejeitados pela validação do back-end com status HTTP 400 e payload contendo array `errors` (formato `{ status: 'fail', errors: [{ message, field }] }`)
- **Quando** a resposta de erro for capturada pelo interceptor do Axios ou pelo manipulador de erro do modal
- **Então** a mensagem amigável contida em `errors` (ex: "A descrição deve conter no mínimo 3 caracteres") é extraída e exibida no banner de erro para o usuário em vez da mensagem genérica "Request failed with status code 400".

## Fora de escopo

- Alterações em arquivos do back-end (`API_Financeiro`), que permanece somente leitura conforme diretriz do projeto.
- Alteração no tamanho mínimo de caracteres exigido pelo schema do back-end (que permanece 3 caracteres).

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-085 | O uso de `createPortal(content, document.body)` em `TransactionDeleteDialog` resolve a contenção provocada por classes de transform e animação de rota (`animate-view-fade-in`), alinhando o componente ao padrão já adotado em `CreditCardDeleteDialog` e `DeleteConfirmModal`. | confirmada | Comprovado pela implementação idêntica bem-sucedida em `CreditCardDeleteDialog.tsx`. |
| ASM-086 | O middleware de validação do back-end (`validate.js`) retorna erros Zod no formato `{ status: 'fail', errors: [{ field, message }] }` com status 400, exigindo que o interceptor de resposta ou o helper de erro desempacote a mensagem para `error.response.data.message`. | confirmada | Confirmado pela leitura do middleware `validate.js` do back-end. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-047 | Se a descrição for deixada em branco no formulário mobile rápido, o sistema ainda deve aplicar a descrição padrão ("Despesa", "Receita", "Transferência")? | respondida | Sim, caso o campo fique totalmente vazio o fallback para a descrição padrão continua ativo; a validação de mínimo de 3 caracteres só atua quando o usuário de fato digita um texto customizado com 1 ou 2 caracteres. |
| Q-048 | O normalizador de mensagens de erro deve atuar globalmente no interceptor do Axios para beneficiar também outros fluxos com respostas 400 contendo `errors`? | respondida | Sim, normalizar `error.response.data.message` no interceptor do Axios garante que qualquer chamada que leia `err?.response?.data?.message` receba a mensagem tratada automaticamente. |
