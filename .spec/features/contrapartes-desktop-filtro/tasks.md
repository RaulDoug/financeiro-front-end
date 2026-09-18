# Tasks: Filtragem Contextual de Contrapartes no Desktop

> feature: contrapartes-desktop-filtro

## T-191 — Especificação formal onp-spec-driven [concluida]
- Refs: US-080, AC-294, AC-295
- Arquivos: `.spec/features/contrapartes-desktop-filtro/spec.md`, `.spec/features/contrapartes-desktop-filtro/tasks.md`
- Notas: Especificação dos critérios AC-294 e AC-295 e tarefas.

## T-192 — Filtragem de contrapartes e auto-seleção em TransactionFormBase [concluida]
- Refs: US-080, AC-294, AC-295
- Arquivos: `src/components/transactions/TransactionFormBase.tsx`
- Notas: Implementados `filteredCounterparties`, `displayCounterparties`, `data-testid="select-counterparty"`, auto-seleção e fallback seguro no submit.

## T-193 — Suíte de testes automatizados executáveis [concluida]
- Refs: US-080, AC-294, AC-295
- Arquivos: `test/contrapartes-desktop-filtro.spec.test.js`
- Notas: Testes executados e aprovados via `node --test`.

