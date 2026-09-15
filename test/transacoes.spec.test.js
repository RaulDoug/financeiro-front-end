// Testes de spec da feature transacoes
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { transactionService } from '../src/services/transactionService.ts';
import { transactionBaseSchema, transferSchema } from '../src/lib/validations/transaction.ts';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-011 — Visualizar e filtrar listagem de transações
test('AC-043: Listagem padrão de transações @spec:AC-043', () => {
  // 1. Regra de cálculo de atraso
  const pastDate = '2020-01-01';
  const futureDate = '2099-12-31';

  const overdue = transactionService.calculateOverdue(pastDate, 'pending');
  assert.ok(overdue !== null, 'Transação pendente do passado deve ser marcada como em atraso');
  assert.equal(overdue.isOverdue, true);
  assert.ok(overdue.daysOverdue > 100, 'Deve calcular os dias em atraso');

  const notOverdue = transactionService.calculateOverdue(futureDate, 'pending');
  assert.equal(notOverdue, null, 'Transação futura pendente não deve estar em atraso');

  const completed = transactionService.calculateOverdue(pastDate, 'completed');
  assert.equal(completed, null, 'Transação concluída não deve ser marcada em atraso');

  // 2. Contrato visual no componente TransactionTable
  const source = readSource('components/transactions/TransactionTable.tsx');
  assert.ok(source.includes('calculateOverdue'), 'Deve invocar calculateOverdue na tabela');
  assert.ok(source.includes('Atrasada ('), 'Deve exibir badge de atraso com contagem de dias');
  assert.ok(source.includes('text-emerald-600'), 'Deve exibir receitas com cor verde');
  assert.ok(source.includes('text-rose-600'), 'Deve exibir despesas com cor vermelha');
  assert.ok(source.includes('Pago') && source.includes('Pendente'), 'Deve renderizar status textuais e ícones');
});

test('AC-044: Filtro por tipo de transação @spec:AC-044', () => {
  const source = readSource('components/transactions/TransactionFilters.tsx');
  assert.ok(source.includes("handleTypeChange('incomings')"), 'Deve possuir filtro para receitas');
  assert.ok(source.includes("handleTypeChange('expenses')"), 'Deve possuir filtro para despesas');
  assert.ok(source.includes("handleTypeChange('transfers')"), 'Deve possuir filtro para transferências');
  assert.ok(source.includes('handleTypeChange(undefined)'), 'Deve possuir opção para todas');
});

test('AC-045: Filtro por data e busca textual @spec:AC-045', () => {
  const source = readSource('components/transactions/TransactionFilters.tsx');
  assert.ok(source.includes('due_date_from'), 'Deve possuir filtro por data inicial');
  assert.ok(source.includes('due_date_to'), 'Deve possuir filtro por data final');
  assert.ok(source.includes('handleSearchChange') && source.includes('description'), 'Deve possuir busca por descrição');
});

test('AC-046: Indicador visual de parcelamento @spec:AC-046', () => {
  const source = readSource('components/transactions/TransactionTable.tsx');
  assert.ok(source.includes('current_installment'), 'Deve verificar se existe parcela');
  assert.ok(source.includes('{t.current_installment}'), 'Deve renderizar identificador da parcela ex: 3/10');
});

test('AC-060: Rolagem infinita ao aproximar do final da lista @spec:AC-060', () => {
  const hookSource = readSource('hooks/useTransactions.ts');
  assert.ok(hookSource.includes('useInfiniteQuery'), 'Deve usar useInfiniteQuery do TanStack Query');
  assert.ok(hookSource.includes('getNextPageParam'), 'Deve definir getNextPageParam baseado em has_more');
  assert.ok(hookSource.includes('lastPage.pagination?.has_more'), 'Deve ler has_more da resposta');

  const tableSource = readSource('components/transactions/TransactionTable.tsx');
  assert.ok(tableSource.includes('IntersectionObserver'), 'Deve usar IntersectionObserver para rolagem contínua');
  assert.ok(tableSource.includes('onFetchNextPage'), 'Deve chamar onFetchNextPage ao atingir o final da lista');
});

// US-012 — Criar transação simples (Receita/Despesa)
test('AC-047: Fluxo "Cafézinho" rápido (≤ 10 segundos) @spec:AC-047', () => {
  const modalSource = readSource('components/transactions/TransactionModal.tsx');
  assert.ok(modalSource.includes("initialType = 'expenses'"), 'Deve iniciar por padrão na aba de Despesa');

  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes('todayStr'), 'Data deve vir preenchida automaticamente com hoje');
  assert.ok(formSource.includes('setBankAccountId(accountsData[0].id)'), 'Conta padrão deve ser pré-selecionada');
  assert.ok(formSource.includes('autoFocus'), 'Campo de valor deve receber foco automático');
});

