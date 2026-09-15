// Testes de spec da feature ajustes-mobile-tema-notificacoes
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { useTransactionModalStore } from '../src/stores/transactionModal.store.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-031 — Notificações de Contas em Atraso no Sino
test('AC-123: Badge numérico no sino com total de contas atrasadas @spec:AC-123', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');
  const topbarSource = readSource('components/layout/Topbar.tsx');

  // Topbar não deve forçar overdueAlertsCount = 0 por default (deve permitir contagem autônoma)
  assert.equal(
    topbarSource.includes('overdueAlertsCount = 0'),
    false,
    'Topbar não deve forçar overdueAlertsCount = 0 por default'
  );

  // NotificationsBell deve calcular queryCount com base nos dados retornados pela query de alertas
  assert.ok(
    bellSource.includes('queryCount ='),
    'NotificationsBell deve definir queryCount com dados da API'
  );
  assert.ok(
    bellSource.includes('alertsData?.overdueAlerts?.items?.length') ||
    bellSource.includes('alertsData?.overdueAlerts?.total_overdue'),
    'NotificationsBell deve contabilizar itens atrasados ou total_overdue'
  );

  // Badge condicional com estilo de destaque
  assert.ok(
    bellSource.includes('data-testid="notifications-badge"'),
    'Deve possuir elemento badge de notificações'
  );
  assert.ok(
    bellSource.includes('count > 0'),
    'Badge só deve ser exibido quando count > 0'
  );
});

// US-031 — Notificações de Contas em Atraso no Sino
test('AC-124: Listagem descritiva no popover de notificações @spec:AC-124', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Deve possuir popover com lista de atrasos e formatação de dias e moeda BRL
  assert.ok(
    bellSource.includes('data-testid="notifications-popover"'),
    'Deve possuir o contêiner do popover'
  );
  assert.ok(
    bellSource.includes('overdueList.map'),
    'Deve iterar sobre a lista de contas atrasadas'
  );
  assert.ok(
    bellSource.includes('days_overdue'),
    'Deve exibir a quantidade de dias em atraso'
  );
  assert.ok(
    bellSource.includes('Intl.NumberFormat') || bellSource.includes('formatCurrency') || bellSource.includes('toFixed'),
    'Deve formatar o valor da transação em atraso'
  );
  assert.ok(
    bellSource.includes('to="/transacoes"'),
    'Deve incluir link para a página completa de transações'
  );
});

// US-031 — Notificações de Contas em Atraso no Sino
test('AC-125: Estado vazio do sino quando não há pendências @spec:AC-125', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // Exibição de mensagem amigável no estado vazio
  assert.ok(
    bellSource.includes('Tudo em dia!'),
    'Deve exibir mensagem "Tudo em dia!" quando não houver pendências'
  );
  assert.ok(
    bellSource.includes('Nenhum pagamento em atraso'),
    'Deve informar ausência de pendências na carteira'
  );
  assert.ok(
    bellSource.includes('count === 0'),
    'Deve possuir verificação explícita de count === 0 para estado vazio'
  );
});

// US-032 — Consistência Visual dos Cards e Tabelas no Tema Escuro
test('AC-126: Cards informativos da dashboard com fundo escuro @spec:AC-126', () => {
  const kpiSource = readSource('pages/Dashboard/components/KpiCards.tsx');
  const accountSource = readSource('pages/Dashboard/components/AccountBalances.tsx');
  const creditCardSource = readSource('pages/Dashboard/components/CreditCardSummary.tsx');
  const cssSource = readSource('index.css');

  // Verificação nos componentes do Dashboard
  assert.ok(kpiSource.includes('dark:bg-slate-900'), 'KpiCards deve ter dark:bg-slate-900');
  assert.ok(kpiSource.includes('dark:border-slate-800'), 'KpiCards deve ter dark:border-slate-800');
  assert.ok(accountSource.includes('dark:bg-slate-900'), 'AccountBalances deve ter dark:bg-slate-900');
  assert.ok(creditCardSource.includes('dark:bg-slate-900'), 'CreditCardSummary deve ter dark:bg-slate-900');

  // Verificação de regra global com alta especificidade no index.css
  assert.ok(
    cssSource.includes('html.dark .bg-white') && cssSource.includes('!important'),
    'index.css deve forçar sobrescrita de .bg-white em modo escuro com !important'
  );
});

// US-032 — Consistência Visual dos Cards e Tabelas no Tema Escuro
test('AC-127: Tabela de transações compatível com tema escuro @spec:AC-127', () => {
  const tableSource = readSource('components/transactions/TransactionTable.tsx');

  assert.ok(tableSource.includes('dark:bg-slate-900'), 'TransactionTable container deve ter dark:bg-slate-900');
  assert.ok(tableSource.includes('dark:border-slate-800'), 'TransactionTable deve ter dark:border-slate-800');
  assert.ok(tableSource.includes('dark:divide-slate-800'), 'TransactionTable deve ter dark:divide-slate-800');
  assert.ok(tableSource.includes('dark:text-slate-200'), 'TransactionTable deve ter dark:text-slate-200');
  assert.ok(tableSource.includes('dark:hover:bg-slate-800'), 'TransactionTable deve ter efeito hover dark');
});

