# Tasks: Ajustes de Layout e Modais (Cartões e Transações)

> feature: ajustes-modais-cartoes-transacoes

## T-182 — Definição de utilitários no-scrollbar e normalização de viewFadeIn em index.css [concluida]
- Refs: US-077, US-078, AC-281, AC-283
- Arquivos: src/index.css
- Notas: Criar classes utilitárias de ocultação de barra de rolagem e atualizar @keyframes viewFadeIn para finalizar com transform: none, liberando o containing block de nós filhos.

## T-183 — Transformação do CreditCardModal em Bottom Sheet mobile com arraste e Portal [concluida]
- Refs: US-076, US-077, AC-279, AC-280, AC-281, AC-282
- Arquivos: src/components/credit-cards/CreditCardModal.tsx
- Notas: Implementar layout gaveta com rounded-t-3xl e drag-to-dismiss via #drawer-handle no mobile, suporte a useModalTransition e ancoragem no document.body via createPortal.

## T-184 — Ancoragem via Portal e animação suave em CreditCardDeleteDialog [concluida]
- Refs: US-077, AC-281
- Arquivos: src/components/credit-cards/CreditCardDeleteDialog.tsx
- Notas: Aplicar createPortal para document.body e useModalTransition no diálogo de exclusão de cartão de crédito.

## T-185 — Portal e remoção de barra de rolagem lateral no TransactionModal [concluida]
- Refs: US-077, US-078, AC-281, AC-283
- Arquivos: src/components/transactions/TransactionModal.tsx
- Notas: Ancorar modal no document.body com createPortal e aplicar utilitários no-scrollbar no container e card do modal desktop.

## T-186 — Suíte de testes automatizados de especificação para AC-279 a AC-283 [concluida]
- Refs: US-076, US-077, US-078, AC-279, AC-280, AC-281, AC-282, AC-283
- Arquivos: test/ajustes-modais-cartoes-transacoes.spec.test.js
- Notas: Testes unitários com Node test runner verificando a aderência aos critérios de aceite especificados.

