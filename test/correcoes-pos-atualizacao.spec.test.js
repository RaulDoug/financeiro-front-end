// Testes de spec da feature correcoes-pos-atualizacao — gerados por onp-spec scaffold
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-043 — Centralização do Ícone de Notificação
test('AC-156: Sino centralizado na viewport horizontal @spec:AC-156', () => {
  const bellSource = readSource('components/layout/NotificationsBell.tsx');

  // O popover de notificações deve estar posicionado relativo ao sino ou centralizado na viewport
  assert.ok(
    (bellSource.includes('fixed left-1/2 -translate-x-1/2') || bellSource.includes('absolute right-0')) &&
    bellSource.includes('data-testid="notifications-popover"'),
    'Popover de notificações deve utilizar posicionamento adequado relativo ao sino'
  );
  assert.ok(
    bellSource.includes('max-w-[calc(100vw-2rem)]'),
    'Popover deve possuir restrição de largura máxima para evitar transbordo em telas pequenas'
  );
});

// US-044 — Modal de Transação na Tela de Transações
test('AC-157: Botão "+" da barra inferior abre modal na tela de transações @spec:AC-157', () => {
  const mobileNavSource = readSource('components/layout/MobileNav.tsx');
  const transactionsSource = readSource('pages/Transactions/index.tsx');

  // MobileNav deve acionar a store global de abertura de modal
  assert.ok(
    mobileNavSource.includes('data-testid="mobile-nav-quick-add"') &&
    mobileNavSource.includes('openModal'),
    'Botão de adicionar na barra inferior deve disparar openModal da store'
  );

  // TransactionsPage deve escutar a store e abrir o modal na tela de transações
  assert.ok(
    transactionsSource.includes('useTransactionModalStore') &&
    transactionsSource.includes('isGlobalModalOpen') &&
    transactionsSource.includes('setIsModalOpen(true)'),
    'TransactionsPage deve escutar useTransactionModalStore para abrir o modal imediatamente'
  );
});

// US-044 — Modal de Transação na Tela de Transações
test('AC-158: Estado do modal não vaza entre telas @spec:AC-158', () => {
  const transactionsSource = readSource('pages/Transactions/index.tsx');
  const dashboardSource = readSource('pages/Dashboard/DashboardPage.tsx');

  // TransactionsPage deve resetar a store ao abrir o modal e ao desmontar
  assert.ok(
    transactionsSource.includes('closeGlobalModal()'),
    'TransactionsPage deve limpar o estado global do modal ao abrir ou desmontar'
  );

  // DashboardPage também deve resetar a store ao desmontar
  assert.ok(
    dashboardSource.includes('closeModal()'),
    'DashboardPage deve limpar o estado global do modal ao desmontar'
  );
});

// US-045 — Botão de Pagamento nos Detalhes da Transação
test('AC-159: Botão de pagamento visível em detalhes de transações pendentes @spec:AC-159', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // Deve haver botão de efetuar pagamento para transações com status diferente de completed
  assert.ok(
    detailsSource.includes('data-testid="btn-details-pay"'),
    'Deve haver botão de pagamento com testid btn-details-pay'
  );
  assert.ok(
    detailsSource.includes('data-testid="payment-mini-form"') &&
    detailsSource.includes('data-testid="payment-date-input"') &&
    detailsSource.includes('data-testid="btn-confirm-payment"'),
    'Deve conter mini-formulário com seletor de data e confirmação de pagamento'
  );
});

// US-045 — Botão de Pagamento nos Detalhes da Transação
test('AC-160: Botão de pagamento ausente em transações já concluídas @spec:AC-160', () => {
  const detailsSource = readSource('components/transactions/TransactionDetailsModal.tsx');

  // O botão de pagamento deve ser condicional a status !== 'completed'
  assert.ok(
    detailsSource.includes("transaction.status !== 'completed'") &&
    detailsSource.includes('btn-details-pay'),
    'Botão de pagamento só deve ser renderizado quando status for diferente de completed'
  );
});

// US-046 — Formulário de Cadastro de Cartão Funcional
test('AC-161: Formulário de cartão sem corte superior @spec:AC-161', () => {
  const modalSource = readSource('components/credit-cards/CreditCardModal.tsx');

  // Modal deve possuir max-height e rolagem interna evitando corte do topo
  assert.ok(
    modalSource.includes('max-h-[92vh]') &&
    modalSource.includes('overflow-y-auto') &&
    modalSource.includes('shrink-0'),
    'CreditCardModal deve ter max-h limitado e cabeçalho fixo shrink-0 para não cortar o topo'
  );
});

