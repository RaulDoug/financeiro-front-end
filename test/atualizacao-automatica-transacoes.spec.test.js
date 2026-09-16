// Testes de spec da feature atualizacao-automatica-transacoes — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações
test('AC-210: Atualização imediata na listagem de transações após criação @spec:AC-210', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');

  assert.ok(
    pageSource.includes('refetch,') &&
      (pageSource.includes('useTransactions(filters)') || pageSource.includes('useTransactions(queryFilters)')),
    'TransactionsPage deve extrair a função refetch do hook useTransactions'
  );

  assert.ok(
    pageSource.includes('await Promise.all([refetch(), refetchPastOverdue()])'),
    'handleModalSubmit deve aguardar refetch() e refetchPastOverdue() antes de fechar o modal'
  );
});

// US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações
test('AC-211: Invalidação abrangente com refetch de consultas ativas no hook de mutações @spec:AC-211', () => {
  const mutationSource = readSource('hooks/useTransactionMutations.ts');

  assert.ok(
    mutationSource.includes('const invalidate = async () =>'),
    'invalidate deve ser uma função assíncrona'
  );

  assert.ok(
    mutationSource.includes("queryKey: ['transactions']") &&
    mutationSource.includes("queryKey: ['transactions-overdue-past']") &&
    mutationSource.includes("queryKey: ['dashboard']") &&
    mutationSource.includes("queryKey: ['bank-accounts']"),
    'invalidate deve invalidar transactions, transactions-overdue-past, dashboard e bank-accounts'
  );

  assert.ok(
    mutationSource.includes("refetchQueries({ queryKey: ['transactions'], type: 'active' })") &&
    mutationSource.includes("refetchQueries({ queryKey: ['dashboard'], type: 'active' })"),
    'invalidate deve disparar refetchQueries para queries ativas'
  );
});

// US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações
test('AC-212: Atualização imediata após efetivar pagamento nos detalhes da transação @spec:AC-212', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  assert.ok(
    detailsSource.includes('await updateMutation.mutateAsync'),
    'handleConfirmPayment deve aguardar updateMutation.mutateAsync'
  );

  assert.ok(
    detailsSource.includes('closeModal();'),
    'Modal deve fechar somente após o processamento da mutação'
  );
});

// US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações
test('AC-213: Atualização imediata do Dashboard após criação rápida de transação @spec:AC-213', () => {
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');

  assert.ok(
    dashboardSource.includes('await createMutation.mutateAsync(data)'),
    'DashboardPage deve aguardar createMutation.mutateAsync no onSubmit do TransactionModal'
  );

  assert.ok(
    dashboardSource.includes('isSubmitting={createMutation.isPending}'),
    'TransactionModal no Dashboard deve propagar o estado isPending da mutação'
  );
});

// US-061 — Atualização Reativa de Telas ao Lançar ou Alterar Transações
test('AC-214: Bloqueio do fechamento de modal até sincronização concluída @spec:AC-214', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');

  // Em TransactionsPage, o modal só é fechado após os awaits da mutação e refetch
  const submitIndex = pageSource.indexOf('const handleModalSubmit');
  const closeModalIndex = pageSource.indexOf('setIsModalOpen(false)', submitIndex);
  const awaitIndex = pageSource.indexOf('await Promise.all', submitIndex);

  assert.ok(
    submitIndex !== -1 && awaitIndex !== -1 && closeModalIndex !== -1,
    'handleModalSubmit deve conter os blocos de submit, await e fechamento'
  );
  assert.ok(
    closeModalIndex > awaitIndex,
    'setIsModalOpen(false) deve ser chamado estritamente após o await da sincronização'
  );
});
