// Testes de spec da feature configuracoes
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  categorySchema,
  counterpartySchema,
  payMethodSchema,
  walletNameSchema,
} from '../src/schemas/settingsSchemas.ts';
import { categoryService } from '../src/services/category.service.ts';
import { counterpartyService } from '../src/services/counterparty.service.ts';
import { payMethodService } from '../src/services/payMethod.service.ts';
import { walletService } from '../src/services/wallet.service.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-026 — Gerenciamento de Categorias
test('AC-106: Listagem em Abas com Contadores @spec:AC-106', () => {
  const pageSource = readSource('pages/Settings/CategoriesSettings.tsx');
  assert.ok(pageSource.includes('Todas'), 'Deve possuir aba Todas');
  assert.ok(pageSource.includes('Receitas'), 'Deve possuir aba Receitas');
  assert.ok(pageSource.includes('Despesas'), 'Deve possuir aba Despesas');
  assert.ok(pageSource.includes('counts.all'), 'Deve exibir contador de Todas');
  assert.ok(pageSource.includes('counts.incomings'), 'Deve exibir contador de Receitas');
  assert.ok(pageSource.includes('counts.expenses'), 'Deve exibir contador de Despesas');
  assert.ok(pageSource.includes('searchQuery'), 'Deve possuir campo de busca rápida');
  assert.ok(pageSource.includes('filteredCategories'), 'Deve filtrar lista conforme aba e busca');
});

test('AC-107: Criação de Categoria @spec:AC-107', () => {
  // Schema valida nome e tipo
  const validIncome = categorySchema.safeParse({ name: 'Salário', type: 'incomings' });
  assert.equal(validIncome.success, true);
  assert.equal(validIncome.data?.name, 'Salário');
  assert.equal(validIncome.data?.type, 'incomings');

  const validExpense = categorySchema.safeParse({ name: 'Supermercado', type: 'expenses' });
  assert.equal(validExpense.success, true);

  const invalid = categorySchema.safeParse({ name: 'A', type: 'invalid' });
  assert.equal(invalid.success, false);

  assert.equal(typeof categoryService.createCategory, 'function');
});

test('AC-108: Restrição de Exclusão Padrão @spec:AC-108', () => {
  const pageSource = readSource('pages/Settings/CategoriesSettings.tsx');
  assert.ok(
    pageSource.includes('Não foi possível excluir a categoria. Ela pode estar em uso'),
    'Deve capturar erro e informar amigavelmente que a categoria está em uso ou protegida'
  );
  assert.equal(typeof categoryService.deleteCategory, 'function');
});

// US-027 — Gerenciamento de Contrapartes
test('AC-109: Listagem em Abas de Contrapartes @spec:AC-109', () => {
  const pageSource = readSource('pages/Settings/CounterpartiesSettings.tsx');
  assert.ok(pageSource.includes('Todos'), 'Deve possuir aba Todos');
  assert.ok(pageSource.includes('Pagadores'), 'Deve possuir aba Pagadores');
  assert.ok(pageSource.includes('Recebedores'), 'Deve possuir aba Recebedores');
  assert.ok(pageSource.includes('counts.all'), 'Deve exibir contador de Todos');
  assert.ok(pageSource.includes('counts.payer'), 'Deve exibir contador de Pagadores');
  assert.ok(pageSource.includes('counts.payee'), 'Deve exibir contador de Recebedores');
  assert.ok(pageSource.includes('searchQuery'), 'Deve possuir campo de busca rápida');
});

test('AC-110: Criação e Edição de Contraparte @spec:AC-110', () => {
  const validData = counterpartySchema.safeParse({ name: 'Amazon Prime', type: 'payee' });
  assert.equal(validData.success, true);
  assert.equal(validData.data?.name, 'Amazon Prime');
  assert.equal(validData.data?.type, 'payee');

  assert.equal(typeof counterpartyService.createCounterparty, 'function');
  assert.equal(typeof counterpartyService.updateCounterparty, 'function');

  const pageSource = readSource('pages/Settings/CounterpartiesSettings.tsx');
  assert.ok(pageSource.includes('handleSave'), 'Deve atualizar lista na hora');
});

// US-028 — Gerenciamento de Métodos de Pagamento
test('AC-111: Indicador de Cartão de Crédito @spec:AC-111', () => {
  const pageSource = readSource('pages/Settings/PayMethodsSettings.tsx');
  assert.ok(pageSource.includes('Cartão de Crédito'), 'Deve exibir badge ou texto de Cartão de Crédito');
  assert.ok(pageSource.includes('CreditCard'), 'Deve exibir ícone visual de Cartão');
  assert.ok(pageSource.includes('pm.credit_card'), 'Deve testar propriedade credit_card');
});

test('AC-112: Bloqueio de Edição do Tipo do Cartão @spec:AC-112', () => {
  const modalSource = readSource('pages/Settings/PayMethodModal.tsx');
  assert.ok(modalSource.includes('disabled={isEditing}'), 'Checkbox deve estar desabilitado em modo edição');
  assert.ok(modalSource.includes('O tipo de cartão não pode ser alterado após a criação'), 'Deve avisar que é somente leitura');
});

