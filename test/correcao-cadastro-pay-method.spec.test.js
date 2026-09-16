// Testes de spec da feature correcao-cadastro-pay-method
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  sanitizeRegisterPayMethodPayload,
  sanitizeUpdatePayMethodPayload,
} from '../src/services/payMethod.service.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-062 — Sanitização e Persistência Confiável de Métodos de Pagamento
test('AC-218: Sanitização estrita no payload de cadastro de método de pagamento @spec:AC-218', () => {
  // Dado: payload do formulário contendo campo 'type' e propriedades extras de formulário
  const dirtyData = {
    name: '  Pix Principal  ',
    credit_card: false,
    type: 'pix',
    brand: 'elo',
    extra_field: 'invalid',
    bank_account_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    icon: 'zap',
    color: '#10B981',
  };

  // Quando: o payload é sanitizado para cadastro
  const cleaned = sanitizeRegisterPayMethodPayload(dirtyData);

  // Então: 'type', 'brand' e outros campos espúrios são removidos
  assert.equal(cleaned.name, 'Pix Principal');
  assert.equal(cleaned.credit_card, false);
  assert.equal(cleaned.bank_account_id, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
  assert.equal(cleaned.icon, 'zap');
  assert.equal(cleaned.color, '#10B981');
  assert.equal(cleaned.type, undefined, 'type não pode existir no payload persistível');
  assert.equal(cleaned.brand, undefined, 'brand não pode existir no payload persistível');
  assert.equal(cleaned.extra_field, undefined, 'campos não mapeados não podem existir');

  // Verifica que payMethodService invoca sanitizeRegisterPayMethodPayload antes de disparar POST
  const serviceSource = readSource('services/payMethod.service.ts');
  assert.ok(
    serviceSource.includes('sanitizeRegisterPayMethodPayload'),
    'payMethod.service.ts deve utilizar sanitizeRegisterPayMethodPayload no registerPayMethod'
  );
  assert.ok(
    serviceSource.includes("'/pay-method/register'") && serviceSource.includes('payload,'),
    'payMethod.service.ts deve enviar o payload sanitizado'
  );
});

// US-062 — Sanitização e Persistência Confiável de Métodos de Pagamento
test('AC-219: Sanitização estrita no payload de atualização de método de pagamento @spec:AC-219', () => {
  // Dado: payload de edição contendo campos não suportados na rota de update
  const dirtyUpdateData = {
    name: '  Novo Nome  ',
    type: 'money',
    brand: 'visa',
    credit_card: true, // credit_card não pode ser alterado após criação
    bank_account_id: 'a1b2c3d4-0000-0000-0000-000000000000',
    icon: 'banknote',
    color: '#3b82f6',
  };

  // Quando: o payload é sanitizado para atualização
  const cleaned = sanitizeUpdatePayMethodPayload(dirtyUpdateData);

  // Então: apenas campos válidos da rota PATCH são mantidos
  assert.equal(cleaned.name, 'Novo Nome');
  assert.equal(cleaned.bank_account_id, 'a1b2c3d4-0000-0000-0000-000000000000');
  assert.equal(cleaned.icon, 'banknote');
  assert.equal(cleaned.color, '#3b82f6');
  assert.equal(cleaned.type, undefined, 'type não pode existir no payload de update');
  assert.equal(cleaned.brand, undefined, 'brand não pode existir no payload de update');
  assert.equal(cleaned.credit_card, undefined, 'credit_card não pode ser transmitido no update');

  // Verifica que payMethodService invoca sanitizeUpdatePayMethodPayload antes de disparar PATCH
  const serviceSource = readSource('services/payMethod.service.ts');
  assert.ok(
    serviceSource.includes('sanitizeUpdatePayMethodPayload'),
    'payMethod.service.ts deve utilizar sanitizeUpdatePayMethodPayload no updatePayMethod'
  );
  assert.ok(
    serviceSource.includes('payload'),
    'payMethod.service.ts deve enviar o payload sanitizado no PATCH'
  );
});

// US-062 — Sanitização e Persistência Confiável de Métodos de Pagamento
test('AC-220: Envio limpo e feedback no modal de método de pagamento @spec:AC-220', () => {
  const modalSource = readSource('pages/Settings/PayMethodModal.tsx');

  // Verifica que PayMethodModal monta submissionData limpo sem incluir type
  assert.ok(
    modalSource.includes('submissionData: CreatePayMethodDTO') ||
    modalSource.includes('const submissionData'),
    'PayMethodModal deve definir submissionData explicitamente'
  );
  assert.ok(
    modalSource.includes('await onSubmit(submissionData)'),
    'PayMethodModal deve submeter submissionData sanitizado'
  );

  // Verifica que não repassa rawData com type diretamente para onSubmit
  assert.ok(
    !modalSource.includes('await onSubmit(rawData as CreatePayMethodDTO)'),
    'PayMethodModal não deve repassar rawData bruto com type para onSubmit'
  );

  // Verifica preservação de icon e color
  assert.ok(
    modalSource.includes("icon: isCreditCard ? (icon || 'credit-card') : icon"),
    'PayMethodModal deve preservar ícone para cartão de crédito e métodos comuns'
  );
  assert.ok(
    modalSource.includes("color: color || '#3b82f6'"),
    'PayMethodModal deve preservar cor padrão para submissão'
  );
});
