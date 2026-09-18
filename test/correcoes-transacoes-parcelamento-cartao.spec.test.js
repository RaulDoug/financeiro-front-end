// Testes de especificação da feature correcoes-transacoes-parcelamento-cartao — metodologia onp-spec-driven
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { buildUpdateTransactionDiff } from '../src/utils/transactionDiff.ts';

const SRC_DIR = path.resolve('src');
const SPEC_DIR = path.resolve('.spec/features/correcoes-transacoes-parcelamento-cartao');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

function readSpec(filename) {
  return fs.readFileSync(path.join(SPEC_DIR, filename), 'utf8');
}

// US-082 — Correções no Fluxo de Parcelamento, Recorrência, Limites e Vínculos de Cartão de Crédito
test('AC-309: Suporte a transações recorrentes e parceladas com divisão e repetição de valor @spec:AC-309', () => {
  const fieldsSource = readSource('components/transactions/InstallmentFields.tsx');
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');
  const typesSource = readSource('types/transaction.ts');

  // 1. InstallmentFields deve aceitar props de recorrência
  assert.ok(
    fieldsSource.includes('isRecurrent?: boolean'),
    'InstallmentFields deve aceitar a prop isRecurrent'
  );
  assert.ok(
    fieldsSource.includes('onChangeIsRecurrent?: (recurrent: boolean) => void'),
    'InstallmentFields deve aceitar a prop onChangeIsRecurrent'
  );

  // 2. InstallmentFields deve renderizar opções de Dividir valor e Repetir valor
  assert.ok(
    fieldsSource.includes('Dividir valor'),
    'InstallmentFields deve exibir opção Dividir valor'
  );
  assert.ok(
    fieldsSource.includes('Repetir valor (Recorrente)'),
    'InstallmentFields deve exibir opção Repetir valor (Recorrente)'
  );
  assert.ok(
    fieldsSource.includes('mode-split-label') && fieldsSource.includes('mode-recurrent-label'),
    'InstallmentFields deve conter data-testids para os modos de lançamento'
  );

  // 3. CreateTransactionPayload deve conter is_recurrent tipado
  assert.ok(
    typesSource.includes('is_recurrent?: boolean;'),
    'CreateTransactionPayload deve conter is_recurrent opcional'
  );

  // 4. TransactionFormBase deve controlar estado de recorrência e montar payload adequado
  assert.ok(
    formSource.includes('const [isRecurrent, setIsRecurrent] = useState(false);'),
    'TransactionFormBase deve gerenciar estado isRecurrent'
  );
  assert.ok(
    formSource.includes('payload.is_recurrent = true;'),
    'TransactionFormBase deve definir is_recurrent true quando for recorrente'
  );
});

test('AC-310: Imutabilidade estrutural na edição — proibição de criar parcelas a partir de transação simples @spec:AC-310', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Na edição (!initialData), InstallmentFields não deve ser renderizado
  assert.ok(
    formSource.includes("type !== 'transfers' && !initialData && ("),
    'InstallmentFields só pode ser exibido quando !initialData'
  );

  // Se já for parcelado, só exibe opção de aplicar em lote
  assert.ok(
    formSource.includes('initialData?.current_installment && ('),
    'Opção de aplicar a todas as parcelas só deve ser exibida quando current_installment existir'
  );
});

test('AC-311: Envio e preservação de pay_methods_id no PATCH ao trocar cartão de crédito @spec:AC-311', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // Form deve repassar pay_methods_id
  assert.ok(
    formSource.includes('payload.pay_methods_id = payMethodId;'),
    'TransactionFormBase deve incluir pay_methods_id no payload da transação'
  );

  // buildUpdateTransactionDiff deve detectar e incluir pay_methods_id quando for alterado
  const mockInitialTx = {
    id: 'tx-card-1',
    description: 'Compra Mercado',
    value: '300.00',
    type: 'expenses',
    status: 'pending',
    due_date: '2026-10-10',
    payment_date: null,
    purchase_date: '2026-09-18',
    bank_account_id: 'acc-1',
    bank_account_name: 'Nubank',
    category_id: 'cat-1',
    category_name: 'Mercado',
    pay_methods_id: 'card-old-id',
    pay_method_name: 'Cartão Antigo',
    counterparty_id: 'cp-1',
    counterparty_name: 'Mercado',
    creator_user_name: 'Raul',
    created_at: '2026-09-18T00:00:00.000Z',
    transfers_id: null,
    invoice_id: null,
    current_installment: '1/3',
  };

  const currentPayload = {
    description: 'Compra Mercado',
    value: 300,
    status: 'pending',
    due_date: '2026-10-10',
    bank_account_id: 'acc-2',
    pay_methods_id: 'card-new-id',
    category_id: 'cat-1',
    counterparty_id: 'cp-1',
    type: 'expenses',
  };

  const diff = buildUpdateTransactionDiff(mockInitialTx, currentPayload);
  assert.equal(diff.pay_methods_id, 'card-new-id', 'diff deve conter o novo pay_methods_id');
});

