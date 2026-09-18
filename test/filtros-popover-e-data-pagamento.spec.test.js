// Testes de spec da feature filtros-popover-e-data-pagamento — metodologia opn-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-048 — Filtros Avançados Responsivos (Popover no Desktop & Modal Tela Cheia no Mobile)

test('AC-288: Em desktop (>= 768px), Filtros é renderizado como popover ancorado sem backdrop fullscreen @spec:AC-288', () => {
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');

  // TransactionFilters deve envolver o botão e o popover em um container relativo com ref
  assert.ok(
    filtersSource.includes('ref={advancedFiltersContainerRef}'),
    'TransactionFilters deve possuir container relativo ancorado com ref para o popover'
  );
  assert.ok(
    filtersSource.includes('containerRef={advancedFiltersContainerRef}'),
    'TransactionFilters deve repassar containerRef para TransactionAdvancedFiltersModal'
  );

  // TransactionAdvancedFiltersModal deve renderizar popover no desktop
  assert.ok(
    modalSource.includes('data-testid="advanced-filters-popover"'),
    'TransactionAdvancedFiltersModal deve conter data-testid="advanced-filters-popover"'
  );
  assert.ok(
    modalSource.includes('absolute right-0 top-full mt-2'),
    'Popover desktop deve estar posicionado logo abaixo do botão (absolute right-0 top-full mt-2)'
  );
  assert.ok(
    modalSource.includes('handleClickOutside') && modalSource.includes('Escape'),
    'Popover desktop deve possuir manipulador de clique fora e tecla Escape'
  );
});

test('AC-289: Em mobile (< 768px), Filtros abre como modal via Portal cobrindo 100% da tela @spec:AC-289', () => {
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');

  assert.ok(
    modalSource.includes('createPortal') && modalSource.includes('document.body'),
    'Modal mobile deve ser renderizado via createPortal anexado a document.body'
  );
  assert.ok(
    modalSource.includes('data-testid="advanced-filters-modal"'),
    'Modal mobile deve conter data-testid="advanced-filters-modal"'
  );
  assert.ok(
    modalSource.includes('fixed inset-0') && modalSource.includes('backdrop-blur-xs'),
    'Modal mobile deve conter fixed inset-0 e backdrop-blur-xs para cobrir toda a viewport'
  );
  assert.ok(
    modalSource.includes('isMobile') || modalSource.includes('innerWidth < 768'),
    'Componente deve detectar breakpoint mobile (< 768px)'
  );
});

test('AC-290: Preservação de todos os seletores de filtros e ações de aplicar/limpar @spec:AC-290', () => {
  const modalSource = readSource('components/transactions/TransactionAdvancedFiltersModal.tsx');

  assert.ok(
    modalSource.includes('data-testid="filter-category-select"'),
    'Deve conter seletor de categorias'
  );
  assert.ok(
    modalSource.includes('data-testid="filter-pay-method-select"'),
    'Deve conter seletor de métodos de pagamento'
  );
  assert.ok(
    modalSource.includes('data-testid="filter-bank-account-select"'),
    'Deve conter seletor de contas bancárias'
  );
  assert.ok(
    modalSource.includes('data-testid="filter-status-select"'),
    'Deve conter seletor de status'
  );
  assert.ok(
    modalSource.includes('data-testid="filter-type-select"'),
    'Deve conter seletor de tipo de movimentação'
  );
  assert.ok(
    modalSource.includes('data-testid="btn-apply-advanced-filters"'),
    'Deve conter botão de aplicar filtros'
  );
});

// US-049 — Seleção e Edição da Data de Pagamento no Layout Desktop

test('AC-291: Disponibilização do campo de seleção de Data de Pagamento em TransactionFormBase @spec:AC-291', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  assert.ok(
    formSource.includes('data-testid="input-payment-date"'),
    'TransactionFormBase deve conter campo com data-testid="input-payment-date"'
  );
  assert.ok(
    formSource.includes('value={paymentDate}'),
    'Campo de data de pagamento deve estar vinculado ao estado paymentDate'
  );
});

test('AC-292: Sincronização entre status pago e data de pagamento @spec:AC-292', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Ao alterar a data de pagamento, marca como pago automaticamente
  assert.ok(
    formSource.includes('if (val) {') && formSource.includes('setIsPaid(true)'),
    'Ao selecionar data de pagamento deve marcar isPaid como true'
  );

  // Ao marcar o checkbox "Já está pago", preenche payment_date com hoje
  assert.ok(
    formSource.includes('setPaymentDate(todayStr)'),
    'Ao marcar como pago deve preencher data com hoje'
  );

  // Preservação do envio de payment_date no payload
  assert.ok(
    formSource.includes("payment_date: isPaid ? paymentDate || todayStr : undefined"),
    'Deve manter linha de envio de payment_date no payload'
  );
});

test('AC-293: Suporte à seleção de datas em formulário de transferências @spec:AC-293', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  assert.ok(
    formSource.includes('data-testid="input-transfer-due-date"'),
    'Formulário de transferência deve conter campo data-testid="input-transfer-due-date"'
  );
  assert.ok(
    formSource.includes('data-testid="input-transfer-payment-date"'),
    'Formulário de transferência deve conter campo data-testid="input-transfer-payment-date"'
  );
});

