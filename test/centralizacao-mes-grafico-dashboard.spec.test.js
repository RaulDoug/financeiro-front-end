// Testes de spec da feature centralizacao-mes-grafico-dashboard — onp-spec
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-066 — Foco e Centralização Automática no Mês Atual no Gráfico do Dashboard
test('AC-237: Centralização automática do scroll horizontal no mês vigente @spec:AC-237', () => {
  const chartSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');

  // Deve possuir ref atribuída ao contêiner de rolagem
  assert.ok(
    chartSource.includes('scrollContainerRef = useRef') &&
    chartSource.includes('ref={scrollContainerRef}'),
    'IncomeExpenseChart deve vincular scrollContainerRef ao contêiner de scroll horizontal'
  );

  // Deve calcular a posição central proporcional do mês vigente e rolar suavemente
  assert.ok(
    chartSource.includes('monthCenter') &&
    chartSource.includes('targetScrollLeft') &&
    chartSource.includes('container.scrollTo({') &&
    chartSource.includes("behavior: 'smooth'"),
    'IncomeExpenseChart deve calcular targetScrollLeft centralizando o mês atual e acionar container.scrollTo'
  );

  // Deve observar redimensionamento da janela para manter alinhamento
  assert.ok(
    chartSource.includes("addEventListener('resize'") &&
    chartSource.includes("removeEventListener('resize'"),
    'IncomeExpenseChart deve manter listener de redimensionamento para recalcular alinhamento'
  );
});

test('AC-238: Destaque visual distintivo do mês corrente no eixo X @spec:AC-238', () => {
  const chartSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');

  // Deve disponibilizar identificadores para o tick e o indicador do mês corrente
  assert.ok(
    chartSource.includes('data-testid={isCurrent ? \'current-month-tick\' : undefined}'),
    'Tick do XAxis deve conter identificador current-month-tick no mês vigente'
  );

  assert.ok(
    chartSource.includes('data-testid="current-month-indicator"'),
    'Deve renderizar indicador visual sob o mês vigente com current-month-indicator'
  );

  // Deve aplicar diferenciação tipográfica e cromática no mês vigente
  assert.ok(
    chartSource.includes('#059669') && chartSource.includes('fontWeight={isCurrent ? 700 : 400}'),
    'Eixo X deve aplicar cor esmeralda e peso 700 ao mês vigente'
  );
});

test('AC-239: Preservação de rolagem inicial para anos históricos @spec:AC-239', () => {
  const chartSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');

  // Deve verificar se o ano selecionado é o corrente
  assert.ok(
    chartSource.includes('isCurrentYear = selectedYear === currentYear'),
    'Deve computar se o ano selecionado é o ano corrente'
  );

  // Em anos anteriores/posteriores, deve rolar para a posição inicial (Janeiro, left: 0)
  assert.ok(
    chartSource.includes('container.scrollTo({') &&
    chartSource.includes('left: 0'),
    'Deve resetar o scroll para left: 0 quando o ano selecionado não for o ano atual'
  );
});