// US-032 — Consistência Visual dos Cards e Tabelas no Tema Escuro
test('AC-128: Barra de filtros e controles de transação no tema escuro @spec:AC-128', () => {
  const filterSource = readSource('components/transactions/TransactionFilters.tsx');
  const cssSource = readSource('index.css');

  assert.ok(filterSource.includes('dark:bg-slate-900'), 'Filtros devem ter container dark:bg-slate-900');
  assert.ok(filterSource.includes('dark:border-slate-700') || filterSource.includes('dark:border-slate-800'), 'Filtros devem ter bordas escuras');
  assert.ok(
    cssSource.includes('html.dark input') && cssSource.includes('background-color: #1e293b'),
    'Inputs devem ter fundo escuro no tema dark'
  );
});

// US-033 — Design Mobile com Header Compacto e Bottom Navigation
test('AC-129: Header mobile compacto sem quebra ou overflow @spec:AC-129', () => {
  const topbarSource = readSource('components/layout/Topbar.tsx');
  const walletSource = readSource('components/layout/WalletSelector.tsx');

  // Topbar deve ter layout fluido anti-overflow
  assert.ok(
    topbarSource.includes('max-w-full') || topbarSource.includes('overflow-hidden') || topbarSource.includes('shrink-0'),
    'Topbar deve prevenir quebra de layout com classes de contenção'
  );
  assert.ok(
    topbarSource.includes('min-w-0'),
    'Topbar deve permitir contração dos blocos flexíveis'
  );

  // WalletSelector deve ter pílula responsiva com truncamento
  assert.ok(
    walletSource.includes('truncate'),
    'WalletSelector deve truncar o nome da carteira'
  );
  assert.ok(
    walletSource.includes('max-w-'),
    'WalletSelector deve restringir a largura máxima no mobile'
  );
});

// US-033 — Design Mobile com Header Compacto e Bottom Navigation
test('AC-130: Barra de navegação inferior (Bottom Navigation) em todas as páginas mobile @spec:AC-130', () => {
  const layoutSource = readSource('layouts/AppLayout.tsx');
  const mobileNavSource = readSource('components/layout/MobileNav.tsx');

  // AppLayout deve integrar MobileNav
  assert.ok(
    layoutSource.includes('MobileNav'),
    'AppLayout deve renderizar o componente MobileNav'
  );
  assert.ok(
    layoutSource.includes('pb-24') || layoutSource.includes('pb-20'),
    'AppLayout deve fornecer espaçamento inferior (pb-24) para a barra não cobrir conteúdo'
  );

  // MobileNav deve ser fixo e exclusivo para telas < md
  assert.ok(mobileNavSource.includes('fixed bottom-0'), 'MobileNav deve ser fixado no rodapé');
  assert.ok(mobileNavSource.includes('md:hidden'), 'MobileNav deve ser oculto em desktop (md:hidden)');
  assert.ok(mobileNavSource.includes('/dashboard'), 'MobileNav deve ter atalho para Início');
  assert.ok(mobileNavSource.includes('/transacoes'), 'MobileNav deve ter atalho para Transações');
  assert.ok(mobileNavSource.includes('/cartoes'), 'MobileNav deve ter atalho para Cartões');
});

// US-033 — Design Mobile com Header Compacto e Bottom Navigation
test('AC-131: Botão de ação rápida central para Nova Transação @spec:AC-131', () => {
  const mobileNavSource = readSource('components/layout/MobileNav.tsx');

  // MobileNav deve possuir botão central de criação rápida
  assert.ok(
    mobileNavSource.includes('data-testid="mobile-nav-quick-add"'),
    'MobileNav deve possuir botão data-testid="mobile-nav-quick-add"'
  );
  assert.ok(
    mobileNavSource.includes('openModal'),
    'MobileNav deve acionar openModal da store de transação'
  );

  // Teste de store: openModal deve abrir o modal
  useTransactionModalStore.getState().closeModal();
  assert.equal(useTransactionModalStore.getState().isOpen, false);

  useTransactionModalStore.getState().openModal();
  assert.equal(useTransactionModalStore.getState().isOpen, true);
  useTransactionModalStore.getState().closeModal();
});

// US-033 — Design Mobile com Header Compacto e Bottom Navigation
test('AC-132: Preservação da navegação desktop tradicional @spec:AC-132', () => {
  const layoutSource = readSource('layouts/AppLayout.tsx');
  const sidebarSource = readSource('components/layout/Sidebar.tsx');
  const mobileNavSource = readSource('components/layout/MobileNav.tsx');

  // Sidebar permanece preservada para desktop
  assert.ok(layoutSource.includes('Sidebar'), 'Sidebar deve continuar no AppLayout');
  assert.ok(sidebarSource.includes('md:static') && sidebarSource.includes('md:translate-x-0'), 'Sidebar deve ser visível no desktop');

  // MobileNav fica oculto em desktop
  assert.ok(mobileNavSource.includes('md:hidden'), 'MobileNav deve estar oculta no desktop');
});
