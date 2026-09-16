// Testes de spec da feature transferencias-categorias-sinais
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-065 — Suporte a Transferências — Categoria Padrão e Sinais de Entrada/Saída
test('AC-234: Categoria padrão interna Transferência vinculada e auto-criada em transferências @spec:AC-234', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');
  const formBaseSource = readSource('components/transactions/TransactionFormBase.tsx');

  // MobileQuickEntry deve resolver ou auto-criar categoria Transferência
  assert.ok(
    quickEntrySource.includes("c.name.toLowerCase() === 'transferência'") &&
    quickEntrySource.includes("name: 'Transferência'") &&
    quickEntrySource.includes('payload.category_id = transferCategoryId'),
    'MobileQuickEntry deve localizar ou criar categoria Transferência e vincular ao payload'
  );

  // TransactionFormBase deve resolver ou auto-criar categoria Transferência
  assert.ok(
    formBaseSource.includes("c.name.toLowerCase() === 'transferência'") &&
    formBaseSource.includes("name: 'Transferência'") &&
    formBaseSource.includes('payload.category_id = transferCat.id'),
    'TransactionFormBase deve localizar ou criar categoria Transferência e vincular ao payload desktop'
  );
});

// US-065 — Suporte a Transferências — Categoria Padrão e Sinais de Entrada/Saída
test('AC-235: Ocultação da categoria Transferência de configurações e seletores @spec:AC-235', () => {
  const settingsSource = readSource('pages/Settings/CategoriesSettings.tsx');
  const categorySelectSource = readSource('components/transactions/CategorySelect.tsx');
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // CategoriesSettings deve filtrar categorias que começam com transferência
  assert.ok(
    settingsSource.includes("!c.name.toLowerCase().startsWith('transferência')") &&
    settingsSource.includes('userCategories'),
    'CategoriesSettings deve filtrar categorias Transferência das contagens e listagem'
  );

  // CategorySelect deve filtrar categorias Transferência
  assert.ok(
    categorySelectSource.includes("!c.name.toLowerCase().startsWith('transferência')"),
    'CategorySelect deve filtrar categoria Transferência do dropdown de despesas/receitas'
  );

  // MobileQuickEntry deve filtrar categorias Transferência nos chips visuais
  assert.ok(
    quickEntrySource.includes("!c.name.toLowerCase().startsWith('transferência')"),
    'MobileQuickEntry deve filtrar categoria Transferência das opções de receitas e despesas'
  );
});

// US-065 — Suporte a Transferências — Categoria Padrão e Sinais de Entrada/Saída
test('AC-236: Exibição correta de sinal positivo e verde para transfer_in @spec:AC-236', () => {
  const typesSource = readSource('types/transaction.ts');
  const mobileListSource = readSource('components/transactions/TransactionMobileList.tsx');
  const tableSource = readSource('components/transactions/TransactionTable.tsx');
  const detailsModalSource = readSource('components/transactions/TransactionDetailsModal.tsx');
  const recentTxSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');

  // Tipagem deve incluir transfer_in e transfer_out
  assert.ok(
    typesSource.includes("'transfer_in'") &&
    typesSource.includes("'transfer_out'"),
    'TransactionType deve conter transfer_in e transfer_out'
  );

  // TransactionMobileList deve tratar transfer_in como isIncome (positivo/verde)
  assert.ok(
    mobileListSource.includes("t.type === 'incomings' || t.type === 'transfer_in'"),
    'TransactionMobileList deve reconhecer transfer_in como entrada positiva'
  );

  // TransactionTable deve tratar transfer_in como isIncome
  assert.ok(
    tableSource.includes("t.type === 'incomings' || t.type === 'transfer_in'"),
    'TransactionTable deve reconhecer transfer_in como entrada positiva'
  );

  // TransactionDetailsModal deve formatar transfer_in e badges adequadamente
  assert.ok(
    detailsModalSource.includes("transaction.type === 'incomings' || transaction.type === 'transfer_in'") &&
    detailsModalSource.includes('Transferência (Entrada)'),
    'TransactionDetailsModal deve exibir badge e valor positivo para transfer_in'
  );

  // RecentTransactions no Dashboard deve reconhecer transfer_in
  assert.ok(
    recentTxSource.includes("tx.type === 'incomings' || tx.type === 'transfer_in'"),
    'RecentTransactions deve exibir transfer_in como valor positivo'
  );
});

