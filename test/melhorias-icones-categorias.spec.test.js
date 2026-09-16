// Testes de spec da feature melhorias-icones-categorias — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-050 — Seleção de Ícone para Categorias e Contrapartes
test('AC-169: Seletor de ícone no formulário de categoria @spec:AC-169', () => {
  const categoryModal = readSource('pages/Settings/CategoryModal.tsx');
  const iconPicker = readSource('components/shared/IconPicker.tsx');

  assert.ok(
    categoryModal.includes('IconPicker') &&
    categoryModal.includes('selectedIcon={icon}') &&
    categoryModal.includes('selectedColor={color}'),
    'CategoryModal deve integrar o componente IconPicker com estado de ícone e cor'
  );
  assert.ok(
    categoryModal.includes('onSubmit({ name: name.trim(), type, icon, color })'),
    'CategoryModal deve repassar icon e color no onSubmit ao salvar categoria'
  );
  assert.ok(
    iconPicker.includes('data-testid="icon-picker-component"') &&
    iconPicker.includes('ICON_LIBRARY'),
    'IconPicker deve disponibilizar a biblioteca de ícones com testid acessível'
  );
});

// US-050 — Seleção de Ícone para Categorias e Contrapartes
test('AC-170: Ícone exibido na listagem de categorias @spec:AC-170', () => {
  const categoriesSettings = readSource('pages/Settings/CategoriesSettings.tsx');

  assert.ok(
    categoriesSettings.includes('renderLucideIcon') &&
    categoriesSettings.includes('data-testid={`category-icon-${cat.id}`}'),
    'CategoriesSettings deve renderizar o ícone visual configurado ao lado do nome da categoria com testid'
  );
});

// US-051 — Seleção de Ícone para Formas de Pagamento
test('AC-171: Seletor de ícone no formulário de forma de pagamento @spec:AC-171', () => {
  const payMethodModal = readSource('pages/Settings/PayMethodModal.tsx');

  assert.ok(
    payMethodModal.includes('IconPicker') &&
    payMethodModal.includes('!isCreditCard'),
    'PayMethodModal deve exibir o IconPicker quando o método não for cartão de crédito'
  );
  assert.ok(
    payMethodModal.includes('icon: isCreditCard ? undefined : icon') &&
    payMethodModal.includes('color: isCreditCard ? undefined : color'),
    'PayMethodModal deve enviar icon e color no payload para métodos de pagamento convencionais'
  );
});

// US-051 — Seleção de Ícone para Formas de Pagamento
test('AC-172: Ícone exibido nos seletores e listagens de formas de pagamento @spec:AC-172', () => {
  const payMethodsSettings = readSource('pages/Settings/PayMethodsSettings.tsx');

  assert.ok(
    payMethodsSettings.includes('renderLucideIcon') &&
    payMethodsSettings.includes('data-testid={`pay-method-icon-${pm.id}`}'),
    'PayMethodsSettings deve exibir o ícone correspondente na listagem com testid específico'
  );
});

// US-052 — Seleção de Bandeira para Cartões de Crédito
test('AC-173: Seletor de bandeira no formulário de cartão @spec:AC-173', () => {
  const creditCardForm = readSource('components/credit-cards/CreditCardForm.tsx');

  assert.ok(
    creditCardForm.includes('data-testid="credit-card-brand-picker"'),
    'CreditCardForm deve renderizar o seletor visual de bandeira com data-testid="credit-card-brand-picker"'
  );
  const brands = ['visa', 'mastercard', 'elo', 'amex', 'hipercard', 'diners', 'outro'];
  brands.forEach((b) => {
    assert.ok(
      creditCardForm.includes(`data-testid={\`brand-option-\${b.id}\`}`) ||
      creditCardForm.includes(`brand-option-${b}`) ||
      creditCardForm.includes(b),
      `CreditCardForm deve conter opção de bandeira para ${b}`
    );
  });
  assert.ok(
    creditCardForm.includes('brand: brand || \'Visa\''),
    'CreditCardForm deve submeter a bandeira selecionada no formulário'
  );
});

// US-052 — Seleção de Bandeira para Cartões de Crédito
test('AC-174: Bandeira exibida no card visual do cartão @spec:AC-174', () => {
  const cardVisual = readSource('components/credit-cards/CreditCardVisual.tsx');

  assert.ok(
    cardVisual.includes('data-testid="credit-card-brand-badge"'),
    'CreditCardVisual deve renderizar badge com a bandeira do cartão'
  );
  assert.ok(
    cardVisual.includes('card.brand') || cardVisual.includes('card.icon'),
    'CreditCardVisual deve extrair a bandeira de card.brand ou card.icon'
  );
});

