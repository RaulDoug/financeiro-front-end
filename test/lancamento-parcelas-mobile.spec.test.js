// Testes de especificação da feature lancamento-parcelas-mobile — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
const SPEC_DIR = path.resolve('.spec/features/lancamento-parcelas-mobile');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

function readSpec(filename) {
  return fs.readFileSync(path.join(SPEC_DIR, filename), 'utf8');
}

// US-096 — Edição Fluida de Parcelas e Vencimento com Preservação do Layout Desktop

test('AC-342: Suporte a limpeza transitória sem reversão instantânea nos inputs @spec:AC-342', () => {
  const fieldsSource = readSource('components/transactions/InstallmentFields.tsx');

  // Verifica existência de estados intermediários de texto para parcelas e vencimento
  assert.ok(
    fieldsSource.includes('rawInstallments') && fieldsSource.includes('setRawInstallments'),
    'InstallmentFields deve gerenciar estado transitório rawInstallments'
  );
  assert.ok(
    fieldsSource.includes('rawDueDay') && fieldsSource.includes('setRawDueDay'),
    'InstallmentFields deve gerenciar estado transitório rawDueDay'
  );

  // Não deve forçar fallback || 2 diretamente no atributo value do input
  assert.ok(
    fieldsSource.includes('value={rawInstallments}'),
    'Input de parcelas deve utilizar value={rawInstallments} para permitir string vazia'
  );
  assert.ok(
    fieldsSource.includes('value={rawDueDay}'),
    'Input de vencimento deve utilizar value={rawDueDay} para permitir string vazia'
  );
});

test('AC-343: Otimizações de teclado numérico e foco para telas touch @spec:AC-343', () => {
  const fieldsSource = readSource('components/transactions/InstallmentFields.tsx');

  // inputMode="numeric" e pattern
  assert.ok(
    fieldsSource.includes('inputMode="numeric"'),
    'Inputs devem possuir inputMode="numeric" para acionar teclado numérico no mobile'
  );
  assert.ok(
    fieldsSource.includes('pattern="[0-9]*"'),
    'Inputs devem possuir pattern="[0-9]*" para compatibilidade com teclados touch'
  );

  // Auto-seleção de texto no foco
  assert.ok(
    fieldsSource.includes('onFocus={(e) => e.target.select()}'),
    'Inputs devem auto-selecionar o texto no foco para facilitar sobrescrita rápida'
  );
});

test('AC-344: Normalização defensiva no onBlur e sanitização de limites no submit @spec:AC-344', () => {
  const fieldsSource = readSource('components/transactions/InstallmentFields.tsx');
  const mobileSource = readSource('components/transactions/MobileQuickEntry.tsx');
  const desktopSource = readSource('components/transactions/TransactionFormBase.tsx');

  // onBlur normaliza parcelas (2 a 72)
  assert.ok(
    fieldsSource.includes('onBlur') && fieldsSource.includes("setRawInstallments('2')"),
    'onBlur de parcelas deve normalizar para 2 se vazio ou menor que 2'
  );
  assert.ok(
    fieldsSource.includes("setRawInstallments('72')"),
    'onBlur de parcelas deve limitar a 72 se superior'
  );

  // onBlur normaliza dia de vencimento (1 a 31)
  assert.ok(
    fieldsSource.includes("setRawDueDay('1')") && fieldsSource.includes("setRawDueDay('31')"),
    'onBlur de dia de vencimento deve limitar entre 1 e 31'
  );

  // Sanitização nos payloads de criação
  assert.ok(
    mobileSource.includes('Math.max(2, Math.min(72, Number(installmentsNumber) || 2))'),
    'MobileQuickEntry deve sanitizar installments_number no payload'
  );
  assert.ok(
    desktopSource.includes('Math.max(2, Math.min(72, Number(installmentsNumber) || 2))'),
    'TransactionFormBase deve sanitizar installments_number no payload'
  );
});

test('AC-345: Preservação do layout e estrutura do desktop @spec:AC-345', () => {
  const desktopSource = readSource('components/transactions/TransactionFormBase.tsx');
  const modalSource = readSource('components/transactions/TransactionModal.tsx');

  // Garante que o desktop continua utilizando TransactionFormBase e InstallmentFields
  assert.ok(
    desktopSource.includes('<InstallmentFields'),
    'TransactionFormBase deve manter a renderização de InstallmentFields no desktop'
  );
  assert.ok(
    modalSource.includes('<TransactionFormBase'),
    'TransactionModal deve renderizar TransactionFormBase para visualização desktop'
  );
});

test('AC-346: Conformidade da especificação e rastreabilidade onp-spec-driven @spec:AC-346', () => {
  const specContent = readSpec('spec.md');
  const tasksContent = readSpec('tasks.md');

  assert.ok(specContent.includes('US-096'), 'spec.md deve referenciar US-096');
  assert.ok(specContent.includes('AC-342'), 'spec.md deve conter critério AC-342');
  assert.ok(specContent.includes('AC-343'), 'spec.md deve conter critério AC-343');
  assert.ok(specContent.includes('AC-344'), 'spec.md deve conter critério AC-344');
  assert.ok(specContent.includes('AC-345'), 'spec.md deve conter critério AC-345');
  assert.ok(specContent.includes('AC-346'), 'spec.md deve conter critério AC-346');

  assert.ok(tasksContent.includes('T-170'), 'tasks.md deve conter T-170');
  assert.ok(tasksContent.includes('T-171'), 'tasks.md deve conter T-171');
  assert.ok(tasksContent.includes('T-172'), 'tasks.md deve conter T-172');
  assert.ok(tasksContent.includes('T-173'), 'tasks.md deve conter T-173');
});
