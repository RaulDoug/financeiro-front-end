// Testes de spec da feature detalhes-transacao-layout — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-058 — Ajuste de Grid e Ações do Modal de Detalhes da Transação
test('AC-200: Rodapé responsivo sem overflow horizontal @spec:AC-200', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve utilizar contêiner com flex responsivo (flex-col para mobile e sm:flex-row para desktop)
  assert.ok(
    modalSource.includes('flex flex-col sm:flex-row sm:items-center sm:justify-between'),
    'Rodapé de ações deve utilizar flex-col no mobile e sm:flex-row no desktop para evitar overflow'
  );
  assert.ok(
    modalSource.includes('px-4 sm:px-5 py-3.5'),
    'Rodapé deve aplicar padding proporcional para acomodar botões'
  );
});

// US-058 — Ajuste de Grid e Ações do Modal de Detalhes da Transação
test('AC-201: Integridade e visibilidade completa do botão de edição @spec:AC-201', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Botão de edição deve manter data-testid, ícone Edit2 e whitespace-nowrap sem risco de corte
  assert.ok(
    modalSource.includes('data-testid="btn-details-edit"'),
    'Deve existir o botão com data-testid="btn-details-edit"'
  );
  assert.ok(
    modalSource.includes('<Edit2') && modalSource.includes('Editar'),
    'Botão de edição deve conter o ícone Edit2 e o texto Editar'
  );
  assert.ok(
    modalSource.includes('whitespace-nowrap'),
    'Botão de edição deve utilizar whitespace-nowrap para não quebrar texto'
  );
});

// US-058 — Ajuste de Grid e Ações do Modal de Detalhes da Transação
test('AC-202: Botão de pagamento adaptativo @spec:AC-202', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Botão de pagamento deve possuir comportamento responsivo: w-full no mobile e inline no desktop
  assert.ok(
    modalSource.includes('data-testid="btn-details-pay"') &&
    modalSource.includes("transaction.status !== 'completed'"),
    'Botão de pagamento deve ser condicional ao status pendente e manter data-testid="btn-details-pay"'
  );
  assert.ok(
    modalSource.includes('w-full sm:hidden') &&
    modalSource.includes('hidden sm:inline-flex'),
    'Botão de pagamento deve ocupar largura total no mobile e inline no desktop'
  );
});

// US-058 — Ajuste de Grid e Ações do Modal de Detalhes da Transação
test('AC-203: Harmonização das ações de fechar e excluir @spec:AC-203', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve haver botão de exclusão e fechamento adequadamente espaçados
  assert.ok(
    modalSource.includes('data-testid="btn-details-delete"'),
    'Deve existir botão de exclusão com data-testid="btn-details-delete"'
  );
  assert.ok(
    modalSource.includes('onClick={closeModal}') &&
    modalSource.includes('Fechar'),
    'Deve existir botão secundário para fechar o modal'
  );
});

// US-058 — Ajuste de Grid e Ações do Modal de Detalhes da Transação
test('AC-204: Preservação funcional dos handlers e mini-formulário @spec:AC-204', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Handlers e formulário de pagamento devem ser preservados
  assert.ok(
    modalSource.includes('handleEdit') &&
    modalSource.includes('handleDelete') &&
    modalSource.includes('handleConfirmPayment'),
    'Handlers de edição, exclusão e confirmação de pagamento devem ser preservados'
  );
  assert.ok(
    modalSource.includes('data-testid="payment-mini-form"') &&
    modalSource.includes('data-testid="btn-confirm-payment"'),
    'Mini-formulário de confirmação de pagamento deve ser mantido'
  );
});

