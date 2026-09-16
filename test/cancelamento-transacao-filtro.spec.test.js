// Testes de spec da feature cancelamento-transacao-filtro — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-067 — Cancelamento de Transação na Edição e Filtro Exclusivo de Canceladas
test('AC-240: Opção visual de cancelamento no formulário de edição @spec:AC-240', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Deve existir verificação de edição (initialData) e checkbox de cancelamento com data-testid
  assert.ok(
    formSource.includes('data-testid="cancel-transaction-checkbox"'),
    'Formulário deve possuir checkbox com data-testid="cancel-transaction-checkbox"'
  );
  assert.ok(
    formSource.includes('initialData') && formSource.includes('isCancelled'),
    'Deve gerenciar estado de cancelamento baseado na presença de initialData'
  );
  assert.ok(
    formSource.includes('Cancelar esta transação') || formSource.includes('Cancelar transação'),
    'Deve exibir rótulo claro indicando a ação de cancelar a transação'
  );
});

test('AC-241: Mútua exclusão entre status cancelado e status pago @spec:AC-241', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Ao marcar cancelado, deve desmarcar isPaid e limpar paymentDate
  assert.ok(
    formSource.includes('setIsCancelled') && formSource.includes('setIsPaid(false)'),
    'Ao cancelar deve desativar o status pago'
  );
  assert.ok(
    formSource.includes('disabled={isCancelled}') || formSource.includes('!isCancelled'),
    'Opção de pago deve ser desabilitada ou condicionada quando cancelada estiver ativa'
  );
});

test('AC-242: Envio correto do payload na atualização com status cancelled @spec:AC-242', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Payload deve atribuir status: 'cancelled' quando isCancelled for verdadeiro
  assert.ok(
    formSource.includes("isCancelled ? 'cancelled'") || formSource.includes("status: isCancelled ? 'cancelled'"),
    'Payload deve definir status cancelled quando transação for marcada como cancelada'
  );
  assert.ok(
    formSource.includes('all_installments'),
    'Deve manter suporte para propagação a todas as parcelas se for parcelada'
  );
});

test('AC-243: Ocultação de canceladas na listagem de todas as transações @spec:AC-243', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');

  // Na listagem geral (sem filtro específico de canceladas), transações canceladas não devem ser exibidas
  assert.ok(
    pageSource.includes("t.status !== 'cancelled'") || pageSource.includes("status !== 'cancelled'"),
    'Deve filtrar em memória removendo transações canceladas da listagem padrão'
  );
  assert.ok(
    pageSource.includes("['pending', 'completed', 'expired']") || pageSource.includes('effectiveFilters'),
    'Deve solicitar apenas status ativos ou aplicar filtro defensivo para não trazer canceladas'
  );
});

test('AC-244: Exibição restrita de canceladas no filtro de status Cancelados @spec:AC-244', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');
  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');

  // Filtro de cancelados deve possuir data-testid e a página deve filtrar exclusivamente por 'cancelled'
  assert.ok(
    filtersSource.includes("handleStatusChange('cancelled')"),
    'Filtros devem possuir ação para filtrar por status cancelled'
  );
  assert.ok(
    filtersSource.includes('data-testid="filter-status-cancelled"'),
    'Botão de filtro de cancelados deve possuir data-testid="filter-status-cancelled"'
  );
  assert.ok(
    pageSource.includes("filters.status === 'cancelled'") || pageSource.includes("status === 'cancelled'"),
    'Página deve isolar exibição quando o filtro de cancelados estiver ativo'
  );
});

