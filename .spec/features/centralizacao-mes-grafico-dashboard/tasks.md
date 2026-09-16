# Tasks: Centralização do Mês Vigente no Gráfico de Receitas x Despesas

> feature: centralizacao-mes-grafico-dashboard

## T-156 — Implementação da ref de scroll e centralização automática no mês vigente [concluida]
- Refs: US-066, AC-237, AC-239
- Arquivos: src/pages/Dashboard/components/IncomeExpenseChart.tsx
- Notas: Atribuir scrollContainerRef ao contêiner de rolagem horizontal, calcular posição central proporcional ao mês atual quando selectedYear for o ano corrente e disparar scroll automático após carregamento dos dados. Em anos diferentes, rolar para 0.

## T-157 — Customização do tick do eixo X com destaque visual no mês atual [concluida]
- Refs: US-066, AC-238
- Arquivos: src/pages/Dashboard/components/IncomeExpenseChart.tsx
- Notas: Implementar CustomTick para o XAxis do Recharts aplicando cor esmeralda/azul e peso tipográfico semibold com identificador data-testid="current-month-tick" quando o mês for o mês vigente e o ano for o corrente.

## T-158 — Testes automatizados de especificação AC-237 a AC-239 [concluida]
- Refs: US-066, AC-237, AC-238, AC-239
- Arquivos: test/centralizacao-mes-grafico-dashboard.spec.test.js
- Notas: Criar suíte executável via node --test validando todas as regras e seletores de centralização e destaque visual no IncomeExpenseChart.