test('AC-048: Validação de formulário de transação @spec:AC-048', () => {
  // Teste de descrição curta (< 3 chars)
  const invalidDesc = transactionBaseSchema.safeParse({
    description: 'ab',
    value: 10,
    bank_account_id: 'acc-1',
    pay_methods_id: 'pay-1',
    category_id: 'cat-1',
    due_date: '2026-03-14',
  });
  assert.equal(invalidDesc.success, false);
  const descError = invalidDesc.error?.issues.find((i) => i.path.includes('description'));
  assert.ok(descError?.message.includes('pelo menos 3 caracteres'));

  // Teste de valor zero ou negativo
  const invalidVal = transactionBaseSchema.safeParse({
    description: 'Café',
    value: 0,
    bank_account_id: 'acc-1',
    pay_methods_id: 'pay-1',
    category_id: 'cat-1',
    due_date: '2026-03-14',
  });
  assert.equal(invalidVal.success, false);
  const valError = invalidVal.error?.issues.find((i) => i.path.includes('value'));
  assert.ok(valError?.message.includes('maior que zero'));

  // Teste válido
  const valid = transactionBaseSchema.safeParse({
    description: 'Almoço com equipe',
    value: 45.5,
    bank_account_id: 'acc-1',
    pay_methods_id: 'pay-1',
    category_id: 'cat-1',
    due_date: '2026-03-14',
  });
  assert.equal(valid.success, true);
});

test('AC-049: Categorias filtradas pelo tipo de transação @spec:AC-049', () => {
  const categorySelectSource = readSource('components/transactions/CategorySelect.tsx');
  assert.ok(categorySelectSource.includes("categoryService.getCategories(type)"), 'Deve passar type para getCategories');

  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes('CategorySelect') && formSource.includes('type={type}'), 'Formulário deve alimentar tipo correspondente');
});

test('AC-050: Marcação de "Já está pago" @spec:AC-050', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes('handleTogglePaid'), 'Deve possuir handler de alternância');
  assert.ok(formSource.includes('setPaymentDate(todayStr)'), 'Ao marcar como pago deve preencher data com hoje');
  assert.ok(formSource.includes("payment_date: isPaid ? paymentDate || todayStr : undefined"), 'Deve enviar payment_date no payload');
});

// US-013 — Criar transferência entre contas
test('AC-051: Aba de transferência no modal @spec:AC-051', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes("type === 'transfers'"), 'Deve tratar aba de transferências separadamente');
  assert.ok(formSource.includes('destinyBankAccountId'), 'Deve ter campo de conta destino');
  assert.ok(formSource.includes('bankAccountId'), 'Deve ter campo de conta de origem');
  // Em transferências, renderiza o bloco ternário exclusivo sem CategorySelect
  assert.ok(formSource.includes("type === 'transfers' ? ("), 'Deve condicionar campos por tipo');
});

test('AC-052: Validação de contas distintas @spec:AC-052', () => {
  // Teste de validação Zod para mesma conta
  const sameAccount = transferSchema.safeParse({
    description: 'Transferência entre contas',
    value: 100,
    bank_account_id: 'acc-1',
    destiny_bank_account_id: 'acc-1',
    due_date: '2026-03-14',
  });
  assert.equal(sameAccount.success, false);
  const issue = sameAccount.error?.issues[0];
  assert.equal(issue?.message, 'As contas de origem e destino devem ser diferentes');

  // Teste válido com contas distintas
  const diffAccounts = transferSchema.safeParse({
    description: 'Transferência entre contas',
    value: 100,
    bank_account_id: 'acc-1',
    destiny_bank_account_id: 'acc-2',
    due_date: '2026-03-14',
  });
  assert.equal(diffAccounts.success, true);
});

test('AC-053: Confirmação visual de transferência criada @spec:AC-053', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes('payload.destiny_bank_account_id = destinyBankAccountId'), 'Deve anexar conta de destino');

  const mutationSource = readSource('hooks/useTransactionMutations.ts');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['transactions'] })"), 'Deve invalidar cache de transações');
});

// US-014 — Criar transação parcelada ou recorrente
test('AC-054: Campos de parcelamento @spec:AC-054', () => {
  const installmentSource = readSource('components/transactions/InstallmentFields.tsx');
  assert.ok(installmentSource.includes('installmentsNumber'), 'Deve possuir campo para número de parcelas');
  assert.ok(installmentSource.includes('dueDay'), 'Deve possuir campo para dia de vencimento fixo');
  assert.ok(installmentSource.includes('firstThisMonth'), 'Deve possuir opção se 1a parcela é este mês');

  // Validação no schema base
  const parsed = transactionBaseSchema.safeParse({
    description: 'Notebook',
    value: 3000,
    bank_account_id: 'acc-1',
    pay_methods_id: 'pay-1',
    category_id: 'cat-1',
    due_date: '2026-03-14',
    is_installment: true,
    installments_number: 10,
    due_day: 15,
    first_this_month: true,
  });
  assert.equal(parsed.success, true);
});

