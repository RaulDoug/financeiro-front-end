// Testes de spec da feature dashboard
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { formatCurrency } from '../src/utils/formatCurrency.ts';
import { formatDate, resolveTransactionDate } from '../src/utils/formatDate.ts';
import { useTransactionModalStore } from '../src/stores/transactionModal.store.ts';
import { DASHBOARD_QUERY_KEYS } from '../src/hooks/useDashboardData.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-008 — Visão geral da saúde financeira
test('AC-029: Cartões de KPI Principais @spec:AC-029', () => {
  const summary = {
    completedIncomes: 5000,
    completedExpenses: 1800,
    pendingIncomes: 1200,
    pendingExpenses: 650,
    totalBalance: 8500,
    monthForecast: 9050,
  };

  // Formatação correta dos 4 KPIs principais
  assert.equal(formatCurrency(summary.totalBalance), 'R$\u00a08.500,00');
  assert.equal(formatCurrency(summary.completedIncomes), 'R$\u00a05.000,00');
  assert.equal(formatCurrency(summary.completedExpenses), 'R$\u00a01.800,00');
  assert.equal(formatCurrency(summary.monthForecast), 'R$\u00a09.050,00');

  // Verifica contrato visual do componente KpiCards
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');
  assert.ok(kpiSource.includes('totalBalance'), 'Deve possuir card para Saldo Total');
  assert.ok(kpiSource.includes('completedIncomes'), 'Deve possuir card para Entradas Realizadas');
  assert.ok(kpiSource.includes('completedExpenses'), 'Deve possuir card para Saídas Realizadas');
  assert.ok(kpiSource.includes('monthForecast'), 'Deve possuir card para Sobra Projetada');
});

test('AC-030: Saldos das Contas @spec:AC-030', () => {
  const accounts = [
    { id: '1', bank_name: 'Nubank', balance: 3500 },
    { id: '2', bank_name: 'Bradesco', balance: -150 },
  ];
  const totalBalances = 3350;

  assert.equal(formatCurrency(totalBalances), 'R$\u00a03.350,00');
  assert.equal(formatCurrency(accounts[0].balance), 'R$\u00a03.500,00');
  assert.equal(formatCurrency(accounts[1].balance), '-R$\u00a0150,00');

  const source = readSource('pages/Dashboard/components/AccountBalances.tsx');
  assert.ok(source.includes('Saldos por Conta'), 'Deve exibir título de saldos');
  assert.ok(source.includes('totalBalances'), 'Deve exibir totalizador');
  assert.ok(source.includes('text-rose-600'), 'Deve destacar saldo negativo em vermelho');
});

test('AC-031: Resumo de Cartões de Crédito @spec:AC-031', () => {
  const card = {
    pay_method_id: 'card-1',
    name: 'Nubank Platinum',
    credit_limit: 5000,
    used_credit_limit: 1200,
    available_limit: 3800,
    current_invoice_total: 450,
  };

  assert.equal(formatCurrency(card.available_limit), 'R$\u00a03.800,00');
  assert.equal(formatCurrency(card.current_invoice_total), 'R$\u00a0450,00');

  const source = readSource('pages/Dashboard/components/CreditCardSummary.tsx');
  assert.ok(source.includes('Cartões de Crédito'), 'Deve conter cabeçalho de cartões');
  assert.ok(source.includes('available_limit'), 'Deve exibir limite disponível');
  assert.ok(source.includes('current_invoice_total'), 'Deve exibir fatura atual');
});

test('AC-032: Estado vazio para KPIs @spec:AC-032', () => {
  // Com valores indefinidos ou vazios, formatCurrency e KpiCards retornam R$ 0,00 sem erros
  assert.equal(formatCurrency(undefined), 'R$\u00a00,00');
  assert.equal(formatCurrency(null), 'R$\u00a00,00');
  assert.equal(formatCurrency(0), 'R$\u00a00,00');

  const source = readSource('pages/Dashboard/components/KpiCards.tsx');
  assert.ok(source.includes('summary?.totalBalance ?? 0'), 'Trata valor indefinido graciosamente');
  assert.ok(source.includes('summary?.completedIncomes ?? 0'), 'Trata entradas vazias');
  assert.ok(source.includes('summary?.completedExpenses ?? 0'), 'Trata saídas vazias');
  assert.ok(source.includes('summary?.monthForecast ?? 0'), 'Trata sobra vazia');
});

