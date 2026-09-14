// Testes de spec da feature relatorios
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { reportsService } from '../src/services/reports.service.ts';
import { consolidateCounterparties } from '../src/lib/reportUtils.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-023 — Visualização do DRE (Receitas vs Despesas Anual)
test('AC-096: Resumo Mensal DRE @spec:AC-096', () => {
  const pageSource = readSource('pages/Reports/AnnualReport.tsx');
  assert.ok(pageSource.includes('Poupança:'), 'Deve exibir badge de poupança positiva');
  assert.ok(pageSource.includes('Déficit:'), 'Deve exibir badge de déficit negativo');
  assert.ok(pageSource.includes('formatCurrency(row.income)'), 'Deve formatar receitas');
  assert.ok(pageSource.includes('formatCurrency(row.expense)'), 'Deve formatar despesas');
  assert.ok(pageSource.includes('formatCurrency(row.balance)'), 'Deve formatar saldo resultante');
  assert.ok(pageSource.includes('length: 12'), 'Deve iterar sobre os 12 meses do ano');
});

test('AC-097: Seleção de Ano @spec:AC-097', () => {
  const pageSource = readSource('pages/Reports/AnnualReport.tsx');
  assert.ok(pageSource.includes('selectedYear'), 'Deve gerenciar estado de ano selecionado');
  assert.ok(pageSource.includes('setSelectedYear'), 'Deve permitir alterar o ano');
  assert.ok(pageSource.includes('useAnnualReport(selectedYear)'), 'Deve recarregar relatório anual conforme ano');

  assert.equal(typeof reportsService.getAnnualDRE, 'function');
});

test('AC-098: Gráfico de Barras DRE @spec:AC-098', () => {
  const chartSource = readSource('pages/Reports/AnnualChart.tsx');
  assert.ok(chartSource.includes('BarChart'), 'Deve renderizar componente BarChart do Recharts');
  assert.ok(chartSource.includes('dataKey="Receitas"'), 'Deve conter barra de Receitas');
  assert.ok(chartSource.includes('dataKey="Despesas"'), 'Deve conter barra de Despesas');
});

// US-024 — Análise de Despesas por Categoria
test('AC-099: Listagem por Categorias @spec:AC-099', () => {
  const pageSource = readSource('pages/Reports/CategoryReport.tsx');
  assert.ok(pageSource.includes('#{rank}'), 'Deve exibir posição/ranking da categoria');
  assert.ok(pageSource.includes('cat.category_name'), 'Deve exibir nome da categoria');
  assert.ok(pageSource.includes('cat.total_amount'), 'Deve exibir total gasto');
  assert.ok(pageSource.includes('percent'), 'Deve exibir porcentagem sobre o total');
});

test('AC-100: Filtro de Período para Categorias @spec:AC-100', () => {
  const pageSource = readSource('pages/Reports/CategoryReport.tsx');
  assert.ok(pageSource.includes('startDate'), 'Deve gerenciar data inicial');
  assert.ok(pageSource.includes('endDate'), 'Deve gerenciar data final');
  assert.ok(pageSource.includes('useCategoryReport(startDate, endDate)'), 'Deve filtrar categorias por período');

  assert.equal(typeof reportsService.getExpenseByCategory, 'function');
});

test('AC-101: Gráfico de Pizza ou Rosca @spec:AC-101', () => {
  const chartSource = readSource('pages/Reports/CategoryChart.tsx');
  assert.ok(chartSource.includes('PieChart'), 'Deve renderizar PieChart do Recharts');
  assert.ok(chartSource.includes('innerRadius'), 'Deve configurar gráfico em estilo rosca');
  assert.ok(chartSource.includes('Cell'), 'Deve colorir fatias proporcionais das categorias');
});

// US-025 — Análise de Gastos por Contraparte
test('AC-102: Consolidação de Contrapartes via Frontend @spec:AC-102', () => {
  const mockTransactions = [
    {
      id: '1',
      counterparty_name: 'Supermercado Extra',
      value: '200.00',
      type: 'expenses',
    },
    {
      id: '2',
      counterparty_name: 'Supermercado Extra',
      value: '150.00',
      type: 'expenses',
    },
    {
      id: '3',
      counterparty_name: 'Empresa ABC',
      value: '5000.00',
      type: 'incomings',
    },
  ];

  const consolidated = consolidateCounterparties(mockTransactions);
  assert.equal(consolidated.length, 2);

  const extra = consolidated.find((c) => c.name === 'Supermercado Extra');
  assert.ok(extra);
  assert.equal(extra?.totalExpense, 350);
  assert.equal(extra?.transactionCount, 2);

  const empresa = consolidated.find((c) => c.name === 'Empresa ABC');
  assert.ok(empresa);
  assert.equal(empresa?.totalIncome, 5000);
});

test('AC-103: Tabela de Contrapartes @spec:AC-103', () => {
  const mockTransactions = [
    { id: '1', counterparty_name: 'Padaria', value: '50.00', type: 'expenses' },
    { id: '2', counterparty_name: 'Empresa ABC', value: '5000.00', type: 'incomings' },
  ];

  const consolidated = consolidateCounterparties(mockTransactions);
  // Ordenado pelo maior volume
  assert.equal(consolidated[0].name, 'Empresa ABC');
  assert.equal(consolidated[1].name, 'Padaria');
  assert.ok(consolidated[0].percentage > consolidated[1].percentage);

  const pageSource = readSource('pages/Reports/CounterpartyReport.tsx');
  assert.ok(pageSource.includes('cp.totalAmount'), 'Deve exibir volume total');
  assert.ok(pageSource.includes('percent'), 'Deve exibir percentual de participação');
});

test('AC-104: Diferenciação de Despesas e Receitas por Contraparte @spec:AC-104', () => {
  const pageSource = readSource('pages/Reports/CounterpartyReport.tsx');
  assert.ok(pageSource.includes('Receita (Pagador)'), 'Deve rotular e diferenciar contraparte pagadora');
  assert.ok(pageSource.includes('Despesa (Recebedor)'), 'Deve rotular e diferenciar contraparte recebedora');
  assert.ok(pageSource.includes('cp.totalIncome'), 'Deve exibir valor de receitas');
  assert.ok(pageSource.includes('cp.totalExpense'), 'Deve exibir valor de despesas');
});

test('AC-105: Navegação na Rota de Relatórios @spec:AC-105', () => {
  const navSource = readSource('pages/Reports/ReportsNavigation.tsx');
  assert.ok(navSource.includes('DRE (Anual)'), 'Deve possuir aba DRE (Anual)');
  assert.ok(navSource.includes('Despesas por Categoria'), 'Deve possuir aba Despesas por Categoria');
  assert.ok(navSource.includes('Relatório por Contraparte'), 'Deve possuir aba Relatório por Contraparte');

  const routesSource = readSource('routes/index.tsx');
  assert.ok(routesSource.includes('path="/reports"'), 'Deve registrar rota /reports');
  assert.ok(routesSource.includes('path="/relatorios"'), 'Deve registrar rota /relatorios');
});
