// Testes de spec da feature sino-notificacoes-baixa-edicao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { useTransactionDetailsModalStore } from '../src/stores/transactionDetailsModal.store.ts';
import { useTransactionModalStore } from '../src/stores/transactionModal.store.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-071 — Atualização Reativa do Sino de Notificações e Edição de Transações Vencidas
test('AC-261: Sincronização reativa de query e invalidação unificada @spec:AC-261', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');
  const mutationsSource = readSource('hooks/useTransactionMutations.ts');

  // NotificationsBell deve utilizar DASHBOARD_QUERY_KEYS.overdueAlerts para compartilhar chave de cache
  assert.ok(
    bellSource.includes('DASHBOARD_QUERY_KEYS.overdueAlerts'),
    'NotificationsBell deve utilizar DASHBOARD_QUERY_KEYS.overdueAlerts'
  );

  // useTransactionMutations deve invalidar tanto dashboard quanto overdue-alerts
  assert.ok(
    mutationsSource.includes("queryKey: ['dashboard']"),
    'useTransactionMutations deve invalidar queryKey dashboard'
  );
  assert.ok(
    mutationsSource.includes("queryKey: ['overdue-alerts']"),
    'useTransactionMutations deve invalidar queryKey overdue-alerts'
  );
  assert.ok(
    mutationsSource.includes("refetchQueries({ queryKey: ['overdue-alerts']"),
    'useTransactionMutations deve disparar refetch de overdue-alerts'
  );
});

test('AC-262: Registro de callback onEdit no sino de notificações @spec:AC-262', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Deve passar onEdit em openModal no NotificationsBell
  assert.ok(
    bellSource.includes('onEdit:') && bellSource.includes('useTransactionModalStore'),
    'NotificationsBell deve registrar callback onEdit integrando com useTransactionModalStore'
  );
  assert.ok(
    bellSource.includes('useTransactionModalStore.getState().openModal'),
    'Callback onEdit no sino deve invocar openModal da modal store de transações'
  );
});

test('AC-263: Fallback defensivo no TransactionDetailsModal para abertura de edição @spec:AC-263', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // handleEdit deve verificar onEditCallback e conter fallback para useTransactionModalStore
  assert.ok(
    detailsSource.includes('useTransactionModalStore.getState().openModal'),
    'TransactionDetailsModal deve possuir fallback para useTransactionModalStore.openModal'
  );
  assert.ok(
    detailsSource.includes('modalType ='),
    'TransactionDetailsModal deve normalizar modalType para a abertura'
  );

  // Testa diretamente a integração entre stores:
  const detailsStore = useTransactionDetailsModalStore.getState();
  const txModalStore = useTransactionModalStore.getState();

  // Fecha qualquer modal aberto previamente
  detailsStore.closeModal();
  txModalStore.closeModal();

  const dummyTx = {
    id: 'tx-fallback-test',
    description: 'Teste Fallback Edição',
    value: '250',
    type: 'expenses',
    status: 'expired',
    due_date: '2026-03-01',
    payment_date: null,
    purchase_date: '2026-03-01',
    category_name: null,
    pay_method_name: '',
    bank_account_name: '',
    counterparty_name: null,
    creator_user_name: '',
    transfers_id: null,
    invoice_id: null,
    current_installment: null,
    created_at: '',
  };

  // Abre sem callbacks
  detailsStore.openModal(dummyTx);
  assert.equal(useTransactionDetailsModalStore.getState().isOpen, true);
  assert.equal(useTransactionDetailsModalStore.getState().onEditCallback, null);

  // Simula o fallback executado no handleEdit
  const current = useTransactionDetailsModalStore.getState().transaction;
  if (!useTransactionDetailsModalStore.getState().onEditCallback && current) {
    txModalStore.openModal('expenses', current);
  }

  assert.equal(useTransactionModalStore.getState().isOpen, true, 'Modal global de edição deve abrir');
  assert.equal(useTransactionModalStore.getState().initialData?.id, 'tx-fallback-test');

  txModalStore.closeModal();
  detailsStore.closeModal();
});

test('AC-264: Mapeamento de status expired e data de vencimento no sino @spec:AC-264', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Ao instanciar tx no sino, status deve ser 'expired'
  assert.ok(
    bellSource.includes("status: 'expired'"),
    'Transação aberta via sino deve ter status: expired'
  );
  assert.ok(
    bellSource.includes('purchase_date: item.due_date'),
    'Transação aberta via sino deve mapear purchase_date a partir de due_date'
  );
});

test('AC-265: Prova executável e integridade das stores @spec:AC-265', () => {
  // Valida que useTransactionModalStore suporta abertura em modo de edição com initialData
  const modalStore = useTransactionModalStore.getState();
  const editItem = {
    id: 'tx-test-edit-99',
    description: 'Boleto Vencido',
    value: '500.00',
    type: 'expenses',
    status: 'expired',
    due_date: '2026-02-15',
    payment_date: null,
    purchase_date: '2026-02-15',
    category_name: 'Habitação',
    pay_method_name: 'Boleto',
    bank_account_name: 'Conta Principal',
    counterparty_name: null,
    creator_user_name: '',
    transfers_id: null,
    invoice_id: null,
    current_installment: null,
    created_at: '',
  };

  modalStore.openModal('expenses', editItem);

  const state = useTransactionModalStore.getState();
  assert.equal(state.isOpen, true);
  assert.equal(state.defaultType, 'expenses');
  assert.equal(state.initialData?.id, 'tx-test-edit-99');
  assert.equal(state.initialData?.status, 'expired');

  modalStore.closeModal();
  assert.equal(useTransactionModalStore.getState().isOpen, false);
  assert.equal(useTransactionModalStore.getState().initialData, null);
});

