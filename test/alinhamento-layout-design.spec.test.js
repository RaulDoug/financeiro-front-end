// Testes de spec da feature alinhamento-layout-design — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-055 — Dashboard Alinhado ao Design de Referência
test('AC-181: Layout geral do dashboard conforme referência @spec:AC-181', () => {
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');

  assert.ok(
    dashboardSource.includes('data-testid="dashboard-page"'),
    'DashboardPage deve renderizar container principal identificado'
  );
  assert.ok(
    dashboardSource.includes('<KpiCards') &&
    dashboardSource.includes('<IncomeExpenseChart') &&
    dashboardSource.includes('<CategoryExpenseChart') &&
    dashboardSource.includes('<RecentTransactions') &&
    dashboardSource.includes('<AccountBalances'),
    'DashboardPage deve conter todos os componentes estruturais do design de referência'
  );
  assert.ok(
    dashboardSource.includes('grid-cols-1 lg:grid-cols-3') &&
    dashboardSource.includes('data-testid="dashboard-month-selector"'),
    'DashboardPage deve usar grid responsivo e seletor de mês alinhado ao design'
  );
});

// US-055 — Dashboard Alinhado ao Design de Referência
test('AC-182: KPIs do dashboard com tamanho de fonte equilibrado @spec:AC-182', () => {
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');

  assert.ok(
    kpiSource.includes('data-testid="kpi-cards"'),
    'KpiCards deve conter container com data-testid="kpi-cards"'
  );
  assert.ok(
    kpiSource.includes('truncate block') &&
    kpiSource.includes('text-lg sm:text-xl lg:text-2xl font-bold tracking-tight'),
    'KpiCards deve utilizar tipografia proporcional com truncate block para não quebrar linha'
  );
});

// US-055 — Dashboard Alinhado ao Design de Referência
test('AC-183: Seção de saldos de contas alinhada à referência @spec:AC-183', () => {
  const accountBalancesSource = readSource('pages/Dashboard/components/AccountBalances.tsx');

  assert.ok(
    accountBalancesSource.includes('data-testid="account-balances"') &&
    accountBalancesSource.includes('Saldos por Conta'),
    'AccountBalances deve exibir o card de saldos por conta'
  );
  assert.ok(
    accountBalancesSource.includes('data-testid={`account-item-${acc.id}`}') &&
    accountBalancesSource.includes('formatCurrency(acc.balance)'),
    'AccountBalances deve listar as contas com valores formatados e indicador de cor'
  );
});

// US-056 — Relatório DRE Alinhado ao Design de Referência
test('AC-184: Layout da tela DRE conforme referência @spec:AC-184', () => {
  const annualReportSource = readSource('pages/Reports/AnnualReport.tsx');

  assert.ok(
    annualReportSource.includes('data-testid="annual-year-selector"'),
    'AnnualReport deve possuir seletor de ano interativo'
  );
  assert.ok(
    annualReportSource.includes('<AnnualChart') &&
    annualReportSource.includes('data-testid="dre-mobile-grid"'),
    'AnnualReport deve incluir gráfico comparativo e grid de meses responsivo'
  );
});

// US-056 — Relatório DRE Alinhado ao Design de Referência
test('AC-185: Tabela DRE com colunas e badges corretos @spec:AC-185', () => {
  const annualReportSource = readSource('pages/Reports/AnnualReport.tsx');

  assert.ok(
    annualReportSource.includes('Poupança:') &&
    annualReportSource.includes('Déficit:'),
    'AnnualReport deve exibir badges calculados de Poupança (verde) e Déficit (vermelho)'
  );
  assert.ok(
    annualReportSource.includes('Receitas') &&
    annualReportSource.includes('Despesas') &&
    annualReportSource.includes('Saldo Resultante'),
    'AnnualReport deve conter as colunas de receitas, despesas e saldo'
  );
});