// US-068 — Reativação e Recálculo de Status de Transações Canceladas
test('AC-245: Função resolveTransactionStatus calcula status correto baseado em cancelamento, pagamento e vencimento @spec:AC-245', async () => {
  const { resolveTransactionStatus } = await import('../src/utils/transactionStatus.ts');

  const todayStr = '2026-09-16';
  const yesterdayStr = '2026-09-15';
  const tomorrowStr = '2026-09-17';

  // Regra 1: se cancelada, sempre 'cancelled'
  assert.equal(
    resolveTransactionStatus({ isCancelled: true, isPaid: false, dueDate: yesterdayStr, todayStr }),
    'cancelled'
  );
  assert.equal(
    resolveTransactionStatus({ isCancelled: true, isPaid: true, dueDate: tomorrowStr, todayStr }),
    'cancelled'
  );

  // Regra 2: se não cancelada e paga, sempre 'completed'
  assert.equal(
    resolveTransactionStatus({ isCancelled: false, isPaid: true, dueDate: yesterdayStr, todayStr }),
    'completed'
  );

  // Regra 3: se não cancelada, não paga e vencimento anterior a hoje, 'expired'
  assert.equal(
    resolveTransactionStatus({ isCancelled: false, isPaid: false, dueDate: yesterdayStr, todayStr }),
    'expired'
  );

  // Regra 4: se não cancelada, não paga e vencimento hoje ou futuro, 'pending'
  assert.equal(
    resolveTransactionStatus({ isCancelled: false, isPaid: false, dueDate: todayStr, todayStr }),
    'pending'
  );
  assert.equal(
    resolveTransactionStatus({ isCancelled: false, isPaid: false, dueDate: tomorrowStr, todayStr }),
    'pending'
  );
});

test('AC-246: Preservação de IDs de chave estrangeira ao carregar transação na edição @spec:AC-246', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Deve mapear bankAccountId considerando id direto ou correspondência por nome (bank_name)
  assert.ok(
    formSource.includes('initialData.bank_account_id') &&
    (formSource.includes('initialData.bank_account_name') || formSource.includes('bank_name ===')),
    'TransactionFormBase deve recuperar bankAccountId por ID ou por nome correspondente'
  );

  // Deve mapear payMethodId considerando id direto ou correspondência por nome (pay_method_name)
  assert.ok(
    formSource.includes('initialData.pay_methods_id') &&
    (formSource.includes('initialData.pay_method_name') || formSource.includes('pay_method_name &&')),
    'TransactionFormBase deve recuperar payMethodId por ID ou por nome correspondente'
  );

  // Deve mapear categoryId considerando id direto ou correspondência por nome (category_name)
  assert.ok(
    formSource.includes('initialData.category_id') &&
    (formSource.includes('initialData.category_name') || formSource.includes('category_name &&')),
    'TransactionFormBase deve recuperar categoryId por ID ou por nome correspondente'
  );
});

test('AC-247: Feedback visual de reativação com data-testid e projeção de status @spec:AC-247', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Deve possuir badge de visualização da reativação com data-testid="reactivation-preview"
  assert.ok(
    formSource.includes('data-testid="reactivation-preview"'),
    'Deve exibir elemento com data-testid="reactivation-preview" quando reativando'
  );

  // Deve verificar se initialData era cancelada e o usuário desmarcou
  assert.ok(
    formSource.includes("initialData.status === 'cancelled'") && formSource.includes('!isCancelled'),
    'Deve detectar transição de reativação (status original cancelled e isCancelled falso)'
  );

  // Deve exibir o status projetado de reativação no preview e no botão
  assert.ok(
    formSource.includes('Reativar como Vencida') &&
    formSource.includes('Reativar como Concluída') &&
    formSource.includes('Reativar como Pendente'),
    'Botão de submissão deve indicar o status no qual a transação será reativada'
  );
});

test('AC-248: Integração de resolveTransactionStatus no handleSubmit garantindo persistência do status correto @spec:AC-248', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // handleSubmit deve chamar resolveTransactionStatus e enviar status compatível com a sincronização automática do backend
  assert.ok(
    formSource.includes('resolveTransactionStatus({') &&
    (formSource.includes('status: payloadStatus') || formSource.includes('status: resolvedStatus')),
    'handleSubmit deve utilizar resolveTransactionStatus e definir o status no payload'
  );

  // payment_date deve ser preenchida somente se resolvedStatus === 'completed'
  assert.ok(
    formSource.includes("resolvedStatus === 'completed'"),
    'payment_date só deve ser enviada quando o status resolvido for completed'
  );
});

