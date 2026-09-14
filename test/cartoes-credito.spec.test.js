// Testes de spec da feature cartoes-credito
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { creditCardService } from '../src/services/api/creditCards.ts';
import { creditCardSchema } from '../src/schemas/creditCardSchema.ts';
import { formatCurrency } from '../src/utils/formatCurrency.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-016 — Visualização de cartões e limites
test('AC-069: Listagem dos cartões @spec:AC-069', () => {
  // 1. Rota registrada
  const routesSource = readSource('routes/index.tsx');
  assert.ok(routesSource.includes('path="/credit-cards"'), 'Deve conter rota /credit-cards');
  assert.ok(routesSource.includes('CreditCardsPage'), 'Deve renderizar CreditCardsPage');

  // 2. Componente CreditCardVisual exibe todos os atributos requeridos
  const visualSource = readSource('components/credit-cards/CreditCardVisual.tsx');
  assert.ok(visualSource.includes('card.name'), 'Deve exibir nome do cartão');
  assert.ok(visualSource.includes('card.last_four_digits'), 'Deve exibir últimos 4 dígitos');
  assert.ok(visualSource.includes('card.due_day'), 'Deve exibir dia de vencimento');
  assert.ok(visualSource.includes('card.closing_day'), 'Deve exibir dia de fechamento');
  assert.ok(visualSource.includes('card.credit_limit') || visualSource.includes('total'), 'Deve exibir limite total');
  assert.ok(visualSource.includes('used'), 'Deve exibir limite utilizado');
});

test('AC-070: Indicador de limite saudável (Verde) @spec:AC-070', () => {
  // Limite utilizado < 60%
  const calculation = creditCardService.calculateLimitStatus(500, 1000); // 50%
  assert.equal(calculation.status, 'healthy');
  assert.equal(calculation.barColor, '#10b981');

  const limitBarSource = readSource('components/credit-cards/LimitBar.tsx');
  assert.ok(limitBarSource.includes('bg-emerald-500'), 'Deve aplicar cor verde para limite saudável');
});

test('AC-071: Indicador de limite em atenção (Amarelo) @spec:AC-071', () => {
  // Limite utilizado entre 60% e 80% inclusive
  const calc60 = creditCardService.calculateLimitStatus(600, 1000); // 60%
  assert.equal(calc60.status, 'warning');
  assert.equal(calc60.barColor, '#f59e0b');

  const calc80 = creditCardService.calculateLimitStatus(800, 1000); // 80%
  assert.equal(calc80.status, 'warning');
  assert.equal(calc80.barColor, '#f59e0b');

  const limitBarSource = readSource('components/credit-cards/LimitBar.tsx');
  assert.ok(limitBarSource.includes('bg-amber-500'), 'Deve aplicar cor amarela para limite em atenção');
});

test('AC-072: Indicador de limite crítico (Vermelho) @spec:AC-072', () => {
  // Limite utilizado > 80%
  const calculation = creditCardService.calculateLimitStatus(850, 1000); // 85%
  assert.equal(calculation.status, 'critical');
  assert.equal(calculation.barColor, '#ef4444');

  const limitBarSource = readSource('components/credit-cards/LimitBar.tsx');
  assert.ok(limitBarSource.includes('bg-rose-500'), 'Deve aplicar cor vermelha para limite crítico');
});

// US-017 — Acompanhamento da fatura e transações
test('AC-073: Resumo da fatura com navegação por mês @spec:AC-073', () => {
  const selectorSource = readSource('components/credit-cards/InvoiceMonthSelector.tsx');
  assert.ok(selectorSource.includes('handlePrev'), 'Deve possuir navegação para mês anterior');
  assert.ok(selectorSource.includes('handleNext'), 'Deve possuir navegação para próximo mês');

  const summarySource = readSource('components/credit-cards/InvoiceSummary.tsx');
  assert.ok(summarySource.includes('startDate') && summarySource.includes('endDate'), 'Deve calcular período de datas');
  assert.ok(summarySource.includes('useCreditCardSummary'), 'Deve invocar resumo de fatura por período');
  assert.ok(summarySource.includes('invoiceTotal') || summarySource.includes('current_invoice_total'), 'Deve exibir total da fatura');
  assert.ok(summarySource.includes('availableLimit') || summarySource.includes('available_limit'), 'Deve exibir limite disponível');
});

