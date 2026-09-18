// Testes de spec da feature contrapartes-desktop-filtro — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-080 — Filtragem Contextual de Contrapartes no Formulário Desktop

test('AC-294: Filtragem estrita de contrapartes por tipo no Desktop e exclusão de Transferências @spec:AC-294', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Deve definir filteredCounterparties com exclusão de transferências
  assert.ok(
    formSource.includes('filteredCounterparties') &&
    formSource.includes("cp.name.toLowerCase() !== 'transferências'") &&
    formSource.includes("cp.name.toLowerCase() !== 'transferencias'"),
    'TransactionFormBase deve filtrar contrapartes removendo registros com nome Transferências'
  );

  // Deve filtrar por payer para incomings e payee para expenses
  assert.ok(
    formSource.includes("type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee'"),
    'TransactionFormBase deve filtrar contrapartes por payer para receitas e payee para despesas'
  );

  // O select desktop de contrapartes deve renderizar a lista filtrada/displayCounterparties
  assert.ok(
    formSource.includes('data-testid="select-counterparty"'),
    'TransactionFormBase deve conter select com data-testid="select-counterparty"'
  );
  assert.ok(
    formSource.includes('displayCounterparties.map') || formSource.includes('filteredCounterparties.map'),
    'Select de contraparte desktop deve iterar sobre as contrapartes filtradas'
  );
});

test('AC-295: Auto-seleção coerente e fallback defensivo para contraparte @spec:AC-295', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Auto-seleção no primeiro item válido da lista filtrada
  assert.ok(
    formSource.includes('filteredCounterparties.length > 0') &&
    formSource.includes('setCounterpartyId(filteredCounterparties[0].id)'),
    'Ao criar nova transação, deve auto-selecionar o primeiro registro de filteredCounterparties'
  );

  // Preservação de contraparte de edição
  assert.ok(
    formSource.includes('displayCounterparties') &&
    formSource.includes('initialData?.counterparty_id'),
    'Deve preservar contraparte existente na edição caso seja legado'
  );

  // Fallback de salvamento usa filteredCounterparties
  assert.ok(
    formSource.includes('finalCounterpartyId = filteredCounterparties[0].id'),
    'Fallback no submit deve usar filteredCounterparties em vez de pegar elemento cego de tipo inconsistente'
  );
});

