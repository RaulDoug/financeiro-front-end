// Testes de especificação da feature persistencia-filtros-navegacao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-089 — Restauração do Filtro Padrão de Mês Atual ao Limpar Filtros em Transações

test('AC-325: Botão Limpar Filtros restaura mês atual e zera filtros secundários @spec:AC-325', () => {
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // TransactionFilters deve invocar getDefaultTransactionFilters no handleClear
  assert.ok(
    filtersSource.includes('getDefaultTransactionFilters()'),
    'TransactionFilters deve invocar getDefaultTransactionFilters para retornar aos padrões'
  );
  assert.ok(
    filtersSource.includes('const handleClear = () => {') &&
    filtersSource.includes('...defaults,'),
    'handleClear deve espalhar os valores padrão recuperando as datas do mês atual'
  );

  // filter.store.ts deve prover resetTransactionFilters e getDefaultMonthRange
  assert.ok(
    storeSource.includes('getDefaultMonthRange') &&
    storeSource.includes('due_date_from:') &&
    storeSource.includes('due_date_to:'),
    'filter.store.ts deve calcular o primeiro e último dia do mês corrente'
  );
  assert.ok(
    storeSource.includes('resetTransactionFilters: () =>'),
    'filter.store.ts deve implementar a ação resetTransactionFilters'
  );
});

test('AC-326: Visibilidade condicional do botão Limpar Filtros @spec:AC-326', () => {
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // hasActiveFilters deve comparar as datas ativas com o mês padrão
  assert.ok(
    filtersSource.includes('isDefaultDateRange') &&
    filtersSource.includes('!isDefaultDateRange'),
    'TransactionFilters deve verificar se as datas ativas diferem do mês padrão'
  );

  // Botão Limpar filtros só deve ser renderizado quando hasActiveFilters for true
  assert.ok(
    filtersSource.includes('{hasActiveFilters && (') &&
    filtersSource.includes('Limpar filtros'),
    'Botão Limpar filtros deve ser condicional a hasActiveFilters'
  );

  // filter.store.ts deve exportar isDefaultTransactionFilters
  assert.ok(
    storeSource.includes('isDefaultTransactionFilters = ('),
    'filter.store.ts deve exportar a função auxiliar isDefaultTransactionFilters'
  );
});

// US-090 — Persistência de Filtros e Pesquisa entre Navegação de Telas

test('AC-327: Armazenamento e restauração dos filtros e pesquisa de Transações @spec:AC-327', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // TransactionsPage deve se conectar ao useFilterStore
  assert.ok(
    pageSource.includes('useFilterStore') &&
    pageSource.includes('state.transactionFilters') &&
    pageSource.includes('state.setTransactionFilters'),
    'TransactionsPage deve ler e atualizar filtros através do useFilterStore'
  );

  // filter.store.ts deve utilizar persistência com chave finflow_filters
  assert.ok(
    storeSource.includes("name: 'finflow_filters'") &&
    storeSource.includes('createJSONStorage'),
    'filter.store.ts deve persistir os filtros no storage local com a chave finflow_filters'
  );
});

test('AC-328: Armazenamento e restauração do período selecionado no Dashboard @spec:AC-328', () => {
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // DashboardPage deve se conectar ao useFilterStore
  assert.ok(
    dashboardSource.includes('useFilterStore') &&
    dashboardSource.includes('state.dashboardDate') &&
    dashboardSource.includes('state.setDashboardDate'),
    'DashboardPage deve utilizar dashboardDate e setDashboardDate do useFilterStore'
  );

  // setSelectedDate deve sincronizar a data ISO com o store
  assert.ok(
    dashboardSource.includes('setDashboardDate(d.toISOString())'),
    'DashboardPage deve persistir a data em formato ISO no useFilterStore'
  );

  // filter.store.ts deve gerenciar dashboardDate
  assert.ok(
    storeSource.includes('dashboardDate: string;') &&
    storeSource.includes('setDashboardDate: (date: Date | string) => void;'),
    'filter.store.ts deve declarar dashboardDate e setDashboardDate no contrato do estado'
  );
});

test('AC-329: Precedência de query params na URL e redefinição ao trocar de carteira @spec:AC-329', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');
  const storeSource = readSource('stores/filter.store.ts');

  // Precedência de searchParams em TransactionsPage
  assert.ok(
    pageSource.includes("searchParams.get('status')") &&
    pageSource.includes('setFilters((prev) =>'),
    'TransactionsPage deve aplicar o status dos query params com precedência'
  );

  // Escuta de alteração de carteira ativa no filter.store
  assert.ok(
    storeSource.includes('subscribeToWalletChange') &&
    storeSource.includes('resetWalletSpecificFilters'),
    'filter.store.ts deve escutar troca de carteira e redefinir filtros específicos por ID'
  );
});