test('AC-033: Lista de transações recentes @spec:AC-033', () => {
  const transactions = [
    { id: '1', description: 'Supermercado', value: 150, type: 'expenses', due_date: '2026-03-01' },
    { id: '2', description: 'Salário', value: 5000, type: 'incomings', payment_date: '2026-03-10' },
    { id: '3', description: 'Café', value: 10, type: 'expenses', purchase_date: '2026-03-05' },
    { id: '4', description: 'Internet', value: 120, type: 'expenses', date: '2026-03-02' },
    { id: '5', description: 'Farmácia', value: 80, type: 'expenses', date: '2026-03-08' },
    { id: '6', description: 'Lanche', value: 25, type: 'expenses', date: '2026-02-28' },
  ];

  // Resolução correta da prioridade de data: payment_date -> purchase_date -> due_date -> date
  assert.equal(resolveTransactionDate(transactions[0]), '2026-03-01');
  assert.equal(resolveTransactionDate(transactions[1]), '2026-03-10');
  assert.equal(resolveTransactionDate(transactions[2]), '2026-03-05');

  // Ordenação decrescente por data e limite de 5 itens
  const sorted = [...transactions]
    .sort((a, b) => new Date(resolveTransactionDate(b)).getTime() - new Date(resolveTransactionDate(a)).getTime())
    .slice(0, 5);

  assert.equal(sorted.length, 5);
  assert.equal(sorted[0].id, '2'); // 2026-03-10 (mais recente)
  assert.equal(sorted[1].id, '5'); // 2026-03-08

  const source = readSource('pages/Dashboard/components/RecentTransactions.tsx');
  assert.ok(source.includes('.slice(0, 5)'), 'Deve limitar a exibição a no máximo 5 itens');
});

test('AC-034: Transações recentes vazias @spec:AC-034', () => {
  const source = readSource('pages/Dashboard/components/RecentTransactions.tsx');
  assert.ok(source.includes('Nenhuma transação recente'), 'Deve conter mensagem amigável para lista vazia');
  assert.ok(source.includes('empty-recent-transactions'), 'Deve conter identificador de estado vazio');
});

// US-009 — Análise gráfica de gastos
test('AC-035: Gráfico de Receitas vs Despesas (Barras com seletor de ano) @spec:AC-035', () => {
  const yearly = [
    { month: 1, income: 4800, expense: 2100, balance: 2700 },
    { month: 2, income: 5000, expense: 1900, balance: 3100 },
  ];

  // Gera array de 12 meses
  const formatted = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const found = yearly.find((d) => d.month === monthNum);
    return {
      month: monthNum,
      Receitas: found ? Number(found.income) : 0,
      Despesas: found ? Number(found.expense) : 0,
    };
  });

  assert.equal(formatted.length, 12);
  assert.equal(formatted[0].Receitas, 4800);
  assert.equal(formatted[0].Despesas, 2100);
  assert.equal(formatted[2].Receitas, 0);

  const source = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');
  assert.ok(source.includes('year-selector'), 'Deve ter seletor de ano');
  assert.ok(source.includes('selectedYear'), 'Deve exibir ano selecionado');
  assert.ok(source.includes('BarChart'), 'Deve usar BarChart do Recharts');
});

test('AC-036: Gráfico de Despesas por Categoria (Rosca) @spec:AC-036', () => {
  const categories = [
    { category_id: '1', category_name: 'Moradia', total_amount: 1500, percentage: 50 },
    { category_id: '2', category_name: 'Alimentação', total_amount: 900, percentage: 30 },
    { category_id: '3', category_name: 'Transporte', total_amount: 600, percentage: 20 },
  ];

  const total = categories.reduce((sum, c) => sum + c.total_amount, 0);
  assert.equal(total, 3000);

  const source = readSource('pages/Dashboard/components/CategoryExpenseChart.tsx');
  assert.ok(source.includes('PieChart'), 'Deve usar PieChart do Recharts');
  assert.ok(source.includes('innerRadius'), 'Deve ter innerRadius configurado como rosca/donut');
  assert.ok(source.includes('Despesas por Categoria'), 'Deve ter título correspondente');
});

