// Testes de spec da feature contagem-parcelas-cartao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { formatInstallment } from '../src/utils/formatInstallment.ts';

const SRC_DIR = path.resolve('src');
const SPEC_DIR = path.resolve('.spec/features/contagem-parcelas-cartao');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-081 — Exibição Fracionada de Parcelas de Cartão e Transações

test('AC-304: Helper formatInstallment formata frações X/Y com resiliência defensiva @spec:AC-304', () => {
  // 1. Formatação correta com número e total
  assert.equal(formatInstallment(1, 3), '1/3');
  assert.equal(formatInstallment(2, 3), '2/3');
  assert.equal(formatInstallment(3, 3), '3/3');
  assert.equal(formatInstallment('2', '10'), '2/10');

  // 2. Preservação de strings pré-formatadas
  assert.equal(formatInstallment('3/10'), '3/10');
  assert.equal(formatInstallment('1/5', 5), '1/5');

  // 3. Fallback seguro quando total ausente
  assert.equal(formatInstallment(1, null), '1');
  assert.equal(formatInstallment(2, undefined), '2');
  assert.equal(formatInstallment('3', ''), '3');

  // 4. Retorno nulo quando não há parcela
  assert.equal(formatInstallment(null), null);
  assert.equal(formatInstallment(undefined), null);
  assert.equal(formatInstallment(''), null);
  assert.equal(formatInstallment(null, 3), null);
});

test('AC-305: Exibição de badge fracionado e repasse de dados na Fatura de Cartões @spec:AC-305', () => {
  const listSource = readSource('components/credit-cards/TransactionList.tsx');

  // 1. Importação e uso do helper
  assert.ok(
    listSource.includes("import { formatInstallment } from '../../utils/formatInstallment.ts'"),
    'TransactionList deve importar formatInstallment'
  );
  assert.ok(
    listSource.includes('formatInstallment(tx.current_installment, tx.total_installments)'),
    'TransactionList deve invocar formatInstallment com current e total da transação'
  );

  // 2. Renderização do badge estilizado
  assert.ok(
    listSource.includes('data-testid={`tx-installment-${tx.id}`}') ||
    listSource.includes('data-testid="tx-installment-') ||
    listSource.includes('installmentText'),
    'TransactionList deve renderizar o badge de identificador da parcela'
  );

  // 3. Repasse correto das propriedades ao modal de detalhes
  assert.ok(
    listSource.includes('current_installment: tx.current_installment'),
    'TransactionList deve repassar current_installment ao abrir modal de detalhes'
  );
  assert.ok(
    listSource.includes('total_installments:'),
    'TransactionList deve repassar total_installments ao abrir modal de detalhes'
  );
  assert.ok(
    listSource.includes('installments_group_id: tx.installments_group_id'),
    'TransactionList deve repassar installments_group_id ao abrir modal de detalhes'
  );
});

test('AC-306: Renderização uniforme fracionada na tabela, mobile, modais e formulário @spec:AC-306', () => {
  // 1. Tabela Desktop
  const tableSource = readSource('components/transactions/TransactionTable.tsx');
  assert.ok(
    tableSource.includes('formatInstallment(t.current_installment, t.total_installments)'),
    'TransactionTable deve utilizar formatInstallment para renderizar parcelas'
  );

  // 2. Lista Mobile
  const mobileSource = readSource('components/transactions/TransactionMobileList.tsx');
  assert.ok(
    mobileSource.includes('formatInstallment(t.current_installment, t.total_installments)'),
    'TransactionMobileList deve utilizar formatInstallment para renderizar parcelas'
  );

  // 3. Modal de Detalhes
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');
  assert.ok(
    modalSource.includes('formatInstallment(transaction.current_installment, transaction.total_installments)'),
    'TransactionDetailsModal deve utilizar formatInstallment no detalhe da parcela'
  );

  // 4. Diálogo de Exclusão
  const deleteSource = readSource('components/transactions/TransactionDeleteDialog.tsx');
  assert.ok(
    deleteSource.includes('formattedInstallment'),
    'TransactionDeleteDialog deve definir formattedInstallment com base em formatInstallment'
  );

  // 5. Formulário de Edição
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(
    formSource.includes('formatInstallment(initialData.current_installment, initialData.total_installments)'),
    'TransactionFormBase deve exibir contagem fracionada na opção de edição em lote'
  );
});

test('AC-307: Extensão tipada das interfaces TypeScript @spec:AC-307', () => {
  const creditCardTypes = readSource('types/creditCard.ts');
  assert.ok(
    creditCardTypes.includes('total_installments?: number | string | null;'),
    'CreditCardTransaction deve conter total_installments opcional'
  );
  assert.ok(
    creditCardTypes.includes('installments_group_id?: string | null;'),
    'CreditCardTransaction deve conter installments_group_id opcional'
  );

  const transactionTypes = readSource('types/transaction.ts');
  assert.ok(
    transactionTypes.includes('total_installments?: number | string | null;'),
    'Transaction deve conter total_installments opcional'
  );
  assert.ok(
    transactionTypes.includes('installments_group_id?: string | null;'),
    'Transaction deve conter installments_group_id opcional'
  );
});

test('AC-308: Rastreabilidade onp-spec-driven e conformidade de artefatos @spec:AC-308', () => {
  const specMd = fs.readFileSync(path.join(SPEC_DIR, 'spec.md'), 'utf8');
  const tasksMd = fs.readFileSync(path.join(SPEC_DIR, 'tasks.md'), 'utf8');

  assert.ok(specMd.includes('US-081'), 'spec.md deve conter US-081');
  assert.ok(specMd.includes('AC-304'), 'spec.md deve conter AC-304');
  assert.ok(specMd.includes('AC-305'), 'spec.md deve conter AC-305');
  assert.ok(specMd.includes('AC-306'), 'spec.md deve conter AC-306');
  assert.ok(specMd.includes('AC-307'), 'spec.md deve conter AC-307');
  assert.ok(specMd.includes('AC-308'), 'spec.md deve conter AC-308');

  assert.ok(tasksMd.includes('T-194'), 'tasks.md deve conter T-194');
  assert.ok(tasksMd.includes('T-195'), 'tasks.md deve conter T-195');
  assert.ok(tasksMd.includes('T-196'), 'tasks.md deve conter T-196');
  assert.ok(tasksMd.includes('T-197'), 'tasks.md deve conter T-197');
});

