// Testes de spec da feature investimentos
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { investmentAssetSchema } from '../src/schemas/investmentSchema.ts';
import { investmentAssetService } from '../src/services/investment-asset.service.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-021 — Gerenciamento de Ativos de Investimento
test('AC-089: Listagem de Ativos @spec:AC-089', () => {
  // 1. Rota registrada
  const routesSource = readSource('routes/index.tsx');
  assert.ok(routesSource.includes('path="/investments"'), 'Deve conter rota /investments');
  assert.ok(routesSource.includes('InvestmentsPage'), 'Deve renderizar InvestmentsPage');

  // 2. Componente de lista exibe nome, conta associada e vencimento
  const listSource = readSource('pages/Investments/InvestmentList.tsx');
  assert.ok(listSource.includes('asset.name'), 'Deve exibir nome do ativo');
  assert.ok(listSource.includes('accountName'), 'Deve exibir conta bancária associada');
  assert.ok(listSource.includes('Vencimento'), 'Deve exibir indicador de data de vencimento');
});

test('AC-090: Criação de Ativo de Investimento @spec:AC-090', () => {
  const validData = {
    name: 'Tesouro Selic 2029',
    bank_account_id: '123e4567-e89b-12d3-a456-426614174000',
    due_date: '2029-03-01',
  };

  const parsed = investmentAssetSchema.safeParse(validData);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data?.name, 'Tesouro Selic 2029');
  assert.equal(parsed.data?.bank_account_id, '123e4567-e89b-12d3-a456-426614174000');

  assert.equal(typeof investmentAssetService.createAsset, 'function');
});

test('AC-091: Edição de Ativo de Investimento @spec:AC-091', () => {
  const pageSource = readSource('pages/Investments/index.tsx');
  assert.ok(pageSource.includes('handleOpenEdit'), 'Deve possuir handler para abrir edição');
  assert.ok(pageSource.includes('updateMutation'), 'Deve chamar mutation de atualização');

  assert.equal(typeof investmentAssetService.updateAsset, 'function');
});

test('AC-092: Exclusão de Ativo de Investimento @spec:AC-092', () => {
  const alertSource = readSource('pages/Investments/InvestmentDeleteAlert.tsx');
  assert.ok(alertSource.includes('Tem certeza que deseja remover o ativo'), 'Deve exibir diálogo de confirmação');

  const pageSource = readSource('pages/Investments/index.tsx');
  assert.ok(pageSource.includes('deleteMutation'), 'Deve chamar mutation de exclusão');

  assert.equal(typeof investmentAssetService.deleteAsset, 'function');
});

test('AC-093: Validação de Nome Inválido @spec:AC-093', () => {
  const invalidData = {
    name: 'A',
    bank_account_id: '123e4567-e89b-12d3-a456-426614174000',
  };

  const parsed = investmentAssetSchema.safeParse(invalidData);
  assert.equal(parsed.success, false);
  const errorMsg = parsed.error?.errors[0]?.message;
  assert.ok(errorMsg?.includes('2 caracteres'), 'Deve exigir no mínimo 2 caracteres no nome');
});

test('AC-094: Conta Bancária Obrigatória @spec:AC-094', () => {
  const missingAccountData = {
    name: 'CDB XP 110% CDI',
    bank_account_id: '',
  };

  const parsed = investmentAssetSchema.safeParse(missingAccountData);
  assert.equal(parsed.success, false);
  const errorMsg = parsed.error?.errors[0]?.message;
  assert.ok(errorMsg?.includes('obrigatória'), 'Deve informar que a conta bancária é obrigatória');
});

// US-022 — Visualização de Funcionalidades Futuras
test('AC-095: Banner de Em Breve @spec:AC-095', () => {
  const bannerSource = readSource('pages/Investments/PendingFeaturesBanner.tsx');
  assert.ok(
    bannerSource.includes('Movimentações de investimento em breve'),
    'Deve exibir título do banner de novidades'
  );
  assert.ok(
    bannerSource.includes('aportes, resgates, apuração de rendimentos e controle de impostos'),
    'Deve descrever funcionalidades futuras de movimentações'
  );

  const pageSource = readSource('pages/Investments/index.tsx');
  assert.ok(pageSource.includes('<PendingFeaturesBanner />'), 'Página deve incluir o banner');
});
