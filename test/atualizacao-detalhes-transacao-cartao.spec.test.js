// Testes de especificação da feature atualizacao-detalhes-transacao-cartao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
test('AC-352: Invalidação e Refetch Imediato de transaction-detail, credit-card-summary e credit-cards @spec:AC-352', () => {
  const mutationsSource = readSource('hooks/useTransactionMutations.ts');

  assert.ok(
    mutationsSource.includes("queryClient.invalidateQueries({ queryKey: ['transaction-detail'] })"),
    'useTransactionMutations deve invalidar a queryKey transaction-detail'
  );
  assert.ok(
    mutationsSource.includes("queryClient.refetchQueries({ queryKey: ['credit-card-summary'], type: 'active' })"),
    'useTransactionMutations deve refetchar ativamente credit-card-summary'
  );
  assert.ok(
    mutationsSource.includes("queryClient.refetchQueries({ queryKey: ['credit-cards'], type: 'active' })"),
    'useTransactionMutations deve refetchar ativamente credit-cards'
  );
});

// US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
test('AC-353: Atualização instantânea e remoção de cache obsoleto (staleTime: 0) no TransactionDetailsModal @spec:AC-353', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  assert.ok(
    modalSource.includes("queryKey: ['transaction-detail', rawTransaction?.id]") &&
    modalSource.includes('staleTime: 0'),
    'TransactionDetailsModal deve configurar staleTime: 0 para obter dados frescos na abertura'
  );
  assert.ok(
    modalSource.includes('useQueryClient'),
    'TransactionDetailsModal deve importar e utilizar useQueryClient para gestão reativa de cache'
  );
});

// US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
test('AC-354: Mapeamento completo de campos transacionais e dados atualizados em TransactionList @spec:AC-354', () => {
  const listSource = readSource('components/credit-cards/TransactionList.tsx');
  const typesSource = readSource('types/creditCard.ts');

  assert.ok(
    typesSource.includes('payment_date?: string | null;') &&
    typesSource.includes('bank_account_id?: string | null;'),
    'CreditCardTransaction deve declarar payment_date e bank_account_id como campos opcionais'
  );

  assert.ok(
    listSource.includes('payment_date: tx.payment_date || (isCompleted ? tx.due_date : null)'),
    'TransactionList deve mapear payment_date da transação preservando o status de pagamento'
  );
  assert.ok(
    listSource.includes('bank_account_id: tx.bank_account_id || null') &&
    listSource.includes('pay_methods_id: tx.pay_methods_id || null'),
    'TransactionList deve mapear bank_account_id e pay_methods_id'
  );
  assert.ok(
    listSource.includes('data-testid={`tx-status-${tx.id}`}') ||
    listSource.includes('data-testid="tx-status-'),
    'TransactionList deve renderizar badge visual para transações concluídas'
  );
});

// US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
test('AC-355: Otimização de atualização local e reconciliação após pagamento no TransactionDetailsModal @spec:AC-355', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  assert.ok(
    modalSource.includes("queryClient.setQueryData(['transaction-detail', transaction.id]"),
    'handleConfirmPayment deve atualizar imediatamente o cache da transação'
  );
  assert.ok(
    modalSource.includes("queryClient.invalidateQueries({ queryKey: ['transaction-detail', transaction.id] })"),
    'handleConfirmPayment deve invalidar a chave de detalhe da transação para reconciliação'
  );
  assert.ok(
    modalSource.includes("queryClient.invalidateQueries({ queryKey: ['credit-card-summary'] })"),
    'handleConfirmPayment deve invalidar queries de resumo da fatura de cartão'
  );
});

// US-098 — Atualização Imediata e Reconciliação de Detalhes de Transação na Fatura de Cartão
test('AC-356: Rastreabilidade e conformidade da metodologia onp-spec-driven para a US-098 @spec:AC-356', () => {
  const specDir = path.resolve('.spec/features/atualizacao-detalhes-transacao-cartao');
  const specContent = fs.readFileSync(path.join(specDir, 'spec.md'), 'utf8');
  const tasksContent = fs.readFileSync(path.join(specDir, 'tasks.md'), 'utf8');

  assert.ok(specContent.includes('US-098'), 'spec.md deve referenciar US-098');
  assert.ok(specContent.includes('AC-352'), 'spec.md deve conter AC-352');
  assert.ok(specContent.includes('AC-353'), 'spec.md deve conter AC-353');
  assert.ok(specContent.includes('AC-354'), 'spec.md deve conter AC-354');
  assert.ok(specContent.includes('AC-355'), 'spec.md deve conter AC-355');
  assert.ok(specContent.includes('AC-356'), 'spec.md deve conter AC-356');

  assert.ok(tasksContent.includes('T-231'), 'tasks.md deve conter T-231');
  assert.ok(tasksContent.includes('T-232'), 'tasks.md deve conter T-232');
  assert.ok(tasksContent.includes('T-233'), 'tasks.md deve conter T-233');
  assert.ok(tasksContent.includes('T-234'), 'tasks.md deve conter T-234');
});