test('AC-113: Criação de Método de Pagamento @spec:AC-113', () => {
  const validData = payMethodSchema.safeParse({ name: 'Cartão Nubank', credit_card: true });
  assert.equal(validData.success, true);
  assert.equal(validData.data?.credit_card, true);

  assert.equal(typeof payMethodService.registerPayMethod, 'function');
});

// US-029 — Gerenciamento da Carteira
test('AC-114: Renomear Carteira @spec:AC-114', () => {
  const validName = walletNameSchema.safeParse({ name: 'Carteira Principal' });
  assert.equal(validName.success, true);

  const hookSource = readSource('hooks/useWalletSettings.ts');
  assert.ok(hookSource.includes('updateWalletName'), 'Hook deve implementar renomeação');
  assert.ok(hookSource.includes('setWallets'), 'Deve atualizar imediatamente a lista de carteiras no store');

  assert.equal(typeof walletService.updateWallet, 'function');
});

test('AC-115: Exclusão Crítica com Digitação do Nome (Owner Only) @spec:AC-115', () => {
  const alertSource = readSource('pages/Settings/WalletDeleteAlert.tsx');
  assert.ok(alertSource.includes('typedName.trim() === walletName.trim()'), 'Deve exigir digitação exata do nome da carteira');
  assert.ok(alertSource.includes('disabled={!isMatching'), 'Botão de exclusão deve ficar desabilitado até nome coincidir');

  const settingsSource = readSource('pages/Settings/WalletSettings.tsx');
  assert.ok(settingsSource.includes('isOwner'), 'Deve verificar permissão de proprietário (owner)');
  assert.ok(settingsSource.includes('navigate('), 'Deve redirecionar após confirmação');
});

// US-030 — Gerenciamento de Membros (Placeholder)
test('AC-116: Interface de Equipe @spec:AC-116', () => {
  const pageSource = readSource('pages/Settings/MembersSettings.tsx');
  assert.ok(pageSource.includes('Em Breve'), 'Deve exibir badge Em Breve');
  assert.ok(pageSource.includes('Compartilhamento de Carteiras & Gestão de Equipe'), 'Deve exibir aviso de equipe futura');
});

test('AC-117: Navegação das Configurações @spec:AC-117', () => {
  const sidebarSource = readSource('pages/Settings/SettingsSidebar.tsx');
  assert.ok(sidebarSource.includes('/settings/general'), 'Deve conter link Geral (Carteira)');
  assert.ok(sidebarSource.includes('/settings/categories'), 'Deve conter link Categorias');
  assert.ok(sidebarSource.includes('/settings/counterparties'), 'Deve conter link Contrapartes');
  assert.ok(sidebarSource.includes('/settings/pay-methods'), 'Deve conter link Métodos de Pagamento');
  assert.ok(sidebarSource.includes('/settings/members'), 'Deve conter link Membros');

  const routesSource = readSource('routes/index.tsx');
  assert.ok(routesSource.includes('path="/settings"'), 'Rota /settings deve estar registrada');

  // Checagem de display_id nos componentes
  const catSource = readSource('pages/Settings/CategoriesSettings.tsx');
  assert.ok(catSource.includes('display_id'), 'Deve utilizar display_id nas categorias');

  const cpSource = readSource('pages/Settings/CounterpartiesSettings.tsx');
  assert.ok(cpSource.includes('display_id'), 'Deve utilizar display_id nas contrapartes');

  const pmSource = readSource('pages/Settings/PayMethodsSettings.tsx');
  assert.ok(pmSource.includes('display_id'), 'Deve utilizar display_id nos métodos de pagamento');
});

test('AC-289: Backdrop escuro cobrindo 100% da tela e centralização de viewport via Portal em Configurações @spec:AC-289', () => {
  const catModal = readSource('pages/Settings/CategoryModal.tsx');
  const cpModal = readSource('pages/Settings/CounterpartyModal.tsx');
  const pmModal = readSource('pages/Settings/PayMethodModal.tsx');
  const walletModal = readSource('pages/Settings/WalletDeleteAlert.tsx');

  assert.ok(
    catModal.includes('createPortal') && catModal.includes('document.body'),
    'CategoryModal deve renderizar via createPortal no document.body'
  );
  assert.ok(
    cpModal.includes('createPortal') && cpModal.includes('document.body'),
    'CounterpartyModal deve renderizar via createPortal no document.body'
  );
  assert.ok(
    pmModal.includes('createPortal') && pmModal.includes('document.body'),
    'PayMethodModal deve renderizar via createPortal no document.body'
  );
  assert.ok(
    walletModal.includes('createPortal') && walletModal.includes('document.body'),
    'WalletDeleteAlert deve renderizar via createPortal no document.body'
  );
});