// US-056 — Relatório DRE Alinhado ao Design de Referência
test('AC-186: Gráfico DRE com estilo alinhado à referência @spec:AC-186', () => {
  const chartSource = readSource('pages/Reports/AnnualChart.tsx');

  assert.ok(
    chartSource.includes('data-testid="annual-dre-chart"') &&
    chartSource.includes('BarChart'),
    'AnnualChart deve renderizar o gráfico de barras comparativo'
  );
  assert.ok(
    chartSource.includes('fill="#10b981"') &&
    chartSource.includes('fill="#f43f5e"'),
    'AnnualChart deve aplicar cores semânticas (verde para receitas e vermelho para despesas)'
  );
  assert.ok(
    chartSource.includes('data-testid="btn-chart-zoom-in"') &&
    chartSource.includes('data-testid="btn-chart-zoom-out"'),
    'AnnualChart deve incluir controles de zoom para acessibilidade de visualização'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-187: Tela de Transações (Web) alinhada à referência @spec:AC-187', () => {
  const transactionsPage = readSource('pages/Transactions/index.tsx');
  const tableSource = readSource('components/transactions/TransactionTable.tsx');

  assert.ok(
    transactionsPage.includes('TransactionFilters') &&
    transactionsPage.includes('TransactionTable'),
    'TransactionsPage deve dispor de filtros e tabela integrados'
  );
  assert.ok(
    tableSource.includes('hasNextPage') &&
    tableSource.includes('IntersectionObserver'),
    'TransactionTable deve suportar rolagem infinita e paginação moderna'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-188: Tela de Cartões de Crédito (Web) alinhada à referência @spec:AC-188', () => {
  const cardsPage = readSource('pages/CreditCardsPage.tsx');
  const cardVisual = readSource('components/credit-cards/CreditCardVisual.tsx');

  assert.ok(
    cardsPage.includes('data-testid="credit-cards-page"') &&
    cardsPage.includes('CreditCardVisual') &&
    cardsPage.includes('InvoiceSummary'),
    'CreditCardsPage deve dispor do layout com cards visuais e detalhamento de fatura'
  );
  assert.ok(
    cardVisual.includes('LimitBar') &&
    cardVisual.includes('last_four_digits'),
    'CreditCardVisual deve apresentar barra de limite e dados do cartão'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-189: Tela de Contas Bancárias (Web) alinhada à referência @spec:AC-189', () => {
  const accountsPage = readSource('pages/BankAccountsPage.tsx');
  const accountCard = readSource('components/bank-accounts/AccountCard.tsx');

  assert.ok(
    accountsPage.includes('data-testid="bank-accounts-page"') &&
    accountsPage.includes('AccountsTotalizer'),
    'BankAccountsPage deve exibir cabeçalho com totalizador geral de saldos'
  );
  assert.ok(
    accountCard.includes('formatCurrency(numericBalance)') &&
    accountCard.includes('bank-icon-'),
    'AccountCard deve exibir o ícone do banco e saldo atual'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-190: Tela de Categorias/Configurações (Web) alinhada à referência @spec:AC-190', () => {
  const categoriesSettings = readSource('pages/Settings/CategoriesSettings.tsx');

  assert.ok(
    categoriesSettings.includes('activeTab') &&
    categoriesSettings.includes('incomings') &&
    categoriesSettings.includes('expenses'),
    'CategoriesSettings deve possuir abas de filtro por tipo (Todas, Receitas, Despesas)'
  );
  assert.ok(
    categoriesSettings.includes('CategoryModal') &&
    categoriesSettings.includes('renderLucideIcon'),
    'CategoriesSettings deve exibir ícones das categorias e permitir criação/edição'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-191: Tela de Métodos de Pagamento (Web) alinhada à referência @spec:AC-191', () => {
  const payMethodsSettings = readSource('pages/Settings/PayMethodsSettings.tsx');

  assert.ok(
    payMethodsSettings.includes('credit-card-indicator') &&
    payMethodsSettings.includes('PayMethodModal'),
    'PayMethodsSettings deve exibir indicador visual de cartões de crédito e modal de edição'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-192: Tela de Contrapartes (Web) alinhada à referência @spec:AC-192', () => {
  const counterpartiesSettings = readSource('pages/Settings/CounterpartiesSettings.tsx');

  assert.ok(
    counterpartiesSettings.includes('activeTab') &&
    counterpartiesSettings.includes('payer') &&
    counterpartiesSettings.includes('payee'),
    'CounterpartiesSettings deve apresentar abas para Pagadores e Beneficiários'
  );
  assert.ok(
    counterpartiesSettings.includes('CounterpartyModal'),
    'CounterpartiesSettings deve permitir inclusão e alteração de contrapartes'
  );
});

// US-057 — Auditoria e Alinhamento Geral de Layouts
test('AC-193: Tela de Investimentos (Web) alinhada à referência @spec:AC-193', () => {
  const investmentsPage = readSource('pages/Investments/index.tsx');

  assert.ok(
    investmentsPage.includes('Investimentos') &&
    investmentsPage.includes('PendingFeaturesBanner') &&
    investmentsPage.includes('InvestmentList'),
    'InvestmentsPage deve apresentar título, banner informativo e listagem de ativos'
  );
});
