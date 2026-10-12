// Testes de spec da feature orcamentos
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  createBudgetFormSchema,
  updateBudgetFormSchema,
} from '../src/schemas/budgetSchema.ts';
import { getProgressColor } from '../src/utils/budgetProgress.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-105 — Visualização do painel de orçamentos e resumo de metas
test('AC-374: Navegação e acesso à aba de orçamentos @spec:AC-374', () => {
  // 1. Rota canônica /budgets e alias /orcamentos registradas no router
  const routesSource = readSource('routes/index.tsx');
  assert.ok(
    routesSource.includes('path="/budgets"'),
    'Deve conter rota /budgets'
  );
  assert.ok(
    routesSource.includes('path="/orcamentos"'),
    'Deve conter rota /orcamentos'
  );
  assert.ok(
    routesSource.includes('BudgetsPage'),
    'Deve importar e renderizar BudgetsPage'
  );

  // 2. Menu desktop (Sidebar) e AppLayout
  const sidebarSource = readSource('components/layout/Sidebar.tsx');
  assert.ok(
    sidebarSource.includes("label: 'Orçamentos', href: '/budgets'"),
    'Sidebar deve conter link de Orçamentos'
  );

  const appLayoutSource = readSource('layouts/AppLayout.tsx');
  assert.ok(
    appLayoutSource.includes("label: 'Orçamentos', href: '/budgets'"),
    'AppLayout deve conter link no APP_SHELL_NAV_ITEMS'
  );

  // 3. Menu mobile drawer (MoreMenuModal) e ativação no MobileNav
  const moreMenuSource = readSource('components/layout/MoreMenuModal.tsx');
  assert.ok(
    moreMenuSource.includes("label: 'Orçamentos e Metas', href: '/budgets'"),
    'Menu Mais mobile deve conter link de Orçamentos'
  );

  const mobileNavSource = readSource('components/layout/MobileNav.tsx');
  assert.ok(
    mobileNavSource.includes("'/budgets'"),
    'MobileNav deve considerar /budgets como rota ativa do menu Mais'
  );
});

test('AC-375: Indicadores de resumo de caixa e metas (KPI cards) @spec:AC-375', () => {
  const summarySource = readSource('components/budgets/BudgetSummaryCards.tsx');

  // Os 4 cards de KPI essenciais
  assert.ok(
    summarySource.includes('Total Orçado'),
    'Deve conter card de Total Orçado'
  );
  assert.ok(
    summarySource.includes('Total Gasto'),
    'Deve conter card de Total Gasto'
  );
  assert.ok(
    summarySource.includes('Margem Restante'),
    'Deve conter card de Margem Restante'
  );
  assert.ok(
    summarySource.includes('Previsão de Sobra'),
    'Deve conter card de Previsão de Sobra'
  );
  assert.ok(
    summarySource.includes('forecasted_savings_if_budget_kept'),
    'Deve calcular a previsão de sobra do backend'
  );
  assert.ok(
    summarySource.includes('Projeção calculada subtraindo o total das suas metas'),
    'Deve exibir tooltip explicativo de sobra no caixa'
  );
});

test('AC-376: Listagem visual de categorias com barra de progresso @spec:AC-376', () => {
  // 1. Lógica de cores por faixa de consumo
  const green = getProgressColor(50);
  assert.equal(green.barClass, 'bg-emerald-500');
  assert.equal(green.statusLabel, 'Saudável');

  const yellow = getProgressColor(85);
  assert.equal(yellow.barClass, 'bg-amber-500');
  assert.equal(yellow.statusLabel, 'Atenção');

  const red = getProgressColor(110);
  assert.equal(red.barClass, 'bg-rose-500');
  assert.equal(red.statusLabel, 'Estourado');

  // 2. Componente de card de categoria
  const cardSource = readSource('components/budgets/BudgetCategoryCard.tsx');
  assert.ok(
    cardSource.includes('budget.category_name'),
    'Deve exibir nome da categoria'
  );
  assert.ok(
    cardSource.includes('Estourado em'),
    'Deve exibir aviso quando estourado'
  );
  assert.ok(
    cardSource.includes('Restante:'),
    'Deve exibir valor restante quando dentro do orçamento'
  );
  assert.ok(
    cardSource.includes('BudgetProgressBar'),
    'Deve renderizar barra de progresso'
  );
});