test('AC-037: Interatividade nos gráficos @spec:AC-037', () => {
  const barSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');
  assert.ok(barSource.includes('<Tooltip'), 'BarChart deve conter Tooltip');
  assert.ok(barSource.includes('formatCurrency'), 'Tooltip do BarChart formata valor monetário');

  const donutSource = readSource('pages/Dashboard/components/CategoryExpenseChart.tsx');
  assert.ok(donutSource.includes('<Tooltip'), 'PieChart deve conter Tooltip');
  assert.ok(donutSource.includes('formatCurrency'), 'Tooltip do PieChart formata valor monetário');
});

test('AC-038: Tratamento de gráficos sem dados @spec:AC-038', () => {
  const barSource = readSource('pages/Dashboard/components/IncomeExpenseChart.tsx');
  assert.ok(
    barSource.includes('Não há dados suficientes para exibição'),
    'Gráfico de barras deve exibir mensagem padrão sem dados'
  );

  const donutSource = readSource('pages/Dashboard/components/CategoryExpenseChart.tsx');
  assert.ok(
    donutSource.includes('Não há dados suficientes para exibição'),
    'Gráfico de rosca deve exibir mensagem padrão sem dados'
  );
});

// US-010 — Alertas e Ações Rápidas
test('AC-039: Alertas de Atraso @spec:AC-039', () => {
  const alertItem = {
    id: 'alert-1',
    description: 'Internet Fibra',
    value: 120.0,
    due_date: '2026-03-01',
    type: 'expenses',
    days_overdue: 13,
  };

  assert.equal(formatCurrency(alertItem.value), 'R$\u00a0120,00');
  assert.equal(formatDate(alertItem.due_date), '01/03/2026');

  const source = readSource('pages/Dashboard/components/OverdueAlerts.tsx');
  assert.ok(source.includes('overdue-list'), 'Deve conter lista de alertas');
  assert.ok(source.includes('days_overdue'), 'Deve exibir quantidade de dias em atraso');
  assert.ok(source.includes('em atraso'), 'Deve conter tag de atraso');
});

test('AC-040: Estado "Tudo em dia" @spec:AC-040', () => {
  const source = readSource('pages/Dashboard/components/OverdueAlerts.tsx');
  assert.ok(source.includes('all-in-order-state'), 'Deve conter elemento de estado em dia');
  assert.ok(source.includes('Tudo em dia!'), 'Deve conter mensagem positiva "Tudo em dia!"');
});

test('AC-041: Ações rápidas de lançamento (Receita/Despesa) @spec:AC-041', () => {
  const store = useTransactionModalStore.getState();

  // Abertura para receitas
  store.openModal('incomings');
  assert.equal(useTransactionModalStore.getState().isOpen, true);
  assert.equal(useTransactionModalStore.getState().defaultType, 'incomings');

  // Abertura para despesas
  store.openModal('expenses');
  assert.equal(useTransactionModalStore.getState().isOpen, true);
  assert.equal(useTransactionModalStore.getState().defaultType, 'expenses');

  store.closeModal();
  assert.equal(useTransactionModalStore.getState().isOpen, false);

  const source = readSource('pages/Dashboard/components/QuickActions.tsx');
  assert.ok(source.includes('+ Nova Receita'), 'Deve ter botão Nova Receita');
  assert.ok(source.includes('+ Nova Despesa'), 'Deve ter botão Nova Despesa');
  assert.ok(source.includes("openModal('incomings')"), 'Configura abertura de receitas');
  assert.ok(source.includes("openModal('expenses')"), 'Configura abertura de despesas');
});

test('AC-042: Ação rápida de transferência @spec:AC-042', () => {
  const store = useTransactionModalStore.getState();

  // Abertura para transferência
  store.openModal('transfers');
  assert.equal(useTransactionModalStore.getState().isOpen, true);
  assert.equal(useTransactionModalStore.getState().defaultType, 'transfers');

  store.closeModal();
  assert.equal(useTransactionModalStore.getState().isOpen, false);

  const source = readSource('pages/Dashboard/components/QuickActions.tsx');
  assert.ok(source.includes('⇄ Transferência'), 'Deve ter botão Transferência');
  assert.ok(source.includes("openModal('transfers')"), 'Configura abertura de transferências');
});
