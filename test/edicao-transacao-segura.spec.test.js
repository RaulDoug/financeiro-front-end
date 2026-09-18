// Testes de spec da feature edicao-transacao-segura — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { buildUpdateTransactionDiff } from '../src/utils/transactionDiff.ts';

const SRC_DIR = path.resolve('src');
const SPEC_DIR = path.resolve('.spec/features/edicao-transacao-segura');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-079 — Edição Segura e Confiável de Transações (Resolução do Erro 500)
test('AC-284: Mapeamento direto de IDs de FKs e bloqueio de auto-seleção cega na edição @spec:AC-284', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // 1. Inicialização direta de estado a partir de initialData
  assert.ok(
    formSource.includes('useState(initialData?.bank_account_id || \'\')'),
    'bankAccountId deve ser inicializado diretamente com initialData.bank_account_id'
  );
  assert.ok(
    formSource.includes('initialData?.pay_methods_id'),
    'payMethodId deve ser inicializado com initialData.pay_methods_id'
  );
  assert.ok(
    formSource.includes('useState(initialData?.category_id || \'\')'),
    'categoryId deve ser inicializado diretamente com initialData.category_id'
  );
  assert.ok(
    formSource.includes('useState(initialData?.counterparty_id || \'\')'),
    'counterpartyId deve ser inicializado diretamente com initialData.counterparty_id'
  );

  // 2. Auto-seleção do primeiro item deve ser restrita a novas transações (!initialData)
  assert.ok(
    formSource.includes('!initialData && !bankAccountId && accountsData.length > 0'),
    'Auto-seleção de conta bancária deve exigir !initialData'
  );
  assert.ok(
    formSource.includes('!initialData && !payMethodId && payMethodsData.length > 0'),
    'Auto-seleção de forma de pagamento deve exigir !initialData'
  );
  assert.ok(
    formSource.includes('!initialData && !counterpartyId && counterpartiesData.length > 0'),
    'Auto-seleção de contraparte deve exigir !initialData'
  );
});

test('AC-285: Proteção contra sobrescrita indevida de categoria no CategorySelect @spec:AC-285', () => {
  const selectSource = readSource('components/transactions/CategorySelect.tsx');
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // CategorySelect deve declarar prop isEditing
  assert.ok(
    selectSource.includes('isEditing?: boolean'),
    'CategorySelect deve declarar prop opcional isEditing'
  );

  // CategorySelect não deve auto-selecionar quando isEditing for true
  assert.ok(
    selectSource.includes('!isEditing && !value && filteredCategories.length > 0'),
    'CategorySelect só pode auto-selecionar primeira categoria quando !isEditing'
  );

  // TransactionFormBase deve repassar isEditing={Boolean(initialData)}
  assert.ok(
    formSource.includes('isEditing={Boolean(initialData)}'),
    'TransactionFormBase deve informar isEditing={Boolean(initialData)} ao CategorySelect'
  );
});