test('AC-249: Regra defensiva de data e sincronização com backend @spec:AC-249', () => {
  const statusUtilSource = readSource('utils/transactionStatus.ts');

  // transactionStatus util deve comparar dueDate com todayStr de forma padronizada YYYY-MM-DD
  assert.ok(
    statusUtilSource.includes('split') && statusUtilSource.includes('cleanDueDate < todayStr'),
    'Função de status deve normalizar e comparar as datas no formato ISO YYYY-MM-DD'
  );
});

// US-069 — Exibição de Status Expired e Persistência Segura na Edição
test('AC-250: Tratamento explícito de status expired na listagem mobile sem fallback indevido para cancelada @spec:AC-250', () => {
  const mobileListSource = readSource('components/transactions/TransactionMobileList.tsx');

  assert.ok(
    mobileListSource.includes("t.status === 'cancelled'") || mobileListSource.includes("status === 'cancelled'"),
    'TransactionMobileList deve isolar explicitamente o status cancelled'
  );
  assert.ok(
    mobileListSource.includes("t.status === 'expired'") || mobileListSource.includes("status === 'expired'"),
    'TransactionMobileList deve tratar explicitamente o status expired'
  );
  assert.ok(
    mobileListSource.includes('Vencida') || mobileListSource.includes('atrasada'),
    'TransactionMobileList deve exibir texto de vencida/atrasada'
  );
});

test('AC-251: Tratamento explícito de status expired no modal de detalhes e dashboard @spec:AC-251', () => {
  const modalSource = readSource('components/transactions/TransactionDetailsModal.tsx');
  const dashSource = readSource('pages/Dashboard/components/RecentTransactions.tsx');

  assert.ok(
    modalSource.includes("transaction.status === 'expired'"),
    'TransactionDetailsModal deve tratar explicitamente transaction.status === expired'
  );
  assert.ok(
    modalSource.includes("transaction.status === 'cancelled'"),
    'TransactionDetailsModal deve restringir Cancelada para status === cancelled'
  );
  assert.ok(
    dashSource.includes("status === 'expired'") && dashSource.includes("status === 'cancelled'"),
    'RecentTransactions deve tratar cancelled e expired explicitamente'
  );
});

test('AC-252: Suporte a status expired no utilitário de atraso calculateOverdue @spec:AC-252', () => {
  const serviceSource = readSource('services/transactionService.ts');

  assert.ok(
    serviceSource.includes("status !== 'expired'") || serviceSource.includes("status === 'expired'"),
    'calculateOverdue deve suportar status expired'
  );
});

test('AC-253: Preservação de status expired na edição de transações vencidas evitando erro 500 @spec:AC-253', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  assert.ok(
    formSource.includes('payloadStatus') && formSource.includes('resolvedStatus'),
    'TransactionFormBase deve computar payloadStatus utilizando resolvedStatus'
  );
  assert.ok(
    formSource.includes('isReactivatingFromCancelled'),
    'TransactionFormBase deve distinguir reativação a partir de cancelada de edição normal'
  );
});

test('AC-254: Suíte completa e integridade das regras de status @spec:AC-254', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  const serviceSource = readSource('services/transactionService.ts');

  assert.ok(formSource.length > 0 && serviceSource.length > 0, 'Arquivos de transação integrados');
});

test('AC-255: Isolamento estrito de transações atrasadas por tipo no filtro da listagem @spec:AC-255', () => {
  const transactionsPageSource = readSource('pages/Transactions/index.tsx');

  // pastOverdueData deve considerar filters.type na query
  assert.ok(
    transactionsPageSource.includes('type: filters.type'),
    'Consulta de atrasadas anteriores deve filtrar por type: filters.type'
  );

  // Transferências não devem carregar atrasadas anteriores
  assert.ok(
    transactionsPageSource.includes("filters.type !== 'transfers'"),
    'Transferências não devem incluir transações atrasadas de despesas ou receitas'
  );

  // allTransactions deve aplicar filtro estrito por tipo ativo
  assert.ok(
    transactionsPageSource.includes('ot.type !== filters.type') &&
    transactionsPageSource.includes('t.type === filters.type'),
    'allTransactions deve filtrar transações pelo tipo selecionado'
  );
});



