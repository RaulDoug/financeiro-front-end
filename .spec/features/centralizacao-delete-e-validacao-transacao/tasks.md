# Tasks: Centralização do Diálogo de Exclusão e Exibição de Erros de Validação

> feature: centralizacao-delete-e-validacao-transacao

## T-215 — Centralização e transição suave do `TransactionDeleteDialog` com Portal [concluida]
- Refs: US-091, AC-330, AC-331
- Arquivos: src/components/transactions/TransactionDeleteDialog.tsx
- Esforço: baixo
- Notas: Envolver o conteúdo de `TransactionDeleteDialog` em `createPortal(content, document.body)`. Integrar `useModalTransition` para animação suave de backdrop e escala, listener para fechar com tecla ESC, e suporte pleno a Tailwind dark mode.

## T-216 — Normalização de mensagens de erro de validação no cliente Axios e helper [concluida]
- Refs: US-092, AC-333
- Arquivos: src/lib/axios.ts, src/utils/apiError.ts
- Esforço: baixo
- Notas: Criar utilitário `getApiErrorMessage` para extrair mensagens de array `errors` (formato `{ status: 'fail', errors: [{ field, message }] }`), `message`, `error` ou fallback. Atualizar interceptor de resposta do Axios para preencher automaticamente `error.response.data.message` quando houver array `errors`.

## T-217 — Validação de descrição mínima e exibição de erro no `MobileQuickEntry` e `TransactionModal` [concluida]
- Refs: US-092, AC-332, AC-333
- Arquivos: src/components/transactions/MobileQuickEntry.tsx, src/components/transactions/TransactionModal.tsx
- Esforço: baixo
- Notas: Adicionar validação no formulário mobile rápido (`MobileQuickEntry`): se o usuário preencher descrição com 1 ou 2 caracteres, exibir mensagem no `errorBanner` ("A descrição deve conter no mínimo 3 caracteres") e interromper submissão. Atualizar blocos catch de submissão para utilizar o helper de extração de erro da API.

## T-218 — Testes automatizados de especificação AC-330 a AC-333 [concluida]
- Refs: US-091, US-092, AC-330, AC-331, AC-332, AC-333
- Arquivos: test/centralizacao-delete-e-validacao-transacao.spec.test.js
- Esforço: baixo
- Notas: Criar suíte executável via `node --test` validando o uso de `createPortal` e `useModalTransition` em `TransactionDeleteDialog`, a extração correta de mensagens no helper `getApiErrorMessage` e interceptor do Axios, e a validação de caracteres mínimos em `MobileQuickEntry`.