// US-053 — Auto-detecção de Banco por Nome para Contas Bancárias
test('AC-175: Auto-detecção de banco pelo nome da conta @spec:AC-175', async () => {
  const { detectBankByName } = await import('../src/lib/bankDetector.ts');

  assert.strictEqual(detectBankByName('Nubank Raul')?.id, 'nubank');
  assert.strictEqual(detectBankByName('Conta Corrente Itaú')?.id, 'itau');
  assert.strictEqual(detectBankByName('Bradesco Prime')?.id, 'bradesco');
  assert.strictEqual(detectBankByName('Caixa Econômica')?.id, 'caixa');
  assert.strictEqual(detectBankByName('Banco Inter')?.id, 'inter');
  assert.strictEqual(detectBankByName('C6 Bank')?.id, 'c6');
  assert.strictEqual(detectBankByName('PicPay Saldo')?.id, 'picpay');
  assert.strictEqual(detectBankByName('XP Investimentos')?.id, 'xp');
  assert.strictEqual(detectBankByName('Carteira Pessoal')?.id, undefined);
});

// US-053 — Auto-detecção de Banco por Nome para Contas Bancárias
test('AC-176: Visualização prévia do banco auto-detectado @spec:AC-176', () => {
  const bankPicker = readSource('components/shared/BankPicker.tsx');
  const accountModal = readSource('components/bank-accounts/AccountFormModal.tsx');

  assert.ok(
    bankPicker.includes('data-testid="auto-detected-bank-preview"'),
    'BankPicker deve possuir banner de pré-visualização de banco detectado automaticamente'
  );
  assert.ok(
    accountModal.includes('detectBankByName') &&
    accountModal.includes('autoDetectedBank={autoDetected}'),
    'AccountFormModal deve disparar detectBankByName e repassar o banco detectado ao BankPicker'
  );
});

// US-053 — Auto-detecção de Banco por Nome para Contas Bancárias
test('AC-177: Seleção manual de banco/ícone para contas bancárias @spec:AC-177', () => {
  const bankPicker = readSource('components/shared/BankPicker.tsx');

  assert.ok(
    bankPicker.includes('data-testid="banks-grid-selection"') &&
    bankPicker.includes('data-testid={`bank-select-${bank.id}`}'),
    'BankPicker deve apresentar grade de seleção manual de bancos brasileiros'
  );
});

// US-053 — Auto-detecção de Banco por Nome para Contas Bancárias
test('AC-178: Ícone e cores do banco exibidos na conta @spec:AC-178', () => {
  const accountCard = readSource('components/bank-accounts/AccountCard.tsx');
  const accountBalances = readSource('pages/Dashboard/components/AccountBalances.tsx');

  assert.ok(
    accountCard.includes('data-testid={`bank-icon-${account.id}`}') &&
    accountCard.includes('effectiveColor'),
    'AccountCard deve exibir o ícone com a cor associada ao banco'
  );
  assert.ok(
    accountBalances.includes('detectBankByName') &&
    accountBalances.includes('color'),
    'Dashboard AccountBalances deve exibir a cor do banco'
  );
});

// US-054 — Mobile: Lançamento de Transação com Layout Rápido
test('AC-179: Layout mobile de lançamento seguindo padrão "Ágil" @spec:AC-179', () => {
  const txModal = readSource('components/transactions/TransactionModal.tsx');
  const quickEntry = readSource('components/transactions/MobileQuickEntry.tsx');

  assert.ok(
    txModal.includes('isMobile && !initialData') &&
    txModal.includes('MobileQuickEntry'),
    'TransactionModal deve renderizar MobileQuickEntry em viewport < 768px'
  );
  assert.ok(
    (quickEntry.includes('quick-entry-keypad') || quickEntry.includes('mobile-quick-keypad')) &&
    (quickEntry.includes('btn-quick-entry-save') || quickEntry.includes('mobile-quick-save')),
    'MobileQuickEntry deve conter teclado numérico customizado e botão de salvar'
  );
});

// US-054 — Mobile: Lançamento de Transação com Layout Rápido
test('AC-180: Acessibilidade dos campos no layout mobile ágil @spec:AC-180', () => {
  const quickEntry = readSource('components/transactions/MobileQuickEntry.tsx');

  assert.ok(
    (quickEntry.includes('chip-category') || quickEntry.includes('quick-chip-category')) &&
    (quickEntry.includes('chip-account') || quickEntry.includes('quick-chip-account')) &&
    (quickEntry.includes('chip-date') || quickEntry.includes('quick-chip-date')),
    'MobileQuickEntry deve possuir chips de acesso rápido para categoria, conta e data'
  );
  assert.ok(
    quickEntry.includes('activePicker') &&
    quickEntry.includes('setActivePicker'),
    'MobileQuickEntry deve alternar pickers sem quebrar o layout principal'
  );
});