test('AC-286: buildUpdateTransactionDiff calcula estritamente as propriedades alteradas @spec:AC-286', () => {
  const mockInitialTx = {
    id: 'tx-123',
    description: 'Mercado Mensal',
    value: '150.00',
    type: 'expenses',
    status: 'pending',
    due_date: '2026-09-20T00:00:00.000Z',
    payment_date: null,
    purchase_date: null,
    bank_account_id: 'acc-uuid-1',
    bank_account_name: 'Banco Nubank',
    category_id: 'cat-uuid-1',
    category_name: 'Alimentação',
    pay_methods_id: 'pm-uuid-1',
    pay_method_name: 'Cartão de Débito',
    counterparty_id: 'cp-uuid-1',
    counterparty_name: 'Supermercado',
    creator_user_name: 'Raul',
    created_at: '2026-09-01T00:00:00.000Z',
    transfers_id: null,
    invoice_id: null,
    current_installment: null,
  };

  const context = {
    accountsData: [{ id: 'acc-uuid-1', bank_name: 'Banco Nubank' }],
    payMethodsData: [{ id: 'pm-uuid-1', name: 'Cartão de Débito', credit_card: false }],
    allCategoriesData: [{ id: 'cat-uuid-1', name: 'Alimentação', type: 'expenses' }],
    counterpartiesData: [{ id: 'cp-uuid-1', name: 'Supermercado', type: 'payee' }],
  };

  // 1. Sem alterações -> diff vazio {}
  const emptyDiff = buildUpdateTransactionDiff(mockInitialTx, {
    description: 'Mercado Mensal',
    value: 150,
    status: 'pending',
    due_date: '2026-09-20',
    bank_account_id: 'acc-uuid-1',
    pay_methods_id: 'pm-uuid-1',
    category_id: 'cat-uuid-1',
    counterparty_id: 'cp-uuid-1',
    type: 'expenses',
  }, context);
  assert.deepEqual(emptyDiff, {}, 'Sem mudanças deve retornar diff vazio');

  // 2. Apenas alteração de descrição
  const descDiff = buildUpdateTransactionDiff(mockInitialTx, {
    description: 'Mercado Semanal',
    value: 150,
    status: 'pending',
    due_date: '2026-09-20',
    bank_account_id: 'acc-uuid-1',
    pay_methods_id: 'pm-uuid-1',
    category_id: 'cat-uuid-1',
    counterparty_id: 'cp-uuid-1',
    type: 'expenses',
  }, context);
  assert.deepEqual(descDiff, { description: 'Mercado Semanal' }, 'Deve conter apenas descrição alterada');

  // 3. Apenas alteração de valor
  const valDiff = buildUpdateTransactionDiff(mockInitialTx, {
    description: 'Mercado Mensal',
    value: 180.50,
    status: 'pending',
    due_date: '2026-09-20',
    bank_account_id: 'acc-uuid-1',
    pay_methods_id: 'pm-uuid-1',
    category_id: 'cat-uuid-1',
    counterparty_id: 'cp-uuid-1',
    type: 'expenses',
  }, context);
  assert.deepEqual(valDiff, { value: 180.50 }, 'Deve conter apenas valor alterado');

  // 4. Apenas alteração de conta bancária
  const accDiff = buildUpdateTransactionDiff(mockInitialTx, {
    description: 'Mercado Mensal',
    value: 150,
    status: 'pending',
    due_date: '2026-09-20',
    bank_account_id: 'acc-uuid-2',
    pay_methods_id: 'pm-uuid-1',
    category_id: 'cat-uuid-1',
    counterparty_id: 'cp-uuid-1',
    type: 'expenses',
  }, context);
  assert.deepEqual(accDiff, { bank_account_id: 'acc-uuid-2' }, 'Deve conter apenas bank_account_id alterado');

  // 5. Baixa de pagamento (status completed + payment_date)
  const payDiff = buildUpdateTransactionDiff(mockInitialTx, {
    description: 'Mercado Mensal',
    value: 150,
    status: 'completed',
    due_date: '2026-09-20',
    payment_date: '2026-09-18',
    bank_account_id: 'acc-uuid-1',
    pay_methods_id: 'pm-uuid-1',
    category_id: 'cat-uuid-1',
    counterparty_id: 'cp-uuid-1',
    type: 'expenses',
  }, context);
  assert.deepEqual(payDiff, { status: 'completed', payment_date: '2026-09-18' }, 'Deve enviar apenas status e payment_date');
});

test('AC-287: Tratamento amigável de erro HTTP 500 no TransactionModal @spec:AC-287', () => {
  const modalSource = readSource('components/transactions/TransactionModal.tsx');

  assert.ok(
    modalSource.includes('err?.response?.status === 500'),
    'TransactionModal deve verificar expressamente status 500'
  );
  assert.ok(
    modalSource.includes('Não foi possível atualizar a transação devido a um erro no servidor. Tente novamente.'),
    'TransactionModal deve exibir mensagem amigável no banner em falha 500'
  );
});

test('AC-288: Conformidade da especificação e rastreabilidade onp-spec-driven @spec:AC-288', () => {
  const specMd = fs.readFileSync(path.join(SPEC_DIR, 'spec.md'), 'utf8');
  const tasksMd = fs.readFileSync(path.join(SPEC_DIR, 'tasks.md'), 'utf8');

  assert.ok(specMd.includes('US-079'), 'spec.md deve conter US-079');
  assert.ok(specMd.includes('AC-284'), 'spec.md deve conter AC-284');
  assert.ok(specMd.includes('AC-285'), 'spec.md deve conter AC-285');
  assert.ok(specMd.includes('AC-286'), 'spec.md deve conter AC-286');
  assert.ok(specMd.includes('AC-287'), 'spec.md deve conter AC-287');
  assert.ok(specMd.includes('AC-288'), 'spec.md deve conter AC-288');

  assert.ok(tasksMd.includes('T-187'), 'tasks.md deve conter T-187');
  assert.ok(tasksMd.includes('T-188'), 'tasks.md deve conter T-188');
  assert.ok(tasksMd.includes('T-189'), 'tasks.md deve conter T-189');
  assert.ok(tasksMd.includes('T-190'), 'tasks.md deve conter T-190');
});
