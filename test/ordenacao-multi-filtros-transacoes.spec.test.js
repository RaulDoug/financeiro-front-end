// Testes de especificação da feature ordenacao-multi-filtros-transacoes — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-087 — Ordenação Interativa por Colunas da Tabela de Transações

test('AC-320: Cabeçalhos interativos e alternância de ordenação na tabela desktop @spec:AC-320', () => {
  const tableSource = readSource('components/transactions/TransactionTable.tsx');

  // TransactionTable deve aceitar orderBy, orderDir e onSort nas Props
  assert.ok(
    tableSource.includes('orderBy?: string;') &&
    tableSource.includes("orderDir?: 'ASC' | 'DESC';") &&
    tableSource.includes('onSort?: (column: string) => void;'),
    'TransactionTable deve declarar orderBy, orderDir e onSort em suas Props'
  );

  // Deve haver função auxiliar para renderizar cabeçalhos ordenáveis
  assert.ok(
    tableSource.includes('renderSortableHeader'),
    'TransactionTable deve conter a função auxiliar renderSortableHeader'
  );

  // Deve possuir data-testid para ordenação das colunas
  assert.ok(
    tableSource.includes('data-testid={`sort-header-${column}`}'),
    'TransactionTable deve renderizar botões de ordenação com data-testid sort-header-{column}'
  );

  // Deve renderizar indicadores visuais ArrowUp, ArrowDown e ArrowUpDown
  assert.ok(
    tableSource.includes('ArrowUp') &&
    tableSource.includes('ArrowDown') &&
    tableSource.includes('ArrowUpDown'),
    'TransactionTable deve renderizar ícones direcionais de ordenação'
  );

  // Colunas ordenáveis principais devem ser passadas para renderSortableHeader
  const expectedColumns = [
    'description',
    'purchase_date',
    'due_date',
    'payment_date',
    'bank_account_name',
    'value',
    'status',
  ];
  for (const col of expectedColumns) {
    assert.ok(
      tableSource.includes(`renderSortableHeader('${col}'`),
      `TransactionTable deve configurar a coluna ${col} como ordenável`
    );
  }
});

test('AC-321: Preservação e sincronização da ordenação na barra de filtros @spec:AC-321', () => {
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');
  const pageSource = readSource('pages/Transactions/index.tsx');

  // TransactionFilters deve ler e preservar a ordenação ativa
  assert.ok(
    filtersSource.includes("filters.order_by || 'due_date'") &&
    filtersSource.includes("filters.order_dir || 'DESC'"),
    'TransactionFilters deve inicializar referências de ordenação ativa'
  );

  // Manipuladores de filtro não devem forçar 'due_date' estático
  assert.ok(
    filtersSource.includes('order_by: currentOrderBy, order_dir: currentOrderDir') ||
    filtersSource.includes('order_by: currentOrderBy'),
    'Ações de filtro devem preservar a coluna e direção de ordenação atuais'
  );

  // Botão de ordenação nos filtros deve refletir a coluna ativa dinamicamente
  assert.ok(
    filtersSource.includes('currentOrderLabel'),
    'TransactionFilters deve exibir o nome da coluna ativa no botão de ordenação'
  );

  // TransactionsPage deve implementar handleSort e alternância ASC/DESC
  assert.ok(
    pageSource.includes('handleSort') &&
    pageSource.includes('onSort={handleSort}'),
    'TransactionsPage deve prover a função handleSort para o TransactionTable'
  );
  assert.ok(
    pageSource.includes("order_dir: nextDir") || pageSource.includes("order_dir === 'ASC' ? 'DESC' : 'ASC'"),
    'handleSort deve inverter direção na mesma coluna'
  );
});

// US-088 — Filtro com Seleção Múltipla de Categorias e Entidades

test('AC-322: Interface de multi-seleção de categorias com contagem e chips @spec:AC-322', () => {
  const multiSelectSource = readSource('components/common/MultiSelect.tsx');
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');

  // Componente MultiSelect deve existir e suportar seleção de múltiplos itens
  assert.ok(
    multiSelectSource.includes('export const MultiSelect: React.FC<MultiSelectProps>'),
    'Componente MultiSelect deve ser exportado'
  );
  assert.ok(
    multiSelectSource.includes('selectedValues: string[]') &&
    multiSelectSource.includes('onChange: (values: string[]) => void'),
    'MultiSelect deve trabalhar com array de valores'
  );

  // MultiSelect deve conter suporte a chips de remoção e contagem
  assert.ok(
    multiSelectSource.includes('selectedValues.length > 1'),
    'MultiSelect deve exibir contador de itens selecionados'
  );
  assert.ok(
    multiSelectSource.includes('handleToggle') && multiSelectSource.includes('handleSelectAll'),
    'MultiSelect deve possuir alternância de itens e seleção em massa'
  );

  // TransactionAdvancedFiltersModal deve usar MultiSelect para categorias com testId
  assert.ok(
    modalSource.includes('<MultiSelect') &&
    modalSource.includes('testId="filter-category-select"'),
    'Modal deve usar MultiSelect no campo de categoria com testId filter-category-select'
  );
  assert.ok(
    modalSource.includes('testId="filter-pay-method-select"') &&
    modalSource.includes('testId="filter-bank-account-select"'),
    'Modal deve estender MultiSelect também para métodos de pagamento e contas'
  );
});

test('AC-323: Consulta e filtragem na API com múltiplos identificadores @spec:AC-323', () => {
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');
  const serviceSource = readSource('services/transactionService.ts');
  const pageSource = readSource('pages/Transactions/index.tsx');

  // Modal deve enviar array de IDs no onApply
  assert.ok(
    modalSource.includes('category_id: selectedCategories.length > 0 ? selectedCategories : undefined'),
    'onApply deve enviar array com as categorias selecionadas'
  );

  // transactionService deve anexar múltiplos valores de array como query params repetidos
  assert.ok(
    serviceSource.includes('Array.isArray(value)') &&
    serviceSource.includes('params.append(key, String(v))'),
    'transactionService deve anexar arrays como parâmetros de query string'
  );

  // TransactionsPage deve repassar category_id para a query de transações vencidas
  assert.ok(
    pageSource.includes('category_id: filters.category_id'),
    'TransactionsPage deve filtrar também transações vencidas anteriores pelas categorias selecionadas'
  );
});

test('AC-324: Limpeza e restauração completa dos filtros múltiplos @spec:AC-324', () => {
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');

  // handleClear no modal deve resetar os arrays de seleção
  assert.ok(
    modalSource.includes('setSelectedCategories([])') &&
    modalSource.includes('setSelectedPayMethods([])') &&
    modalSource.includes('setSelectedBankAccounts([])'),
    'Modal deve limpar os arrays de categorias, métodos e contas ao limpar filtros'
  );

  // TransactionFilters deve checar arrays em activeAdvancedCount e hasActiveFilters
  assert.ok(
    filtersSource.includes('hasCategoryFilter') &&
    filtersSource.includes('Array.isArray(filters.category_id)'),
    'TransactionFilters deve verificar arrays em hasCategoryFilter e contadores de filtros ativos'
  );
});
