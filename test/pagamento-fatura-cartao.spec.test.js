// Testes de especificação da feature pagamento-fatura-cartao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-099 — Pagamento Completo de Fatura de Cartão de Crédito
test('AC-357: Botão Pagar Fatura com estados dinâmicos em InvoiceSummary @spec:AC-357', () => {
  const summarySource = readSource('components/credit-cards/InvoiceSummary.tsx');

  assert.ok(
    summarySource.includes('pay-invoice-button') || summarySource.includes('paid-invoice-badge'),
    'InvoiceSummary deve conter identificadores de teste para o botão de pagar fatura ou badge de fatura paga'
  );
  assert.ok(
    summarySource.includes('Pagar Fatura') && summarySource.includes('Fatura Paga'),
    'InvoiceSummary deve contemplar textos para pagar fatura pendente e status de fatura quitada'
  );
  assert.ok(
    summarySource.includes('PayInvoiceModal'),
    'InvoiceSummary deve renderizar e gerenciar abertura do PayInvoiceModal'
  );
});

// US-099 — Pagamento Completo de Fatura de Cartão de Crédito
test('AC-358: Modal de confirmação PayInvoiceModal com resumo e seletor de conta @spec:AC-358', () => {
  assert.ok(
    fs.existsSync(path.join(SRC_DIR, 'components/credit-cards/PayInvoiceModal.tsx')),
    'O arquivo PayInvoiceModal.tsx deve existir'
  );

  const modalSource = readSource('components/credit-cards/PayInvoiceModal.tsx');

  assert.ok(
    modalSource.includes('useBankAccounts'),
    'PayInvoiceModal deve buscar contas bancárias através de useBankAccounts'
  );
  assert.ok(
    modalSource.includes('bank_account_id'),
    'PayInvoiceModal deve gerenciar seleção do identificador da conta bancária de débito'
  );
  assert.ok(
    modalSource.includes('data-testid="pay-invoice-modal"'),
    'PayInvoiceModal deve possuir data-testid="pay-invoice-modal"'
  );
});

// US-099 — Pagamento Completo de Fatura de Cartão de Crédito
test('AC-359: Payload total_invoice, status completed e id de transação @spec:AC-359', () => {
  const modalSource = readSource('components/credit-cards/PayInvoiceModal.tsx');

  assert.ok(
    modalSource.includes('total_invoice: true'),
    'PayInvoiceModal deve enviar total_invoice: true na requisição de pagamento'
  );
  assert.ok(
    modalSource.includes("status: 'completed'"),
    'PayInvoiceModal deve enviar status: completed para liquidar a fatura'
  );
  assert.ok(
    modalSource.includes('updateMutation'),
    'PayInvoiceModal deve acionar updateMutation do useTransactionMutations'
  );
});

// US-099 — Pagamento Completo de Fatura de Cartão de Crédito
test('AC-360: Tratamento de erro de saldo insuficiente e feedback de sucesso @spec:AC-360', () => {
  const modalSource = readSource('components/credit-cards/PayInvoiceModal.tsx');

  assert.ok(
    modalSource.includes('Conta bancária sem saldo suficiente') || modalSource.includes('saldo insuficiente') || modalSource.includes('errorMessage'),
    'PayInvoiceModal deve prever tratamento e exibição de erro para saldo insuficiente'
  );
  assert.ok(
    modalSource.includes('isSubmitting') || modalSource.includes('isPending'),
    'PayInvoiceModal deve gerenciar estado de processamento/carregamento'
  );
});

// US-099 — Pagamento Completo de Fatura de Cartão de Crédito
test('AC-361: Header x-active-wallet-id no axios e tipagem total_invoice @spec:AC-361', () => {
  const axiosSource = readSource('lib/axios.ts');
  const typesSource = readSource('types/transaction.ts');

  assert.ok(
    axiosSource.includes("config.headers['x-active-wallet-id'] = activeWalletId;"),
    'axios.ts deve injetar o header x-active-wallet-id'
  );
  assert.ok(
    typesSource.includes('total_invoice?: boolean;'),
    'UpdateTransactionPayload deve tipar a propriedade total_invoice como booleano opcional'
  );
});
