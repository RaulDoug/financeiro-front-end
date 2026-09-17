# Tasks: Animações e Arraste em Modais e Gavetas

> feature: animacoes-e-arraste-modais

## T-176 — Definição de keyframes e classes utilitárias de animação em index.css [concluida]
- Refs: US-073, AC-269, AC-270, AC-273
- Arquivos: src/index.css
- Notas: Configurar animações nativas de drawer-in, drawer-out, modal-scale-in, modal-scale-out, backdrop-fade-in e backdrop-fade-out compatíveis com Tailwind v4.

## T-177 — Criação do hook utilitário useModalTransition para controle de desmonte seguro [concluida]
- Refs: US-073, AC-271
- Arquivos: src/hooks/useModalTransition.ts
- Notas: Hook leve responsável por gerenciar estados isMounted, isClosing e permitir fechamento suave antes de desmontar o componente do DOM.

## T-178 — Implementação de drag-to-dismiss e animações de entrada/saída em MobileQuickEntry [concluida]
- Refs: US-072, US-073, AC-266, AC-267, AC-268, AC-269
- Arquivos: src/components/transactions/MobileQuickEntry.tsx
- Notas: Capturar toques no #drawer-handle, aplicar deslocamento vertical em tempo real no translateY, amortecer opacidade do backdrop e disparar fechamento suave ao ultrapassar 90px.

## T-179 — Integração de animações de entrada e saída em MoreMenuModal e TransactionModal [concluida]
- Refs: US-073, US-074, AC-269, AC-270, AC-272
- Arquivos: src/components/layout/MoreMenuModal.tsx, src/components/transactions/TransactionModal.tsx
- Notas: Aplicar hook useModalTransition e classes de animação suave na gaveta de navegação mobile e no modal desktop.

## T-180 — Suavização de transição de rota (Viewport Fade) e modais de confirmação [concluida]
- Refs: US-073, US-074, AC-270, AC-273
- Arquivos: src/layouts/AppLayout.tsx, src/components/bank-accounts/DeleteConfirmModal.tsx
- Notas: Adicionar transição sutil de visualização no Outlet do AppLayout e animação de escala e dissolvência no modal de exclusão.

## T-181 — Suíte de testes automatizados de especificação para critérios AC-266 a AC-273 [concluida]
- Refs: US-072, US-073, US-074, AC-266, AC-267, AC-268, AC-269, AC-270, AC-271, AC-272, AC-273
- Arquivos: test/animacoes-e-arraste-modais.spec.test.js
- Notas: Cobertura executável via Node test runner com verificação mecânica de cada critério de aceite.
