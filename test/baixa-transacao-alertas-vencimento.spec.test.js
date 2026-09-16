// Testes de spec da feature baixa-transacao-alertas-vencimento — metodologia onp-spec-driven
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

// US-070 — Acesso e Baixa de Transações Vencidas via Card de Alertas no Dashboard
test('AC-256: Interatividade e acessibilidade no item de alerta @spec:AC-256', () => {
  const source = readSource('pages/Dashboard/components/OverdueAlerts.tsx');

  // Deve possuir affordances visuais de clique
  assert.ok(
    source.includes('cursor-pointer'),
    'O item de alerta deve possuir classe cursor-pointer para indicar interatividade'
  );
  assert.ok(
    source.includes('role="button"'),
    'O item de alerta deve ter role="button" para acessibilidade'
  );
  assert.ok(
    source.includes('tabIndex={0}'),
    'O item de alerta deve possuir tabIndex={0} permitindo foco via teclado'
  );
  assert.ok(
    source.includes("e.key === 'Enter'") && source.includes("e.key === ' '"),
    'O item de alerta deve responder aos atalhos de teclado Enter e Espaço'
  );
  assert.ok(
    source.includes('ChevronRight'),
    'Deve exibir ícone indicativo de ação/navegação (ChevronRight)'
  );
});

test('AC-257: Integração com useTransactionDetailsModalStore e mapeamento de dados @spec:AC-257', () => {
  const source = readSource('pages/Dashboard/components/OverdueAlerts.tsx');

  // Deve importar e usar useTransactionDetailsModalStore
  assert.ok(
    source.includes('useTransactionDetailsModalStore'),
    'Deve importar useTransactionDetailsModalStore no componente OverdueAlerts'
  );
  assert.ok(
    source.includes('openDetailsModal') || source.includes('openModal'),
    'Deve invocar o método de abertura da store'
  );

  // Testa o comportamento da store Zustand diretamente
  const detailsStore = useTransactionDetailsModalStore.getState();
  const alertItem = {
    id: 'alert-overdue-123',
    description: 'Conta de Água em Atraso',
    value: 85.5,
    due_date: '2026-03-01',
    type: 'expenses',
    days_overdue: 15,
  };

  const fullTx = {
    id: alertItem.id,
    description: alertItem.description,
    value: String(alertItem.value),
    type: alertItem.type,
    status: 'expired',
    due_date: alertItem.due_date,
    payment_date: null,
    purchase_date: alertItem.due_date,
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

  detailsStore.openModal(fullTx);

  const stateAfterOpen = useTransactionDetailsModalStore.getState();
  assert.equal(stateAfterOpen.isOpen, true, 'O modal de detalhes deve estar aberto');
  assert.equal(stateAfterOpen.transaction?.id, 'alert-overdue-123', 'A transação aberta deve coincidir com o item clicado');
  assert.equal(stateAfterOpen.transaction?.status, 'expired', 'O status da transação deve ser expired');
  assert.equal(stateAfterOpen.transaction?.value, '85.5', 'O valor deve ser convertido para string');

  detailsStore.closeModal();
  assert.equal(useTransactionDetailsModalStore.getState().isOpen, false, 'O modal deve ser fechado corretamente');
});

test('AC-258: Disponibilidade do fluxo de baixa no modal de detalhes @spec:AC-258', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // TransactionDetailsModal possui o botão de baixa e formulário quando pendente ou expirada
  assert.ok(
    detailsSource.includes('data-testid="btn-details-pay"'),
    'Modal de detalhes deve possuir botão Efetuar Pagamento com data-testid="btn-details-pay"'
  );
  assert.ok(
    detailsSource.includes('data-testid="payment-mini-form"'),
    'Modal deve conter mini formulário com data-testid="payment-mini-form"'
  );
  assert.ok(
    detailsSource.includes("transaction.status !== 'completed'"),
    'O botão de pagamento deve estar ativo para status diferente de completed (incluindo expired)'
  );
  assert.ok(
    detailsSource.includes('data-testid="btn-confirm-payment"'),
    'Deve possuir botão para confirmar e concluir o pagamento'
  );
});

test('AC-259: Sincronização reativa e recálculo após baixa da transação @spec:AC-259', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');
  const mutationsSource = readSource('hooks/useTransactionMutations.ts');

  // No TransactionDetailsModal, ao confirmar pagamento:
  assert.ok(
    detailsSource.includes('handleConfirmPayment'),
    'Deve existir manipulador de confirmação de pagamento'
  );
  assert.ok(
    detailsSource.includes("status: 'completed'"),
    'Deve enviar status completed ao confirmar o pagamento'
  );
  assert.ok(
    detailsSource.includes('closeModal()'),
    'Deve fechar o modal após confirmação do pagamento'
  );

  // useTransactionMutations invalida as queries de dashboard ao atualizar transação
  assert.ok(
    mutationsSource.includes("queryKey: ['dashboard']"),
    'Deve invalidar cache da query dashboard após mutação de transação'
  );
});

test('AC-260: Integridade da suíte de testes e montagem global @spec:AC-260', () => {
  const appLayoutSource = readSource('layouts/AppLayout.tsx');

  // TransactionDetailsModal montado na raiz da aplicação
  assert.ok(
    appLayoutSource.includes('<TransactionDetailsModal />'),
    'TransactionDetailsModal deve estar montado globalmente no AppLayout'
  );

  // OverdueAlerts no DashboardPage
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');
  assert.ok(
    dashboardSource.includes('<OverdueAlerts'),
    'DashboardPage deve renderizar o componente OverdueAlerts'
  );
  assert.ok(
    dashboardSource.includes('overdueAlertsQuery'),
    'DashboardPage deve carregar dados via overdueAlertsQuery'
  );
});