test('AC-055: Bloqueio de cartão como receita recorrente @spec:AC-055', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes("isCreditCard && type === 'incomings' && isInstallment"), 'Deve verificar condição de bloqueio');
  assert.ok(formSource.includes('Não é possível usar cartão de crédito como forma de entrada recorrente'), 'Deve conter mensagem de erro exata');
});

// US-015 — Editar e excluir transações
test('AC-056: Edição de transação simples @spec:AC-056', () => {
  const mutationSource = readSource('hooks/useTransactionMutations.ts');
  assert.ok(mutationSource.includes('updateTransaction'), 'Deve expor mutation para updateTransaction');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['transactions'] })"), 'Deve invalidar cache no sucesso');
});

test('AC-057: Edição em lote de parcelas @spec:AC-057', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  assert.ok(formSource.includes('applyToAllInstallments'), 'Deve possuir toggle para aplicar a todas as parcelas');
  assert.ok(formSource.includes('payload.all_installments = true'), 'Deve enviar all_installments no payload quando marcado');
});

test('AC-058: Exclusão de transação concluída com aviso @spec:AC-058', () => {
  const deleteSource = readSource('components/transactions/TransactionDeleteDialog.tsx');
  assert.ok(deleteSource.includes("isCompleted = transaction.status === 'completed'"), 'Deve verificar se transação está concluída');
  assert.ok(deleteSource.includes('Esta transação já foi compensada. Ao excluí-la, o saldo da conta será revertido'), 'Deve conter mensagem de aviso');
});

test('AC-059: Exclusão de transferência remove ambos registros @spec:AC-059', () => {
  const deleteSource = readSource('components/transactions/TransactionDeleteDialog.tsx');
  assert.ok(deleteSource.includes("isTransfer = transaction.type === 'transfers'"), 'Deve verificar se é transferência');
  assert.ok(deleteSource.includes('Esta é uma transferência. A exclusão removerá ambos os lançamentos'), 'Deve avisar sobre exclusão mútua');

  const mutationSource = readSource('hooks/useTransactionMutations.ts');
  assert.ok(mutationSource.includes('deleteTransaction'), 'Deve invocar deleteTransaction');
  assert.ok(mutationSource.includes("queryClient.invalidateQueries({ queryKey: ['transactions'] })"), 'Deve invalidar cache e remover registros da lista');
});

// US-035 — Robustez de Lançamento e Experiência Mobile
test('AC-120: Responsividade Mobile do Modal de Lançamentos @spec:AC-120', () => {
  const modalSource = readSource('components/transactions/TransactionModal.tsx');
  assert.ok(modalSource.includes('max-h-['), 'Modal deve conter limitação de altura para viewport mobile');
  assert.ok(modalSource.includes('overflow-y-auto'), 'Modal deve permitir rolagem interna em telas menores');

  const filterSource = readSource('components/transactions/TransactionFilters.tsx');
  assert.ok(filterSource.includes('flex-wrap') || filterSource.includes('md:flex-row'), 'Filtros devem quebrar adequadamente no mobile');
});

test('AC-121: Carregamento Completo de Categorias no Card de Lançamento @spec:AC-121', () => {
  const serviceSource = readSource('services/category.service.ts');
  assert.ok(serviceSource.includes("api.get('/categorie')"), 'Deve consultar rota base de categorias');
  assert.ok(serviceSource.includes('list.filter') || serviceSource.includes('.filter('), 'Deve filtrar em memória por tipo garantindo exibição de todas as categorias');
});

test('AC-122: Ordenação por Data de Vencimento e Filtro Mensal Padrão @spec:AC-122', () => {
  const pageSource = readSource('pages/Transactions/index.tsx');
  assert.ok(pageSource.includes("order_by: 'due_date'"), 'Página deve inicializar ordenando por due_date');
  assert.ok(pageSource.includes('due_date_from') && pageSource.includes('due_date_to'), 'Página deve inicializar filtrando o mês por data de vencimento');

  const filtersSource = readSource('components/transactions/TransactionFilters.tsx');
  assert.ok(filtersSource.includes("order_by: 'due_date'"), 'Filtros devem preservar ordenação por data de vencimento');
  assert.ok(filtersSource.includes('handlePrevMonth') && filtersSource.includes('handleNextMonth'), 'Deve possuir navegação de meses');
});


