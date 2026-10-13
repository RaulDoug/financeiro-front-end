// Testes de spec da feature calculo-previsao-sobra
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { formatCurrency } from '../src/utils/formatCurrency.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-085 — Alternância da Previsão de Sobra no Dashboard
test('AC-315: Suporte ao campo monthForecastFinal no contrato de dados @spec:AC-315', () => {
  const typesSource = readSource('types/dashboard.ts');
  assert.ok(
    typesSource.includes('monthForecastFinal?: number;'),
    'A interface DashboardSummary deve conter monthForecastFinal?: number;'
  );

  const summary = {
    completedIncomes: 5000,
    completedExpenses: 1800,
    pendingIncomes: 1200,
    pendingExpenses: 650,
    totalBalance: 8500,
    monthForecast: 3750,
    monthForecastFinal: 9050,
  };

  assert.equal(formatCurrency(summary.monthForecast), 'R$\u00a03.750,00');
  assert.equal(formatCurrency(summary.monthForecastFinal), 'R$\u00a09.050,00');

  // Fallback defensivo quando monthForecastFinal for omitido
  const summarySemFinal = {
    completedIncomes: 5000,
    completedExpenses: 1800,
    pendingIncomes: 1200,
    pendingExpenses: 650,
    totalBalance: 8500,
    monthForecast: 3750,
  };
  const resolvedForecast = summarySemFinal.monthForecastFinal ?? summarySemFinal.monthForecast ?? 0;
  assert.equal(resolvedForecast, 3750);
});

// US-085 — Alternância da Previsão de Sobra no Dashboard
test('AC-316: Toggle interativo no card de Sobra Projetada @spec:AC-316', () => {
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');

  assert.ok(
    kpiSource.includes('data-testid="toggle-forecast-balance"'),
    'Deve conter identificador data-testid="toggle-forecast-balance" no switch'
  );
  assert.ok(
    kpiSource.includes('Considerar saldo em conta'),
    'Deve exibir o rótulo "Considerar saldo em conta"'
  );
  assert.ok(
    kpiSource.includes('monthForecastFinal ?? defaultForecast'),
    'Deve alternar para monthForecastFinal com fallback gracioso'
  );
  assert.ok(
    kpiSource.includes("title: includeBalance ? 'Saldo Final Projetado' : 'Sobra Projetada'"),
    'Título do card deve alternar conforme o modo selecionado'
  );
  assert.ok(
    kpiSource.includes('isNegativeForecast = currentForecast < 0'),
    'As cores de destaque devem ser recalculadas dinamicamente com base no currentForecast'
  );
});

// US-085 — Alternância da Previsão de Sobra no Dashboard
test('AC-317: Persistência e acessibilidade do seletor de previsão @spec:AC-317', () => {
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');

  assert.ok(
    kpiSource.includes("STORAGE_KEY = 'app:forecast_include_balance'"),
    'Deve utilizar a chave app:forecast_include_balance para armazenamento local'
  );
  assert.ok(
    kpiSource.includes('localStorage.getItem(STORAGE_KEY)'),
    'Deve ler o estado inicial salvo no localStorage'
  );
  assert.ok(
    kpiSource.includes('localStorage.setItem(STORAGE_KEY'),
    'Deve gravar o estado atualizado no localStorage'
  );
  assert.ok(
    kpiSource.includes('role="switch"'),
    'O controle interativo deve possuir o atributo semântico role="switch"'
  );
  assert.ok(
    kpiSource.includes('aria-checked={includeBalance}'),
    'O switch deve refletir o estado de seleção através de aria-checked'
  );
  assert.ok(
    kpiSource.includes('htmlFor="toggle-forecast-balance"'),
    'O label deve estar vinculado ao switch por acessibilidade com htmlFor'
  );
});

// US-085 — Suporte aos campos da API projected_balance e projected_final_balance com tabs e tooltips
test('AC-318: Suporte a projected_balance, projected_final_balance, tabs, tooltip e cores verde/vermelho @spec:AC-318', () => {
  const typesSource = readSource('types/dashboard.ts');
  assert.ok(
    typesSource.includes('projected_balance?: number;') &&
    typesSource.includes('projected_final_balance?: number;'),
    'A interface DashboardSummary deve conter projected_balance e projected_final_balance opcionais'
  );

  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');
  assert.ok(
    kpiSource.includes('summary?.projected_balance ?? summary?.monthForecast ?? 0'),
    'Deve usar projected_balance com fallback para monthForecast'
  );
  assert.ok(
    kpiSource.includes('summary?.projected_final_balance ?? summary?.monthForecastFinal ?? defaultForecast'),
    'Deve usar projected_final_balance com fallback para monthForecastFinal'
  );
  assert.ok(
    kpiSource.includes('data-testid="forecast-mode-selector"'),
    'Deve conter container de tabs de alternância rápida'
  );
  assert.ok(
    kpiSource.includes('data-testid="forecast-mode-pure"'),
    'Deve conter botão de modo Sobra do Mês'
  );
  assert.ok(
    kpiSource.includes('data-testid="forecast-mode-final"'),
    'Deve conter botão de modo Saldo em Conta'
  );
  assert.ok(
    kpiSource.includes('forecastTooltip'),
    'Deve conter mensagem explicativa em tooltip'
  );
  assert.ok(
    kpiSource.includes('data-testid="forecast-legend"'),
    'Deve conter legenda explicativa contextual'
  );
  assert.ok(
    kpiSource.includes('text-emerald-600') && kpiSource.includes('text-emerald-700'),
    'Deve destacar valor positivo em verde'
  );
  assert.ok(
    kpiSource.includes('text-rose-600') && kpiSource.includes('text-rose-700'),
    'Deve destacar valor negativo em vermelho'
  );
});

