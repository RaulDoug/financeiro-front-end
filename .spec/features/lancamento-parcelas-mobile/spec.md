# Especificação: Lançamento e Edição Ágil de Parcelas e Vencimento no Mobile

> Feature: `lancamento-parcelas-mobile`  
> Referência de Usuário: `US-096`  
> Metodologia: `onp-spec-driven`

---

## Contexto e Problema

No fluxo de lançamento de transações mobile (`MobileQuickEntry`), ao ativar parcelamento ou recorrência, o componente `InstallmentFields` impedia que o usuário apagasse o número existente no campo de quantidade de parcelas (`installmentsNumber`) e dia de vencimento (`dueDay`).

Isso ocorria porque o input forçava a avaliação `parseInt(e.target.value, 10) || 2` e `value={installmentsNumber || 2}`. Ao pressionar Backspace, o valor vazio `""` convertia-se em `NaN || 2`, resultando imediatamente em `2`, de modo que o dígito nunca era apagado. No desktop, os usuários contornavam selecionando o texto antes de digitar, mantendo o layout e usabilidade satisfatórios. No layout mobile, a experiência ficava severamente degradada em teclados touch.

---

## Critérios de Aceite

### US-096 — Edição Fluida de Parcelas e Vencimento com Preservação do Layout Desktop
- **AC-342**: `InstallmentFields` deve permitir limpeza/exclusão transitória (`""`) nos campos de quantidade de parcelas e dia de vencimento enquanto o usuário digita, sem reverter imediatamente para os valores padrão (`2` e `10`).
- **AC-343**: Os campos de parcelas e dia de vencimento devem possuir `inputMode="numeric"`, `pattern="[0-9]*"` e auto-seleção de texto no foco (`onFocus`), otimizando o teclado virtual e a substituição ágil no mobile touch.
- **AC-344**: Eventos `onBlur` devem normalizar campos vazios ou fora do intervalo para os limites válidos de negócio (parcelas: entre 2 e 72; dia de vencimento: entre 1 e 31).
- **AC-345**: O layout e comportamento do desktop em `TransactionFormBase` devem ser 100% preservados, mantendo o contrato funcional de submissão sem alterações estruturais no modal desktop.
- **AC-346**: Prova executável automatizada com suíte de testes `test/lancamento-parcelas-mobile.spec.test.js` cobrindo todos os critérios de aceitação AC-342 a AC-345 com `node --test`.

---

## Suposições e Restrições Técnicas

| ID      | Suposição                                                                     | Status     | Resolução                                                                 |
| ------- | ----------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| ASM-090 | O back-end aceita parcelas entre 2 e 72 e dia de vencimento entre 1 e 31.     | confirmada | Validado nos schemas do front-end (`transaction.ts`) e contratos de API.   |
| ASM-091 | O layout desktop já atende ao usuário e não deve ter alterações estruturais.   | confirmada | Regra explícita do usuário: manter o formulário desktop inalterado.       |
