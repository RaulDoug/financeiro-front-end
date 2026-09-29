// Testes de spec da feature correcoes-basicas
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-086 — Reorganização dos Campos de Pagamento e Conta no Layout Mobile
test('AC-318: Troca de posição entre Forma de Pagamento e Conta de Saída/Entrada no lançamento de receitas e despesas mobile @spec:AC-318', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Localizar a seção de despesas/receitas (quando type !== 'transfers')
  // No layout reorganizado:
  // Linha 1: [Forma de Pagamento (chip-pay-method)] [Categoria (chip-category)]
  // Linha 2: [Conta de Entrada/Saída (chip-account)] [Contraparte (chip-counterparty)]

  const row1Pattern = /data-testid="chip-pay-method"[\s\S]*?data-testid="chip-category"/;
  assert.ok(
    row1Pattern.test(quickEntrySource),
    'A primeira linha deve conter Forma de Pagamento (chip-pay-method) seguida de Categoria (chip-category)'
  );

  const row2Pattern = /data-testid="chip-account"[\s\S]*?data-testid="chip-counterparty"/;
  assert.ok(
    row2Pattern.test(quickEntrySource),
    'A segunda linha deve conter Conta de Saída/Entrada (chip-account) seguida de Contraparte (chip-counterparty)'
  );

  // Garantir que no bloco de receitas/despesas Forma de Pagamento antecede Conta
  const payMethodIdx = quickEntrySource.indexOf('data-testid="chip-pay-method"');
  // Segundo chip-account (o primeiro é da origem em transferências)
  const firstChipAccountIdx = quickEntrySource.indexOf('data-testid="chip-account"');
  const secondChipAccountIdx = quickEntrySource.indexOf('data-testid="chip-account"', firstChipAccountIdx + 1);

  assert.ok(
    secondChipAccountIdx > 0 && payMethodIdx > 0,
    'Deve haver chip de pagamento e chip de conta no componente'
  );

  // Label contextual de Conta de Entrada / Conta de Saída preservado
  assert.ok(
    quickEntrySource.includes("{type === 'incomings' ? 'Conta de Entrada' : 'Conta de Saída'}"),
    'Deve manter o label dinâmico "Conta de Entrada" / "Conta de Saída"'
  );
  assert.ok(
    quickEntrySource.includes('(Vinculada ao cartão)'),
    'Deve manter o indicativo visual de conta vinculada ao cartão'
  );
});

// US-086 — Reorganização dos Campos de Pagamento e Conta no Layout Mobile
test('AC-319: Preservação da disposição dos campos no lançamento de transferências @spec:AC-319', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Em transferências (type === 'transfers'):
  // Linha 1: [Origem (chip-account)] [Destino (chip-account-destiny)]
  const transferRow1Pattern = /type === 'transfers'\s*\?[\s\S]*?data-testid="chip-account"[\s\S]*?data-testid="chip-account-destiny"/;
  assert.ok(
    transferRow1Pattern.test(quickEntrySource),
    'Na aba transferência, a primeira linha deve manter Origem (chip-account) e Destino (chip-account-destiny)'
  );

  // Linha 2 de transferências: Forma de Pagamento isolada sem contraparte
  const transferRow2Pattern = /type === 'transfers'\s*\?[\s\S]*?data-testid="chip-pay-method"[\s\S]*?:\s*\(\s*<div className="grid grid-cols-2/;
  assert.ok(
    transferRow2Pattern.test(quickEntrySource),
    'Na aba transferência, a segunda linha deve manter Forma de Pagamento isolada em coluna única'
  );
});