test('AC-377: Alternância para visão anual com comparativo mês a mês @spec:AC-377', () => {
  const chartSource = readSource('components/budgets/BudgetAnnualChart.tsx');
  assert.ok(
    chartSource.includes('BarChart'),
    'Deve renderizar BarChart do Recharts'
  );
  assert.ok(
    chartSource.includes('dataKey="target"'),
    'Deve ter barra para Meta Planejada'
  );
  assert.ok(
    chartSource.includes('dataKey="used"'),
    'Deve ter barra para Gasto Realizado'
  );
  assert.ok(
    chartSource.includes('Visão Anual Panorâmica'),
    'Deve conter título da visão anual'
  );

  const pageSource = readSource('pages/Budgets/BudgetsPage.tsx');
  assert.ok(
    pageSource.includes("viewMode === 'monthly'"),
    'Deve alternar entre visão mensal e anual'
  );
  assert.ok(
    pageSource.includes('<BudgetAnnualChart'),
    'Deve renderizar componente de gráfico anual'
  );
});

// US-106 — Cadastro de orçamento e recorrência
test('AC-378: Cadastro de orçamento avulso para categoria de despesa @spec:AC-378', () => {
  const validSingleData = {
    category_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    year: 2026,
    month: 10,
    target_amount: 1500,
    mode: 'single',
  };

  const parsed = createBudgetFormSchema.safeParse(validSingleData);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data?.mode, 'single');
  assert.equal(parsed.data?.target_amount, 1500);

  // Validação: target_amount deve ser > 0
  const invalidTarget = {
    ...validSingleData,
    target_amount: 0,
  };
  const invalidParsed = createBudgetFormSchema.safeParse(invalidTarget);
  assert.equal(invalidParsed.success, false);
});

test('AC-379: Cadastro de orçamento recorrente com quantidade de meses @spec:AC-379', () => {
  const validRecurrentData = {
    category_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    year: 2026,
    month: 10,
    target_amount: 800,
    mode: 'recurrent',
    months_quantity: 6,
  };

  const parsed = createBudgetFormSchema.safeParse(validRecurrentData);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data?.mode, 'recurrent');
  assert.equal(parsed.data?.months_quantity, 6);

  // Validação: months_quantity entre 2 e 12
  const invalidMonths = {
    ...validRecurrentData,
    months_quantity: 1,
  };
  assert.equal(createBudgetFormSchema.safeParse(invalidMonths).success, false);

  const tooManyMonths = {
    ...validRecurrentData,
    months_quantity: 13,
  };
  assert.equal(createBudgetFormSchema.safeParse(tooManyMonths).success, false);
});

test('AC-380: Alerta amigável de conflito para categoria já orçada no mês @spec:AC-380', () => {
  const modalSource = readSource('components/budgets/BudgetModal.tsx');
  assert.ok(
    modalSource.includes('error?.response?.status === 409'),
    'Deve capturar status 409 de conflito'
  );
  assert.ok(
    modalSource.includes(
      'Esta categoria já possui um orçamento cadastrado para este mês/ano'
    ),
    'Deve orientar o usuário a editar o orçamento existente em vez de criar um novo'
  );
});

// US-107 — Manutenção, recálculo e exclusão com escopo
test('AC-381: Edição de meta com seleção de escopo pontual ou cascata @spec:AC-381', () => {
  // Validação do schema de atualização
  const singleUpdate = updateBudgetFormSchema.safeParse({
    target_amount: 2000,
    scope: 'single',
  });
  assert.equal(singleUpdate.success, true);
  assert.equal(singleUpdate.data?.scope, 'single');

  const followingUpdate = updateBudgetFormSchema.safeParse({
    target_amount: 2500,
    scope: 'following',
  });
  assert.equal(followingUpdate.success, true);
  assert.equal(followingUpdate.data?.scope, 'following');

  // Componente oferece os rádios de escopo
  const modalSource = readSource('components/budgets/BudgetModal.tsx');
  assert.ok(
    modalSource.includes('Apenas este mês'),
    'Modal de edição deve oferecer opção apenas este mês'
  );
  assert.ok(
    modalSource.includes('Este e os próximos meses'),
    'Modal de edição deve oferecer opção este e os próximos'
  );
});

test('AC-382: Exclusão de orçamento com escopo para registros recorrentes @spec:AC-382', () => {
  const deleteDialogSource = readSource('components/budgets/BudgetDeleteDialog.tsx');
  assert.ok(
    deleteDialogSource.includes('Excluir apenas este mês'),
    'Deve conter opção de exclusão pontual'
  );
  assert.ok(
    deleteDialogSource.includes('Excluir este e todos os próximos meses'),
    'Deve conter opção de exclusão em cascata'
  );
  assert.ok(
    deleteDialogSource.includes("onConfirm(budget.id, scope)"),
    'Deve repassar o escopo para a função onConfirm'
  );
});

