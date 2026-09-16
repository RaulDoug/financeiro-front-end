// Testes de spec da feature lancamento-transacao-global
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { useTransactionModalStore } from '../src/stores/transactionModal.store.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-063 — Acesso Global ao Modal de Lançamento de Transação
test('AC-221: Abertura imediata do modal a partir de qualquer rota @spec:AC-221', () => {
  const appLayoutSource = readSource('layouts/AppLayout.tsx');
  const globalModalSource = readSource('components/transactions/GlobalTransactionModal.tsx');
  const mobileNavSource = readSource('components/layout/MobileNav.tsx');

  // AppLayout deve renderizar GlobalTransactionModal para que qualquer rota tenha o modal montado
  assert.ok(
    appLayoutSource.includes('<GlobalTransactionModal />') &&
    appLayoutSource.includes("import { GlobalTransactionModal }"),
    'AppLayout deve importar e renderizar GlobalTransactionModal no shell raiz'
  );

  // MobileNav deve acionar openModal ao clicar no botão de adicionar
  assert.ok(
    mobileNavSource.includes('data-testid="mobile-nav-quick-add"') &&
    mobileNavSource.includes('openModal()'),
    'MobileNav deve possuir o botão rápido chamando openModal()'
  );

  // GlobalTransactionModal deve escutar a store global useTransactionModalStore
  assert.ok(
    globalModalSource.includes('useTransactionModalStore') &&
    globalModalSource.includes('isOpen') &&
    globalModalSource.includes('TransactionModal'),
    'GlobalTransactionModal deve renderizar TransactionModal baseado no estado isOpen da store'
  );

  // Verificação de funcionamento da store: abrir modal altera isOpen para true
  useTransactionModalStore.getState().closeModal();
  assert.equal(useTransactionModalStore.getState().isOpen, false);
  useTransactionModalStore.getState().openModal('incomings');
  assert.equal(useTransactionModalStore.getState().isOpen, true);
  assert.equal(useTransactionModalStore.getState().defaultType, 'incomings');
  useTransactionModalStore.getState().closeModal();
});

// US-063 — Acesso Global ao Modal de Lançamento de Transação
test('AC-222: Criação e persistência com invalidação de cache reativa @spec:AC-222', () => {
  const globalModalSource = readSource('components/transactions/GlobalTransactionModal.tsx');
  const mutationsSource = readSource('hooks/useTransactionMutations.ts');

  // GlobalTransactionModal deve integrar com useTransactionMutations para salvar transações
  assert.ok(
    globalModalSource.includes('useTransactionMutations') &&
    globalModalSource.includes('createMutation.mutateAsync'),
    'GlobalTransactionModal deve utilizar createMutation.mutateAsync para persistir lançamentos'
  );

  // Ao submeter com sucesso, o modal deve ser fechado
  assert.ok(
    globalModalSource.includes('closeModal()'),
    'GlobalTransactionModal deve invocar closeModal() após concluir o salvamento'
  );

  // useTransactionMutations deve invalidar e sincronizar as chaves essenciais
  assert.ok(
    mutationsSource.includes("'transactions'") &&
    mutationsSource.includes("'dashboard'") &&
    mutationsSource.includes("'bank-accounts'") &&
    mutationsSource.includes("'credit-cards'"),
    'useTransactionMutations deve invalidar transações, dashboard, contas bancárias e cartões'
  );
});

// US-063 — Acesso Global ao Modal de Lançamento de Transação
test('AC-223: Prevenção de vazamento de modal pendente entre rotas @spec:AC-223', () => {
  const appLayoutSource = readSource('layouts/AppLayout.tsx');
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');

  // AppLayout deve monitorar trocas de rota para fechar o modal e limpar o estado global
  assert.ok(
    appLayoutSource.includes('location.pathname') &&
    appLayoutSource.includes('closeModal()'),
    'AppLayout deve chamar closeModal() ao alternar location.pathname'
  );

  // DashboardPage não deve ter instância local duplicada de TransactionModal
  assert.ok(
    !dashboardSource.includes('<TransactionModal') &&
    dashboardSource.includes('closeModal()'),
    'DashboardPage deve manter o cleanup closeModal() sem duplicar a tag <TransactionModal>'
  );
});

