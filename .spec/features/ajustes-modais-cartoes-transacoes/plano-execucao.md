# Plano de Execução: Ajustes de Layout e Modais (Cartões e Transações)

> feature: ajustes-modais-cartoes-transacoes
> metodologia: opn-spec-driven

## 1. Visão Geral e Alinhamento

Implementação do comportamento de Bottom Sheet (gaveta inferior) com gesto de arraste para baixo (drag-to-dismiss) no modal de lançamento/edição de cartão de crédito no mobile (`CreditCardModal`), correção do confinamento do backdrop escuro e centralização viewport nos modais (`CreditCardModal`, `CreditCardDeleteDialog`, `TransactionModal`) através de `createPortal(..., document.body)`, e remoção da barra de rolagem lateral cinza no modal de transações desktop (`TransactionModal`).

## 2. Rastreabilidade de Histórias e Tarefas

- **US-076** (Layout Mobile em Bottom Sheet no Cartão) -> `T-183`, `T-186` (AC-279, AC-280)
- **US-077** (Backdrop de Tela Inteira e Centralização Viewport via Portal) -> `T-182`, `T-183`, `T-184`, `T-185`, `T-186` (AC-281, AC-282)
- **US-078** (Remoção da Barra Lateral de Rolagem no Desktop) -> `T-182`, `T-185`, `T-186` (AC-283)

## 3. Fases de Execução

1. **Fase 1 — CSS**: Adição da classe `.no-scrollbar` e normalização do keyframe `viewFadeIn` para `transform: none`.
2. **Fase 2 — Cartões**: Refatoração do `CreditCardModal` para comportar drawer com `#drawer-handle`, touch handlers, `useModalTransition` e `createPortal`. Aplicação de Portal em `CreditCardDeleteDialog`.
3. **Fase 3 — Transações**: Aplicação de Portal e classes `.no-scrollbar` em `TransactionModal`.
4. **Fase 4 — Testes & Verificação**: Criação da suíte `test/ajustes-modais-cartoes-transacoes.spec.test.js` com anotações `@spec:AC-xxx` e execução via Node test runner.