test('AC-383: Recálculo e sincronização sob demanda (auto-heal) @spec:AC-383', () => {
  const serviceSource = readSource('services/budget.service.ts');
  assert.ok(
    serviceSource.includes('/budget/recalculate_used_amount'),
    'Service deve chamar endpoint de recálculo'
  );

  const cardSource = readSource('components/budgets/BudgetCategoryCard.tsx');
  assert.ok(
    cardSource.includes('handleRecalculate'),
    'Card deve conter ação para disparar o recálculo'
  );
  assert.ok(
    cardSource.includes('onRecalculate(budget)'),
    'Card deve acionar o callback onRecalculate'
  );
});

test('AC-384: Projeção realista e alternador de previsão de sobra @spec:AC-384', () => {
  // 1. Tipos de dados de resumo
  const typesSource = readSource('types/budget.ts');
  assert.ok(
    typesSource.includes('projected_savings_realistic?: number'),
    'BudgetSummary deve incluir projected_savings_realistic'
  );
  assert.ok(
    typesSource.includes('unbudgeted_expenses?: number'),
    'BudgetSummary deve incluir unbudgeted_expenses'
  );

  // 2. Serviço normaliza campos adicionais
  const serviceSource = readSource('services/budget.service.ts');
  assert.ok(
    serviceSource.includes('projected_savings_realistic'),
    'Service deve mapear projected_savings_realistic'
  );
  assert.ok(
    serviceSource.includes('unbudgeted_expenses'),
    'Service deve mapear unbudgeted_expenses'
  );

  // 3. Componente com seletor de modo e alerta de despesas sem meta
  const cardsSource = readSource('components/budgets/BudgetSummaryCards.tsx');
  assert.ok(
    cardsSource.includes('data-testid="budget-savings-mode-switch"'),
    'Deve conter container do switch de modo'
  );
  assert.ok(
    cardsSource.includes('data-testid="savings-mode-ideal"'),
    'Deve conter botão de alternância para Plano Ideal'
  );
  assert.ok(
    cardsSource.includes('data-testid="savings-mode-realistic"'),
    'Deve conter botão de alternância para Projeção Realista'
  );
  assert.ok(
    cardsSource.includes('data-testid="unbudgeted-expenses-warning"'),
    'Deve conter aviso para despesas fora do orçamento'
  );
  assert.ok(
    cardsSource.includes('despesas fora do orçamento'),
    'Deve exibir texto informativo de despesas fora do orçamento'
  );
});

test('AC-385: Sincronização reativa e exibição de despesas pendentes no orçamento @spec:AC-385', () => {
  // 1. Sincronização de mutações de transações
  const txMutationsSource = readSource('hooks/useTransactionMutations.ts');
  assert.ok(
    txMutationsSource.includes("'budgets'"),
    'Mutações de transação devem invalidar query key de budgets'
  );
  assert.ok(
    txMutationsSource.includes("'budgetSummary'"),
    'Mutações de transação devem invalidar query key de budgetSummary'
  );
  assert.ok(
    txMutationsSource.includes("'budgetAnnual'"),
    'Mutações de transação devem invalidar query key de budgetAnnual'
  );

  // 2. Card de categoria com label Comprometido e aviso de despesa pendente
  const categoryCardSource = readSource('components/budgets/BudgetCategoryCard.tsx');
  assert.ok(
    categoryCardSource.includes('Comprometido:'),
    'BudgetCategoryCard deve exibir label Comprometido'
  );
  assert.ok(
    categoryCardSource.includes('budget-pending-warning'),
    'BudgetCategoryCard deve possuir aviso para valores pendentes'
  );
  assert.ok(
    categoryCardSource.includes('ainda pendente'),
    'BudgetCategoryCard deve exibir mensagem de valor ainda pendente'
  );

  // 3. Card de resumo com aviso e tooltip de despesas pendentes
  const summaryCardsSource = readSource('components/budgets/BudgetSummaryCards.tsx');
  assert.ok(
    summaryCardsSource.includes('summary-used-pending-warning'),
    'BudgetSummaryCards deve possuir data-testid para despesas pendentes'
  );
  assert.ok(
    summaryCardsSource.includes('Total Gasto (Comprometido)'),
    'BudgetSummaryCards deve indicar total gasto comprometido'
  );

  // 4. Gráfico anual com legendas e tooltips de Comprometido
  const annualChartSource = readSource('components/budgets/BudgetAnnualChart.tsx');
  assert.ok(
    annualChartSource.includes('Comprometido'),
    'BudgetAnnualChart deve exibir Comprometido'
  );
});