// US-046 — Formulário de Cadastro de Cartão Funcional
test('AC-162: Botão de fechar do formulário de cartão funciona @spec:AC-162', () => {
  const modalSource = readSource('components/credit-cards/CreditCardModal.tsx');

  // Deve possuir botão com onClose e suporte a fechar no backdrop
  assert.ok(
    modalSource.includes('onClick={onClose}') &&
    modalSource.includes('aria-label="Fechar"'),
    'CreditCardModal deve possuir botão de fechar funcional'
  );
});

// US-046 — Formulário de Cadastro de Cartão Funcional
test('AC-163: Formulário de cartão acessível pelas configurações @spec:AC-163', () => {
  const payMethodModalSource = readSource('pages/Settings/PayMethodModal.tsx');

  // Modal de formas de pagamento em Configurações também não deve cortar o topo
  assert.ok(
    payMethodModalSource.includes('max-h-[92vh]') &&
    payMethodModalSource.includes('shrink-0') &&
    payMethodModalSource.includes('overflow-y-auto'),
    'PayMethodModal deve possuir limitação de altura e rolagem interna para não cortar cabeçalho'
  );
});

// US-047 — Transações Vencidas na Listagem
test('AC-164: Transações vencidas exibidas na listagem @spec:AC-164', () => {
  const transactionsSource = readSource('pages/Transactions/index.tsx');

  // Deve consultar transações vencidas de períodos anteriores e combiná-las
  assert.ok(
    transactionsSource.includes('pastOverdueData') &&
    transactionsSource.includes('due_date_to') &&
    transactionsSource.includes('combinedTransactions') || transactionsSource.includes('allTransactions'),
    'TransactionsPage deve buscar transações vencidas de meses anteriores e reuni-las na lista'
  );
});

// US-048 — Transações Recentes Clicáveis no Dashboard
test('AC-165: Transações recentes clicáveis no dashboard @spec:AC-165', () => {
  const recentSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');

  // Linhas das transações recentes devem ter onClick abrindo a store de detalhes
  assert.ok(
    recentSource.includes('useTransactionDetailsModalStore') &&
    recentSource.includes('openModal') &&
    recentSource.includes('onClick={() => handleSelect(tx)}'),
    'Transações recentes devem possuir onClick abrindo o modal de detalhes'
  );
});

// US-048 — Transações Recentes Clicáveis no Dashboard
test('AC-166: Layout visual das transações recentes alinhado com a tela de transações @spec:AC-166', () => {
  const recentSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');

  // Deve possuir tabela com colunas de Descrição, Data, Categoria, Valor e Status
  assert.ok(
    recentSource.includes('<table') &&
    recentSource.includes('Descrição') &&
    recentSource.includes('renderStatusBadge'),
    'RecentTransactions deve possuir tabela estruturada e badges de status semelhantes à tela de transações'
  );
});

// US-049 — Erro 500 no Cadastro de Cartão Corrigido
test('AC-167: Cadastro de cartão sem erro 500 @spec:AC-167', () => {
  const creditCardsApiSource = readSource('services/api/creditCards.ts');

  // createCreditCard deve enviar payload sanitizado para /pay-method/register
  assert.ok(
    creditCardsApiSource.includes("api.post('/pay-method/register', payload)") &&
    creditCardsApiSource.includes('credit_card: true'),
    'createCreditCard deve enviar requisição POST para /pay-method/register com flag credit_card: true'
  );
});

// US-049 — Erro 500 no Cadastro de Cartão Corrigido
test('AC-168: Payload de cadastro de cartão correto @spec:AC-168', () => {
  const creditCardsApiSource = readSource('services/api/creditCards.ts');

  // Deve validar e formatar os campos obrigatórios: name, due_day, closing_day, last_four_digits, credit_limit, bank_account_id
  assert.ok(
    creditCardsApiSource.includes('bank_account_id: data.bank_account_id') &&
    creditCardsApiSource.includes('Number(data.due_day)') &&
    creditCardsApiSource.includes('Number(data.closing_day)') &&
    creditCardsApiSource.includes('Number(data.credit_limit)') &&
    creditCardsApiSource.includes('String(data.last_four_digits)'),
    'Payload deve sanitizar e converter os tipos numéricos e de texto conforme esperado pela API'
  );
});
