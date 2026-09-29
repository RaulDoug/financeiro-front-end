# Tasks: Correcoes Basicas — Troca de Posicao dos Campos no Mobile

> feature: correcoes-basicas

## T-206 — Trocar ordem dos campos no MobileQuickEntry [concluida]
- Refs: US-086, AC-318, AC-319
- Arquivos: src/components/transactions/MobileQuickEntry.tsx
- Esforço: baixo
- Notas: Inverter a posição do bloco do chip-pay-method com o bloco do chip-account quando type !== 'transfers'. Manter idêntico o bloco type === 'transfers'.

## T-207 — Testes automatizados de especificação AC-318 e AC-319 [concluida]
- Refs: US-086, AC-318, AC-319
- Arquivos: test/correcoes-basicas.spec.test.js
- Esforço: baixo
- Notas: Criar suíte de testes validando os critérios de aceite AC-318 e AC-319 com node --test.
