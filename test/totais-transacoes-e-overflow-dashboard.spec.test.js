// Testes de spec das features totais-transacoes e overflow-dashboard — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-083 — Totalizadores Dinâmicos de Entradas e Saídas em Transações

test('AC-300: Tipagem e consumo de totals na listagem de transações com fallback defensivo @spec:AC-300', () => {
  const typesSource = readSource('types/transaction.ts');
  const pageSource = readSource('pages/Transactions/index.tsx');

  // TransactionListResponse deve conter definição de totals opcional
  assert.ok(
    typesSource.includes('totals?:') &&
    typesSource.includes('incomings: number') &&
    typesSource.includes('expenses: number'),
    'types/transaction.ts deve conter tipagem de totals com incomings e expenses'
  );

  // TransactionsPage deve extrair totals do backend e prover fallback em allTransactions
  assert.ok(
    pageSource.includes('totals') || pageSource.includes('incomingsTotal'),
    'TransactionsPage deve extrair totais do backend ou calcular totais'
  );
  assert.ok(
    pageSource.includes('TransactionSummaryCards'),
    'TransactionsPage deve renderizar o componente TransactionSummaryCards'
  );
});

test('AC-301: Layout responsivo dos cards de totalizadores no Desktop e Mobile @spec:AC-301', () => {
  const cardsSource = readSource('components/transactions/TransactionSummaryCards.tsx');

  // Estrutura com data-testids exigidos
  assert.ok(
    cardsSource.includes('data-testid="transactions-summary-cards"'),
    'Deve conter contêiner com data-testid="transactions-summary-cards"'
  );
  assert.ok(
    cardsSource.includes('data-testid="card-total-incomings"'),
    'Deve conter card com data-testid="card-total-incomings"'
  );
  assert.ok(
    cardsSource.includes('data-testid="card-total-expenses"'),
    'Deve conter card com data-testid="card-total-expenses"'
  );

  // Responsividade e semântica de cores
  assert.ok(
    cardsSource.includes('grid grid-cols-2') || cardsSource.includes('grid-cols-1 sm:grid-cols-2'),
    'Cards devem utilizar grid responsivo para mobile e desktop'
  );
  assert.ok(
    cardsSource.includes('emerald') || cardsSource.includes('green'),
    'Card de entradas deve utilizar cores semânticas positivas (verde/emerald)'
  );
  assert.ok(
    cardsSource.includes('rose') || cardsSource.includes('red'),
    'Card de saídas deve utilizar cores semânticas negativas (vermelho/rose)'
  );
  assert.ok(
    cardsSource.includes('formatCurrency'),
    'Cards devem formatar os valores utilizando formatCurrency'
  );
});

// US-084 — Contenção e Responsividade das Categorias na Dashboard

test('AC-302: Contenção de layout e substituição do Legend por HTML customizado @spec:AC-302', () => {
  const chartSource = readSource('pages/Dashboard/components/CategoryExpenseChart.tsx');

  // Não deve conter o <Legend height={36} /> rígido do Recharts que causava overflow
  assert.ok(
    !chartSource.includes('<Legend') || !chartSource.includes('height={36}'),
    'CategoryExpenseChart não deve utilizar <Legend height={36} /> rígido'
  );

  // Deve possuir legenda customizada com data-testid e contenção
  assert.ok(
    chartSource.includes('data-testid="category-custom-legend"'),
    'CategoryExpenseChart deve renderizar legenda customizada com data-testid="category-custom-legend"'
  );

  // Deve aplicar truncate para impedir overflow de nomes longos
  assert.ok(
    chartSource.includes('truncate'),
    'Itens da legenda devem aplicar truncate para evitar transbordamento de texto'
  );
});

test('AC-303: Acessibilidade com title e sincronização de cores das categorias @spec:AC-303', () => {
  const chartSource = readSource('pages/Dashboard/components/CategoryExpenseChart.tsx');

  // Deve atribuir title com o nome completo da categoria para leitura acessível no hover/touch
  assert.ok(
    chartSource.includes('title={') || chartSource.includes('title ='),
    'Itens de categoria devem conter atributo title para leitura completa'
  );

  // Deve sincronizar as cores das fatias com a legenda
  assert.ok(
    chartSource.includes('COLORS[index % COLORS.length]'),
    'Legenda deve sincronizar cores com as fatias do gráfico usando o mesmo array COLORS'
  );
});

