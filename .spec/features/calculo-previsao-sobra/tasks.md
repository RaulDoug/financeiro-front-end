# Tasks: Calculo de Previsao de Sobra com Opcao de Saldo em Conta

> feature: calculo-previsao-sobra

## T-203 — Tipagem e suporte a monthForecastFinal no DashboardSummary [concluida]
- Refs: US-085, AC-315
- Arquivos: src/types/dashboard.ts
- Esforço: baixo
- Notas: Adicionar `monthForecastFinal?: number;` na interface `DashboardSummary` e garantir compatibilidade retroativa com respostas parciais.

## T-204 — Implementar toggle e alternância dinâmica no KpiCards [concluida]
- Refs: US-085, AC-316, AC-317
- Arquivos: src/pages/Dashboard/components/KpiCards.tsx
- Esforço: medio
- Notas: Adicionar switch/toggle no card de Sobra Projetada com label "Considerar saldo em conta", alternância entre `monthForecast` e `monthForecastFinal`, ajuste dinâmico das cores de saldo negativo/positivo e persistência via `localStorage`.

## T-205 — Testes de especificação da funcionalidade de cálculo de sobra [concluida]
- Refs: US-085, AC-315, AC-316, AC-317
- Arquivos: test/calculo-previsao-sobra.spec.test.js
- Esforço: baixo
- Notas: Criar suíte de testes com `@spec:AC-315`, `@spec:AC-316` e `@spec:AC-317` validando a presença das propriedades tipadas, dos atributos acessíveis do switch, dos identificadores e da lógica de seleção de valor.