test('AC-074: Lista de transações da fatura @spec:AC-074', () => {
  const listSource = readSource('components/credit-cards/TransactionList.tsx');
  assert.ok(listSource.includes('tx.description'), 'Deve exibir descrição da transação');
  assert.ok(listSource.includes('formatDate(tx.due_date)'), 'Deve exibir data da compra');
  assert.ok(listSource.includes('formatCurrency'), 'Deve formatar valor da transação');
});

// US-018 — Cadastro de cartão de crédito
test('AC-075: Cadastro com sucesso @spec:AC-075', () => {
  // Validação Zod com payload completo
  const validData = {
    name: 'Nubank Gold',
    bank_account_id: 'acc-123',
    due_day: 15,
    closing_day: 8,
    last_four_digits: '4321',
    credit_limit: 4500,
  };

  const validation = creditCardSchema.safeParse(validData);
  assert.equal(validation.success, true);

  const serviceSource = readSource('services/api/creditCards.ts');
  assert.ok(serviceSource.includes('credit_card: true'), 'Deve travar credit_card como true na criação');
  assert.ok(serviceSource.includes('/pay-method/register'), 'Deve chamar endpoint de cadastro');
});

test('AC-076: Validação de campos obrigatórios @spec:AC-076', () => {
  // Sem conta bancária
  const noAccount = creditCardSchema.safeParse({
    name: 'Nubank',
    bank_account_id: '',
    due_day: 10,
    closing_day: 3,
    last_four_digits: '1234',
    credit_limit: 1000,
  });
  assert.equal(noAccount.success, false);
  const accError = noAccount.error?.issues.find((i) => i.path.includes('bank_account_id'));
  assert.ok(accError?.message.includes('obrigatória'));

  // Dia de vencimento inválido (> 31)
  const invalidDueDay = creditCardSchema.safeParse({
    name: 'Nubank',
    bank_account_id: 'acc-1',
    due_day: 35,
    closing_day: 3,
    last_four_digits: '1234',
    credit_limit: 1000,
  });
  assert.equal(invalidDueDay.success, false);
  const dueError = invalidDueDay.error?.issues.find((i) => i.path.includes('due_day'));
  assert.ok(dueError?.message.includes('entre 1 e 31'));

  // 4 dígitos com letras
  const invalidDigits = creditCardSchema.safeParse({
    name: 'Nubank',
    bank_account_id: 'acc-1',
    due_day: 10,
    closing_day: 3,
    last_four_digits: '12ab',
    credit_limit: 1000,
  });
  assert.equal(invalidDigits.success, false);
});

test('AC-077: Edição do cartão via menu do card @spec:AC-077', () => {
  const menuSource = readSource('components/credit-cards/CreditCardMenu.tsx');
  assert.ok(menuSource.includes('onEdit()') || menuSource.includes('onEdit'), 'Menu deve conter ação de editar');

  const mutationSource = readSource('hooks/useCreditCardMutations.ts');
  assert.ok(mutationSource.includes('updateCreditCard'), 'Deve expor updateCreditCard');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['credit-cards'] })"), 'Deve invalidar cache após edição');

  const serviceSource = readSource('services/api/creditCards.ts');
  assert.ok(serviceSource.includes('/pay-method/update/${id}'), 'Deve disparar PATCH na rota de update');
});

test('AC-078: Exclusão do cartão via menu do card @spec:AC-078', () => {
  const menuSource = readSource('components/credit-cards/CreditCardMenu.tsx');
  assert.ok(menuSource.includes('onDelete()') || menuSource.includes('onDelete'), 'Menu deve conter ação de excluir');

  const dialogSource = readSource('components/credit-cards/CreditCardDeleteDialog.tsx');
  assert.ok(dialogSource.includes('onConfirm'), 'Diálogo de exclusão deve requerer confirmação');
  assert.ok(dialogSource.includes('Excluir Cartão de Crédito'), 'Diálogo deve exibir título preventivo');

  const mutationSource = readSource('hooks/useCreditCardMutations.ts');
  assert.ok(mutationSource.includes('deleteCreditCard'), 'Deve expor deleteCreditCard');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['credit-cards'] })"), 'Deve invalidar cache após exclusão');

  const serviceSource = readSource('services/api/creditCards.ts');
  assert.ok(serviceSource.includes('/pay-method/delete/${id}'), 'Deve disparar DELETE na rota de delete');
});
