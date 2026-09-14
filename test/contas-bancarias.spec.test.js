// Testes de spec da feature contas-bancarias
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { bankAccountService } from '../src/services/bankAccount.service.ts';
import { bankAccountSchema } from '../src/schemas/bankAccountSchema.ts';
import { formatCurrency } from '../src/utils/formatCurrency.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-019 — Visualização de contas e saldos
test('AC-081: Listagem das contas e saldos @spec:AC-081', () => {
  // 1. Rota registrada
  const routesSource = readSource('routes/index.tsx');
  assert.ok(routesSource.includes('path="/bank-accounts"'), 'Deve conter rota /bank-accounts');
  assert.ok(routesSource.includes('BankAccountsPage'), 'Deve renderizar BankAccountsPage');

  // 2. Componente AccountCard exibe nome e saldo em moeda
  const cardSource = readSource('components/bank-accounts/AccountCard.tsx');
  assert.ok(cardSource.includes('account.bank_name'), 'Deve exibir nome do banco');
  assert.ok(cardSource.includes('formatCurrency'), 'Deve formatar saldo como moeda');
});

test('AC-082: Destacar saldo negativo @spec:AC-082', () => {
  const cardSource = readSource('components/bank-accounts/AccountCard.tsx');
  assert.ok(cardSource.includes("isNegative ? 'text-rose-600'"), 'Saldo negativo deve ser exibido em vermelho');
  assert.ok(cardSource.includes('Permite saldo negativo'), 'Deve exibir badge informando que permite saldo negativo');
  assert.ok(cardSource.includes('account.allow_negative_balance'), 'Deve verificar permissão de saldo negativo');
});

test('AC-083: Totalizador geral de saldos @spec:AC-083', () => {
  const totalizerSource = readSource('components/bank-accounts/AccountsTotalizer.tsx');
  assert.ok(totalizerSource.includes('formatCurrency(total)'), 'Deve formatar saldo totalizador');
  assert.ok(totalizerSource.includes('Saldo Consolidado em Contas'), 'Deve exibir título do saldo consolidado');

  const pageSource = readSource('pages/BankAccountsPage.tsx');
  assert.ok(pageSource.includes('<AccountsTotalizer'), 'Página deve posicionar o totalizador');
  assert.ok(pageSource.includes('totalBalances'), 'Deve alimentar com totalBalances');
});

// US-020 — Gerenciamento de contas bancárias
test('AC-084: Criar nova conta @spec:AC-084', () => {
  // Schema aceita dados válidos
  const validData = {
    bank_name: 'Nubank PJ',
    balance: 1500,
    allow_negative_balance: true,
  };

  const parsed = bankAccountSchema.safeParse(validData);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data?.bank_name, 'Nubank PJ');
  assert.equal(parsed.data?.balance, 1500);
  assert.equal(parsed.data?.allow_negative_balance, true);

  const serviceSource = readSource('services/bankAccount.service.ts');
  assert.ok(serviceSource.includes('/bank-account/register'), 'Deve chamar endpoint de cadastro');
});

test('AC-085: Validação de regras na criação @spec:AC-085', () => {
  // Nome com menos de 2 caracteres
  const invalidName = bankAccountSchema.safeParse({
    bank_name: 'A',
    balance: 100,
    allow_negative_balance: false,
  });
  assert.equal(invalidName.success, false);
  const err = invalidName.error?.issues.find((i) => i.path.includes('bank_name'));
  assert.ok(err?.message.includes('pelo menos 2 caracteres'));

  // Form exibe mensagem inline
  const formSource = readSource('components/bank-accounts/AccountFormModal.tsx');
  assert.ok(formSource.includes('errors.bank_name'), 'Formulário deve renderizar mensagem de erro inline');
});

test('AC-086: Editar conta existente e ajuste de saldo @spec:AC-086', () => {
  const formSource = readSource('components/bank-accounts/AccountFormModal.tsx');
  assert.ok(formSource.includes('Aviso de Conciliação'), 'Deve conter aviso explícito de conciliação ao alterar saldo');
  assert.ok(formSource.includes('Alterar o valor de saldo diretamente ajustará o total sem criar lançamentos'), 'Deve alertar sobre histórico');

  const mutationSource = readSource('hooks/useBankAccountMutations.ts');
  assert.ok(mutationSource.includes('updateBankAccount'), 'Deve expor updateBankAccount');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })"), 'Deve invalidar cache após atualização');

  const serviceSource = readSource('services/bankAccount.service.ts');
  assert.ok(serviceSource.includes('/bank-account/update/${id}'), 'Deve disparar PATCH para atualizar conta');
});

test('AC-087: Excluir conta com confirmação e tratamento de vínculos @spec:AC-087', () => {
  const modalSource = readSource('components/bank-accounts/DeleteConfirmModal.tsx');
  assert.ok(modalSource.includes('onConfirm'), 'Deve exigir confirmação');
  assert.ok(modalSource.includes('Aviso preventivo'), 'Deve exibir aviso preventivo sobre transações vinculadas');
  assert.ok(modalSource.includes('Transfira ou remova as movimentações e cartões vinculados a esta conta antes de excluí-la'), 'Deve orientar em caso de recusa');

  const pageSource = readSource('pages/BankAccountsPage.tsx');
  assert.ok(pageSource.includes('deleteMutation.mutateAsync'), 'Página deve disparar mutação de exclusão');
  assert.ok(pageSource.includes('setDeleteError'), 'Página deve capturar erro de transações vinculadas');
});

test('AC-088: Cancelamento da exclusão @spec:AC-088', () => {
  const modalSource = readSource('components/bank-accounts/DeleteConfirmModal.tsx');
  assert.ok(modalSource.includes('onClick={onClose}'), 'Botão cancelar deve acionar onClose');
  assert.ok(modalSource.includes('Cancelar'), 'Deve conter botão Cancelar');

  const pageSource = readSource('pages/BankAccountsPage.tsx');
  assert.ok(pageSource.includes('setDeletingAccount(null)'), 'Ao cancelar deve fechar o modal mantendo conta na lista');
});
