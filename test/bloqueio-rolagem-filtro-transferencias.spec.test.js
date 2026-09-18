// Testes de spec da feature bloqueio-rolagem-filtro-transferencias — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-081 — Bloqueio de Rolagem no Desktop com Modais Abertos

test('AC-296: useModalTransition gerencia bloqueio de rolagem e compensação de layout shift @spec:AC-296', () => {
  const hookSource = readSource('hooks/useModalTransition.ts');

  // Deve manipular overflow do body quando isRendered estiver ativo
  assert.ok(
    hookSource.includes('document.body.style.overflow') &&
    hookSource.includes("'hidden'"),
    'useModalTransition deve definir document.body.style.overflow como hidden quando modal estiver renderizado'
  );

  // Deve restaurar overflow ao desmontar / fechar
  assert.ok(
    hookSource.includes('originalOverflow') || hookSource.includes("document.body.style.overflow = ''") || hookSource.includes('prevOverflow'),
    'useModalTransition deve restaurar o overflow do body ao fechar'
  );

  // Deve compensar largura de scrollbar para evitar layout shift no Windows
  assert.ok(
    hookSource.includes('paddingRight') || hookSource.includes('scrollbarWidth'),
    'useModalTransition deve compensar padding-right da scrollbar para evitar layout shift'
  );
});

test('AC-297: Modais de transação possuem contenção de scroll e acionam bloqueio @spec:AC-297', () => {
  const txModalSource = readSource('components/transactions/TransactionModal.tsx');
  const detailsModalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // TransactionModal deve usar overscroll-contain para impedir scroll chaining
  assert.ok(
    txModalSource.includes('overscroll-contain') || txModalSource.includes('overscroll-y-contain'),
    'TransactionModal deve aplicar overscroll-contain para prender a rolagem ao modal'
  );

  // TransactionDetailsModal deve bloquear rolagem do body quando aberto
  assert.ok(
    detailsModalSource.includes('document.body.style.overflow') ||
    detailsModalSource.includes('useScrollLock') ||
    detailsModalSource.includes('useModalTransition'),
    'TransactionDetailsModal deve garantir bloqueio de rolagem do body enquanto estiver aberto'
  );

  // TransactionDetailsModal também deve conter overscroll
  assert.ok(
    detailsModalSource.includes('overscroll-contain') || detailsModalSource.includes('overscroll-y-contain'),
    'TransactionDetailsModal deve conter classe overscroll-contain'
  );
});

// US-082 — Filtro e Listagem de Transferências

test('AC-298: Filtro de transferências integrado na listagem de transações @spec:AC-298', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');

  // Suporte a filtro por transfers cobrindo transfer_in e transfer_out
  assert.ok(
    pageSource.includes("filters.type === 'transfers'") &&
    pageSource.includes("t.type === 'transfer_in'") &&
    pageSource.includes("t.type === 'transfer_out'"),
    'TransactionsPage deve manter filtro em memória para transfers englobando transfer_in e transfer_out'
  );

  // queryFilters deve manter coerência com o backend
  assert.ok(
    pageSource.includes('queryFilters'),
    'TransactionsPage deve calcular queryFilters para envio à API'
  );
});

test('AC-299: Apresentação e sinais de transferências na tabela e lista mobile @spec:AC-299', () => {
  const tableSource = readSource('components/transactions/TransactionTable.tsx');
  const mobileListSource = readSource('components/transactions/TransactionMobileList.tsx');

  // Tabela deve tratar tanto transfer_in quanto transfer_out / transfers
  assert.ok(
    tableSource.includes("t.type === 'transfers'") ||
    tableSource.includes("t.type === 'transfer_out'") ||
    tableSource.includes("t.type === 'transfer_in'"),
    'TransactionTable deve identificar e tratar transações de transferência'
  );

  // Lista mobile deve tratar transações de transferência
  assert.ok(
    mobileListSource.includes("t.type === 'transfers'") ||
    mobileListSource.includes("t.type === 'transfer_out'") ||
    mobileListSource.includes("t.type === 'transfer_in'"),
    'TransactionMobileList deve identificar e tratar transações de transferência'
  );
});

