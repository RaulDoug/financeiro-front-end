// Testes de spec da feature toggle-transacoes-recentes-dashboard — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-095 — Alternância e Filtragem de Transações Recentes por Mês no Dashboard

test('AC-338: Visualização padrão filtrada pelo mês atual/selecionado @spec:AC-338', () => {
  const storeSource = readSource('stores/filter.store.ts');
  const hookSource = readSource('hooks/useDashboardData.ts');

  // filter.store deve ter recentTransactionsMode com padrão 'month'
  assert.ok(
    storeSource.includes("recentTransactionsMode: 'month'"),
    'filter.store deve inicializar recentTransactionsMode com padrão "month"'
  );

  // useDashboardData deve suportar mode e buscar via transactionService.getTransactions com due_date_from e due_date_to
  assert.ok(
    hookSource.includes("mode = 'month'") || hookSource.includes("mode: 'month'"),
    'useRecentTransactions deve adotar "month" como modo padrão'
  );
  assert.ok(
    hookSource.includes('transactionService.getTransactions'),
    'useRecentTransactions deve consultar transactionService.getTransactions no modo mês'
  );
  assert.ok(
    hookSource.includes('due_date_from: startDate') && hookSource.includes('due_date_to: endDate'),
    'useRecentTransactions deve delimitar busca com due_date_from e due_date_to no modo mês'
  );
  assert.ok(
    hookSource.includes("order_by: 'due_date'") && hookSource.includes("order_dir: 'DESC'"),
    'useRecentTransactions deve ordenar por due_date decrescente no modo mês'
  );
  assert.ok(
    hookSource.includes('Math.max(20, limit)') && hookSource.includes('.slice(0, limit)'),
    'useRecentTransactions deve enviar limit mínimo de 20 para respeitar o schema da API e fatiar com slice(0, limit)'
  );
});

test('AC-339: Botão toggle com estados "Mês atual" e "Geral" @spec:AC-339', () => {
  const compSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');

  // Deve possuir o container do grupo de alternância com data-testid="recent-tx-toggle-group"
  assert.ok(
    compSource.includes('data-testid="recent-tx-toggle-group"'),
    'RecentTransactions deve renderizar container com data-testid="recent-tx-toggle-group"'
  );

  // Deve possuir botão Mês atual com data-testid="toggle-recent-month"
  assert.ok(
    compSource.includes('data-testid="toggle-recent-month"'),
    'RecentTransactions deve renderizar botão com data-testid="toggle-recent-month"'
  );
  assert.ok(
    compSource.includes('Mês atual'),
    'Botão de modo mensal deve exibir o rótulo "Mês atual"'
  );

  // Deve possuir botão Geral com data-testid="toggle-recent-all"
  assert.ok(
    compSource.includes('data-testid="toggle-recent-all"'),
    'RecentTransactions deve renderizar botão com data-testid="toggle-recent-all"'
  );
  assert.ok(
    compSource.includes('Geral'),
    'Botão de modo geral deve exibir o rótulo "Geral"'
  );

  // Deve acionar onModeChange ao clicar
  assert.ok(
    compSource.includes("onModeChange?.('month')") && compSource.includes("onModeChange?.('all')"),
    'Botões devem acionar onModeChange com os modos correspondentes'
  );
});

test('AC-340: Modo "Geral" preservando histórico amplo da carteira @spec:AC-340', () => {
  const hookSource = readSource('hooks/useDashboardData.ts');

  // No modo geral / fallback deve consultar dashboardService.getRecentTransactions
  assert.ok(
    hookSource.includes('dashboardService.getRecentTransactions(limit)'),
    'useRecentTransactions deve invocar dashboardService.getRecentTransactions quando em modo geral'
  );

  // Chave de cache deve contemplar opções de modo e datas para isolamento reativo
  assert.ok(
    hookSource.includes("recentTransactions: (") && hookSource.includes("['dashboard', walletId, 'recent-transactions', limit"),
    'DASHBOARD_QUERY_KEYS.recentTransactions deve indexar opções de modo e parâmetros'
  );
});

test('AC-341: Navegação contextual em "Ver todas" e persistência da preferência @spec:AC-341', () => {
  const compSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');
  const pageSource = readSource('pages/Dashboard/DashboardPage.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // Link contextual com data-testid="link-view-all-transactions"
  assert.ok(
    compSource.includes('data-testid="link-view-all-transactions"'),
    'RecentTransactions deve possuir link com data-testid="link-view-all-transactions"'
  );
  assert.ok(
    compSource.includes('due_date_from=${dateParams.startDate}') && compSource.includes('due_date_to=${dateParams.endDate}'),
    'Link Ver todas deve passar datas de início e fim no modo mês'
  );

  // Persistência em store
  assert.ok(
    storeSource.includes('setRecentTransactionsMode:'),
    'filter.store deve expor action setRecentTransactionsMode'
  );

  // DashboardPage integra store e repassa parâmetros
  assert.ok(
    pageSource.includes('recentTransactionsMode') && pageSource.includes('setRecentTransactionsMode'),
    'DashboardPage deve consumir e repassar recentTransactionsMode e setRecentTransactionsMode'
  );
  assert.ok(
    pageSource.includes('dateParams={dateParams}'),
    'DashboardPage deve repassar dateParams para o componente RecentTransactions'
  );
});
