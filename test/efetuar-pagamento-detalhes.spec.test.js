// Testes de spec da feature efetuar-pagamento-detalhes — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-059 — Fluxo de Efetivação de Pagamento no Modal de Detalhes
test('AC-205: Visibilidade imediata do formulário de pagamento @spec:AC-205', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Ao ativar o formulário de pagamento, deve haver ref e disparo de scrollIntoView
  assert.ok(
    modalSource.includes('paymentFormRef') &&
    modalSource.includes('scrollIntoView'),
    'Deve utilizar ref e scrollIntoView para assegurar visibilidade imediata do formulário de pagamento'
  );
  assert.ok(
    modalSource.includes('data-testid="payment-mini-form"'),
    'Deve conter container do formulário com data-testid="payment-mini-form"'
  );
});

// US-059 — Fluxo de Efetivação de Pagamento no Modal de Detalhes
test('AC-206: Seletor de Conta Bancária @spec:AC-206', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve importar bankAccountService e exibir seletor payment-account-select
  assert.ok(
    modalSource.includes('bankAccountService'),
    'TransactionDetailsModal deve importar e utilizar bankAccountService'
  );
  assert.ok(
    modalSource.includes('data-testid="payment-account-select"'),
    'Deve existir o seletor de conta bancária com data-testid="payment-account-select"'
  );
  assert.ok(
    modalSource.includes('selectedBankAccountId'),
    'Deve manter estado de conta bancária selecionada'
  );
  assert.ok(
    modalSource.includes('acc.bank_name'),
    'Opção do seletor de conta bancária deve exibir a propriedade acc.bank_name'
  );
});

// US-059 — Fluxo de Efetivação de Pagamento no Modal de Detalhes
test('AC-207: Seletor de Forma de Pagamento @spec:AC-207', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve existir seletor payment-method-select e payMethodService
  assert.ok(
    modalSource.includes('payMethodService') &&
    modalSource.includes('data-testid="payment-method-select"'),
    'Deve existir seletor de método de pagamento com data-testid="payment-method-select"'
  );
  assert.ok(
    modalSource.includes('selectedPayMethodId'),
    'Deve manter estado de método de pagamento selecionado'
  );
});

// US-059 — Fluxo de Efetivação de Pagamento no Modal de Detalhes
test('AC-208: Sincronização de estado ao abrir transação @spec:AC-208', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve sincronizar estado via useEffect ao mudar a transação
  assert.ok(
    modalSource.includes('useEffect') &&
    modalSource.includes('transaction.bank_account_id'),
    'Deve sincronizar a conta da transação nos estados do modal'
  );
});

// US-059 — Fluxo de Efetivação de Pagamento no Modal de Detalhes
test('AC-209: Confirmação com payload completo e feedback @spec:AC-209', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // handleConfirmPayment deve enviar status completed, payment_date, bank_account_id e pay_methods_id
  assert.ok(
    modalSource.includes('bank_account_id') &&
    modalSource.includes('pay_methods_id'),
    'Payload de confirmação deve incluir bank_account_id e pay_methods_id'
  );
  assert.ok(
    modalSource.includes('data-testid="btn-confirm-payment"'),
    'Deve conter botão com data-testid="btn-confirm-payment"'
  );
});

