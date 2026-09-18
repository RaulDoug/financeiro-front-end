// Testes de spec da feature lancamento-mobile-agil
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');

function readSource(subpath) {
  return fs.readFileSync(path.join(SRC_DIR, subpath), 'utf8');
}

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-224: Fechamento do drawer ao tocar fora (Backdrop Click) @spec:AC-224', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // O container backdrop deve possuir onClick={onClose}
  assert.ok(
    quickEntrySource.includes('data-testid="mobile-quick-entry-container"') &&
    quickEntrySource.includes('onClick={onClose}'),
    'Container raiz deve ter onClick={onClose} para fechar ao clicar no backdrop externo'
  );

  // O card interior da gaveta deve parar a propagação do clique
  assert.ok(
    quickEntrySource.includes('e.stopPropagation()'),
    'O card interno deve invocar e.stopPropagation() para não fechar ao clicar no formulário'
  );

  // Deve possuir botão explícito de fechar
  assert.ok(
    quickEntrySource.includes('aria-label="Fechar"') &&
    quickEntrySource.includes('onClick={onClose}'),
    'Deve manter o botão X com onClose acessível'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-225: Remoção do teclado numérico customizado e valor com entrada nativa @spec:AC-225', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // O teclado virtual de 12 botões numéricos não deve estar presente
  assert.ok(
    !quickEntrySource.includes('keypad-btn-1') &&
    !quickEntrySource.includes('keypad-btn-backspace'),
    'MobileQuickEntry não deve renderizar botões de teclado virtual que ocupam a tela'
  );

  // O campo monetário deve utilizar entrada nativa amigável ao teclado do dispositivo
  assert.ok(
    quickEntrySource.includes('inputMode="numeric"') ||
    quickEntrySource.includes('inputMode="decimal"'),
    'Campo de valor deve definir inputMode="numeric" ou "decimal" para teclado nativo do dispositivo'
  );

  // Deve exibir o valor em destaque com prefixo R$
  assert.ok(
    quickEntrySource.includes('data-testid="quick-entry-display-value"') &&
    quickEntrySource.includes('R$'),
    'Display de valor deve exibir o montante formatado com o prefixo R$'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-226: Seleção fácil e estruturada de descrição, conta, categoria e método de pagamento @spec:AC-226', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Campo Descrição
  assert.ok(
    quickEntrySource.includes('data-testid="quick-entry-description-input"'),
    'Deve conter campo de texto estruturado para Descrição'
  );

  // Seletor de Conta Bancária
  assert.ok(
    quickEntrySource.includes('data-testid="select-quick-account"') &&
    quickEntrySource.includes('bank_name'),
    'Deve possuir seletor estruturado para Conta Bancária'
  );

  // Seletor de Categoria
  assert.ok(
    quickEntrySource.includes('data-testid="select-quick-category"') &&
    (quickEntrySource.includes('filteredCategories.map') || quickEntrySource.includes('categories.map')),
    'Deve possuir seletor estruturado para Categoria'
  );

  // Seletor de Método de Pagamento
  assert.ok(
    quickEntrySource.includes('data-testid="select-quick-pay-method"') &&
    quickEntrySource.includes('payMethodsData.map'),
    'Deve possuir seletor estruturado para Método de Pagamento'
  );

  // Suporte a transferência entre contas
  assert.ok(
    quickEntrySource.includes('data-testid="select-quick-destiny-account"') &&
    quickEntrySource.includes('destiny_bank_account_id'),
    'Deve suportar seleção de conta de destino para transferências'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-227: Status de liquidação ("Já está pago") e confirmação de lançamento @spec:AC-227', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Interruptor de "Já está pago"
  assert.ok(
    quickEntrySource.includes('data-testid="toggle-quick-paid"') &&
    quickEntrySource.includes('role="switch"') &&
    quickEntrySource.includes('aria-checked={isPaid}'),
    'Deve incluir interruptor acessível para marcar status "Já está pago"'
  );

  // Botão de salvar
  assert.ok(
    quickEntrySource.includes('data-testid="btn-quick-entry-save"') &&
    quickEntrySource.includes('Confirmar Lançamento (Salvar)'),
    'Deve incluir o botão Confirmar Lançamento (Salvar)'
  );

  // Payload completo no salvamento
  assert.ok(
    quickEntrySource.includes('description') &&
    quickEntrySource.includes('value:') &&
    quickEntrySource.includes('type,') &&
    quickEntrySource.includes('bank_account_id') &&
    quickEntrySource.includes('category_id') &&
    quickEntrySource.includes('pay_methods_id') &&
    quickEntrySource.includes('isPaid ? \'completed\' : \'pending\''),
    'Payload de submissão deve conter description, value, type, bank_account_id, category_id, pay_methods_id e status'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-228: Campos de data de vencimento e data de pagamento com padrão na data atual @spec:AC-228', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Inputs dedicados para Data de Vencimento e Data de Pagamento
  assert.ok(
    quickEntrySource.includes('data-testid="input-quick-due-date"') &&
    quickEntrySource.includes('data-testid="input-quick-payment-date"'),
    'Deve possuir inputs dedicados para data de vencimento e data de pagamento'
  );

  // Rótulos de Data de Vencimento e Data de Pagamento
  assert.ok(
    quickEntrySource.includes('Data de Vencimento') &&
    quickEntrySource.includes('Data de Pagamento'),
    'Deve exibir labels claros para Data de Vencimento e Data de Pagamento'
  );

  // Fallback e inicialização com data atual se nada for informado
  assert.ok(
    quickEntrySource.includes('todayStr') &&
    quickEntrySource.includes('finalDueDate') &&
    quickEntrySource.includes('finalPaymentDate'),
    'Deve adotar a data atual como padrão se usuário não informar'
  );

  // Envio no payload de salvamento
  assert.ok(
    quickEntrySource.includes('due_date: finalDueDate') &&
    quickEntrySource.includes('payment_date: isPaid ? finalPaymentDate : undefined'),
    'Deve repassar finalDueDate e finalPaymentDate para o payload'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-229: Injeção automática de contraparte e tratamento de erro 400 @spec:AC-229', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve garantir contraparte no payload
  assert.ok(
    quickEntrySource.includes('counterparty_id') &&
    quickEntrySource.includes('finalCounterpartyId'),
    'Deve assegurar contraparte válida no payload para evitar erro HTTP 400'
  );

  // Deve possuir banner de erro caso ocorra falha na submissão
  assert.ok(
    quickEntrySource.includes('data-testid="quick-entry-error-banner"') &&
    quickEntrySource.includes('errorBanner'),
    'Deve exibir banner de erro acessível com data-testid="quick-entry-error-banner"'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-230: Edição fluida e acionamento direto do calendário nos campos de data @spec:AC-230', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve chamar showPicker ao clicar nos cards de data
  assert.ok(
    quickEntrySource.includes('showPicker') &&
    quickEntrySource.includes('data-testid="input-quick-due-date"') &&
    quickEntrySource.includes('data-testid="input-quick-payment-date"'),
    'Cards de data devem disparar showPicker() nos inputs nativos para abrir o calendário'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-231: Botão de confirmação de lançamento ampliado e ergonômico @spec:AC-231', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve ter altura mínima min-h-14, padding vertical ampliado (py-), text-base e rounded-2xl
  assert.ok(
    (quickEntrySource.includes('h-14') || quickEntrySource.includes('min-h-14')) &&
    quickEntrySource.includes('py-') &&
    quickEntrySource.includes('text-base') &&
    quickEntrySource.includes('rounded-2xl') &&
    quickEntrySource.includes('data-testid="btn-quick-entry-save"'),
    'Botão de confirmação deve ter dimensões ampliadas com min-h-14, py- (padding vertical aumentado), text-base e rounded-2xl'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-232: Seletor dedicado de Contraparte (Favorecido / Pagador) @spec:AC-232', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve ter seletor de contraparte
  assert.ok(
    quickEntrySource.includes('data-testid="select-quick-counterparty"') &&
    quickEntrySource.includes('data-testid="chip-counterparty"'),
    'Deve incluir o seletor visual e elemento select para contraparte'
  );

  // Deve possuir rótulo dinâmico para Pagador e Beneficiário
  assert.ok(
    quickEntrySource.includes('Pagador / Origem') &&
    quickEntrySource.includes('Beneficiário / Destino'),
    'Deve exibir rótulos contextuais para tipo incomings e expenses'
  );

  // Deve buscar e mapear contrapartes da carteira
  assert.ok(
    quickEntrySource.includes('counterpartiesData') &&
    quickEntrySource.includes('filteredCounterparties.map'),
    'Deve carregar e listar contrapartes da carteira atual'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-233: Ocultação de contraparte em transferências e contraparte interna padrão Transferências @spec:AC-233', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');
  const settingsSource = readSource('pages/Settings/CounterpartiesSettings.tsx');

  // Na aba transferência, contraparte fica oculta e forma de pagamento é exibida de forma isolada
  assert.ok(
    quickEntrySource.includes("type === 'transfers' ?") &&
    quickEntrySource.includes('chip-pay-method'),
    'Deve ocultar seletor visual de contraparte quando na aba Transferência'
  );

  // Injeção ou auto-criação silenciosa da contraparte "Transferências"
  assert.ok(
    quickEntrySource.includes("name: 'Transferências'") &&
    quickEntrySource.includes('transferMatch'),
    'Deve auto-vincular ou auto-criar contraparte interna com nome Transferências'
  );

  // Exclusão da contraparte Transferências das opções selecionáveis de receitas/despesas
  assert.ok(
    quickEntrySource.includes("cp.name.toLowerCase() !== 'transferências'"),
    'Deve ocultar contraparte Transferências do dropdown de receitas e despesas'
  );

  // Exclusão da contraparte Transferências da listagem de gerenciamento de contrapartes
  assert.ok(
    settingsSource.includes("c.name.toLowerCase() !== 'transferências'"),
    'Deve ocultar contraparte Transferências da tela de configurações para prevenir exclusão pelo usuário'
  );
});

// US-064 — Lançamento Ágil Mobile Sem Teclado Virtual e com Seletores Estruturados
test('AC-237: Suporte a opção de parcelamento e recorrência no layout mobile @spec:AC-237', () => {
  const quickEntrySource = readSource('components/transactions/MobileQuickEntry.tsx');

  // Deve importar InstallmentFields
  assert.ok(
    quickEntrySource.includes("import { InstallmentFields } from './InstallmentFields.tsx';"),
    'MobileQuickEntry deve importar InstallmentFields'
  );

  // Deve instanciar o componente InstallmentFields para tipos diferentes de transfers
  assert.ok(
    quickEntrySource.includes('<InstallmentFields') &&
    quickEntrySource.includes('isInstallment={isInstallment}') &&
    quickEntrySource.includes('isRecurrent={isRecurrent}') &&
    quickEntrySource.includes('installmentsNumber={installmentsNumber}'),
    'MobileQuickEntry deve renderizar InstallmentFields repassando os estados de parcelamento'
  );

  // Deve repassar parâmetros de parcelamento no payload quando isInstallment for true
  assert.ok(
    quickEntrySource.includes('payload.installments_number = installmentsNumber;') &&
    quickEntrySource.includes('payload.due_day = dueDay;') &&
    quickEntrySource.includes('payload.first_this_month = firstThisMonth;'),
    'MobileQuickEntry deve incluir installments_number, due_day e first_this_month no payload'
  );
});