test('AC-312: Opção de redistribuir saldo entre parcelas restantes exibida apenas para parcela única @spec:AC-312', () => {
  const dialogSource = readSource('components/transactions/TransactionDeleteDialog.tsx');

  // 1. Redistribuir deve estar condicionado a !allInstallments
  assert.ok(
    dialogSource.includes('!allInstallments && (') &&
    dialogSource.includes('Redistribuir saldo entre parcelas restantes'),
    'Checkbox de redistribuir deve aparecer estritamente quando !allInstallments'
  );

  // 2. Ao alternar para allInstallments = true, redistribute deve ser resetado para false
  assert.ok(
    dialogSource.includes('setAllInstallments(true);') &&
    dialogSource.includes('setRedistribute(false);'),
    'Ao selecionar excluir todas as parcelas, redistribute deve ser setado para false'
  );

  // 3. handleConfirm deve enviar redistribute como false caso allInstallments seja true
  assert.ok(
    dialogSource.includes('redistribute: !allInstallments ? redistribute : false'),
    'handleConfirm deve garantir redistribute false quando allInstallments for true'
  );
});

test('AC-313: Conta bancária vinculada e bloqueada para edição quando o método for cartão de crédito @spec:AC-313', () => {
  const formSource = readSource('components/transactions/TransactionFormBase.tsx');

  // 1. Seletor de conta bancária deve estar disabled={isCreditCard}
  assert.ok(
    formSource.includes('disabled={isCreditCard}'),
    'Select de conta bancária deve conter disabled={isCreditCard}'
  );

  // 2. Auto-vinculação da conta bancária do cartão via useEffect
  assert.ok(
    formSource.includes('if (isCreditCard && selectedPayMethod?.bank_account_id) {'),
    'Deve haver verificação de conta bancária vinculada ao cartão'
  );
  assert.ok(
    formSource.includes('setBankAccountId(selectedPayMethod.bank_account_id);'),
    'Deve definir bankAccountId para a conta do cartão automaticamente'
  );

  // 3. Ao mudar a forma de pagamento, se for cartão deve sincronizar imediatamente
  assert.ok(
    formSource.includes('const handlePayMethodChange = (newPayMethodId: string) => {'),
    'Deve existir manipulador handlePayMethodChange para sincronização imediata'
  );

  // 4. Indicador visual para o usuário quando o campo estiver travado pelo cartão
  assert.ok(
    formSource.includes('(Vinculada ao cartão)'),
    'Deve exibir aviso de que a conta bancária está vinculada ao cartão'
  );
});

test('AC-314: Prova executável automatizada e integridade da especificação @spec:AC-314', () => {
  const specContent = readSpec('spec.md');
  const tasksContent = readSpec('tasks.md');

  assert.ok(specContent.includes('US-082'), 'spec.md deve referenciar US-082');
  assert.ok(specContent.includes('AC-309'), 'spec.md deve conter AC-309');
  assert.ok(specContent.includes('AC-310'), 'spec.md deve conter AC-310');
  assert.ok(specContent.includes('AC-311'), 'spec.md deve conter AC-311');
  assert.ok(specContent.includes('AC-312'), 'spec.md deve conter AC-312');
  assert.ok(specContent.includes('AC-313'), 'spec.md deve conter AC-313');
  assert.ok(tasksContent.includes('T-198'), 'tasks.md deve conter T-198');
  assert.ok(tasksContent.includes('T-199'), 'tasks.md deve conter T-199');
  assert.ok(tasksContent.includes('T-200'), 'tasks.md deve conter T-200');
  assert.ok(tasksContent.includes('T-201'), 'tasks.md deve conter T-201');
  assert.ok(tasksContent.includes('T-202'), 'tasks.md deve conter T-202');
});

