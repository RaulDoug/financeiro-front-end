// Testes de especificação da feature data-compra-lancamento-transacoes — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateTransactionDiff } from '../src/utils/transactionDiff.ts';
import { resolveTransactionDate } from '../src/utils/formatDate.ts';

const SRC_DIR = path.resolve('src');
const SPEC_DIR = path.resolve('.spec/features/data-compra-lancamento-transacoes');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

function readSpec(filename) {
  return fs.readFileSync(path.join(SPEC_DIR, filename), 'utf8');
}

// US-097 — Definição e Personalização da Data da Compra no Lançamento de Transações

test('AC-347: Campo Data da Compra no layout desktop TransactionFormBase.tsx @spec:AC-347', () => {
  const desktopSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Input dedicado para Data da Compra com data-testid
  assert.ok(
    desktopSource.includes('data-testid="input-purchase-date"'),
    'TransactionFormBase deve conter input com data-testid="input-purchase-date"'
  );

  // Label amigável do campo
  assert.ok(
    desktopSource.includes('Data da Compra'),
    'TransactionFormBase deve exibir label com texto Data da Compra'
  );

  // Vínculo ao estado purchaseDate
  assert.ok(
    desktopSource.includes('value={purchaseDate}') &&
    desktopSource.includes('setPurchaseDate(e.target.value)'),
    'Input de data da compra deve estar vinculado ao estado purchaseDate'
  );

  // Inicialização padrão com fallback na data atual (todayStr) e sincronização com initialData
  assert.ok(
    desktopSource.includes('initialData?.purchase_date ? initialData.purchase_date.split(\'T\')[0] : todayStr') &&
    desktopSource.includes('if (initialData.purchase_date) {'),
    'Estado purchaseDate deve inicializar com initialData ou todayStr e sincronizar no useEffect'
  );

  // Inclusão no payload para tipos diferentes de transferência
  assert.ok(
    desktopSource.includes('payload.purchase_date = purchaseDate || todayStr;'),
    'TransactionFormBase deve incluir purchase_date no payload de submissão'
  );
});

test('AC-348: Campo Data da Compra no fluxo ágil mobile MobileQuickEntry.tsx @spec:AC-348', () => {
  const mobileSource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Chip e input com test-ids correspondentes
  assert.ok(
    mobileSource.includes('data-testid="chip-purchase-date"') &&
    mobileSource.includes('data-testid="input-quick-purchase-date"'),
    'MobileQuickEntry deve possuir chip e input com test-ids dedicados para data da compra'
  );

  // Acionamento ergonômico por showPicker
  assert.ok(
    mobileSource.includes('data-testid="chip-purchase-date"') &&
    mobileSource.includes('showPicker()'),
    'Chip de data da compra mobile deve acionar showPicker() ao ser tocado'
  );

  // Inicialização e reset de ciclo de vida
  assert.ok(
    mobileSource.includes('const [purchaseDate, setPurchaseDate] = useState(() => todayStr);') &&
    mobileSource.includes('setPurchaseDate(todayStr);'),
    'MobileQuickEntry deve gerenciar purchaseDate iniciando em todayStr e resetando ao abrir ou salvar'
  );

  // Inclusão no payload em handleSave
  assert.ok(
    mobileSource.includes('const finalPurchaseDate = purchaseDate.trim() || todayStr;') &&
    mobileSource.includes('payload.purchase_date = finalPurchaseDate;'),
    'MobileQuickEntry deve calcular finalPurchaseDate e repassar no payload'
  );
});

test('AC-349: Detecção de alteração de purchase_date em buildUpdateTransactionDiff @spec:AC-349', () => {
  const diffSource = readSource('utils/transactionDiff.ts');

  // Verifica que o utilitário possui a lógica de comparação para purchase_date
  assert.ok(
    diffSource.includes('currentPayload.purchase_date !== undefined') &&
    diffSource.includes('diff.purchase_date = newPurchase;'),
    'buildUpdateTransactionDiff deve conter lógica para computar diff de purchase_date'
  );

  const mockTx = {
    id: 'tx-test-1',
    description: 'Jantar',
    value: '80.00',
    type: 'expenses',
    status: 'pending',
    due_date: '2026-10-05T00:00:00.000Z',
    payment_date: null,
    purchase_date: '2026-09-29T00:00:00.000Z',
  };

  // 1. Sem alteração de purchase_date -> não gera diff
  const unchangedDiff = buildUpdateTransactionDiff(mockTx, {
    description: 'Jantar',
    value: 80,
    status: 'pending',
    due_date: '2026-10-05',
    purchase_date: '2026-09-29',
  });
  assert.equal(unchangedDiff.purchase_date, undefined, 'Sem alteração, purchase_date não deve entrar no diff');

  // 2. Com alteração de purchase_date -> gera propriedade no diff
  const changedDiff = buildUpdateTransactionDiff(mockTx, {
    description: 'Jantar',
    value: 80,
    status: 'pending',
    due_date: '2026-10-05',
    purchase_date: '2026-09-25',
  });
  assert.equal(changedDiff.purchase_date, '2026-09-25', 'Ao alterar, purchase_date deve estar presente no diff com o novo valor');
});

test('AC-350: Preservação de datas e ordem de resolução de data da transação @spec:AC-350', () => {
  // Teste unitário da função de resolução de data
  const dateFromPayment = resolveTransactionDate({
    payment_date: '2026-09-28',
    purchase_date: '2026-09-20',
    due_date: '2026-10-01',
  });
  assert.equal(dateFromPayment, '2026-09-28', 'Prioridade máxima deve ser payment_date');

  const dateFromPurchase = resolveTransactionDate({
    payment_date: null,
    purchase_date: '2026-09-20',
    due_date: '2026-10-01',
  });
  assert.equal(dateFromPurchase, '2026-09-20', 'Prioridade intermediária deve ser purchase_date');

  const dateFromDue = resolveTransactionDate({
    payment_date: null,
    purchase_date: null,
    due_date: '2026-10-01',
  });
  assert.equal(dateFromDue, '2026-10-01', 'Prioridade final de fallback deve ser due_date');
});

test('AC-351: Conformidade da especificação e rastreabilidade onp-spec-driven @spec:AC-351', () => {
  const specContent = readSpec('spec.md');
  const tasksContent = readSpec('tasks.md');

  // Validação da US-097 e critérios AC-347 a AC-351
  assert.ok(specContent.includes('US-097'), 'spec.md deve referenciar US-097');
  assert.ok(specContent.includes('AC-347'), 'spec.md deve conter AC-347');
  assert.ok(specContent.includes('AC-348'), 'spec.md deve conter AC-348');
  assert.ok(specContent.includes('AC-349'), 'spec.md deve conter AC-349');
  assert.ok(specContent.includes('AC-350'), 'spec.md deve conter AC-350');
  assert.ok(specContent.includes('AC-351'), 'spec.md deve conter AC-351');

  // Validação de tarefas T-227 a T-230
  assert.ok(tasksContent.includes('T-227'), 'tasks.md deve conter T-227');
  assert.ok(tasksContent.includes('T-228'), 'tasks.md deve conter T-228');
  assert.ok(tasksContent.includes('T-229'), 'tasks.md deve conter T-229');
  assert.ok(tasksContent.includes('T-230'), 'tasks.md deve conter T-230');
});
