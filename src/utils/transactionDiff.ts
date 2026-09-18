import type { Transaction } from '../types/transaction.ts';
import type { BankAccountItem } from '../services/bankAccount.service.ts';
import type { PayMethodItem } from '../services/payMethod.service.ts';
import type { CategoryItem } from '../services/category.service.ts';
import type { CounterpartyItem } from '../services/counterparty.service.ts';

export interface DiffContext {
  accountsData?: BankAccountItem[];
  payMethodsData?: PayMethodItem[];
  allCategoriesData?: CategoryItem[];
  counterpartiesData?: CounterpartyItem[];
}

/**
 * AC-286: Calcula o diff estrito entre a transação existente e os dados do formulário,
 * enviando para o PATCH apenas as propriedades que sofreram alteração explícita.
 */
export function buildUpdateTransactionDiff(
  initialData: Transaction,
  currentPayload: any,
  context: DiffContext = {}
): Record<string, any> {
  const diff: Record<string, any> = {};

  // 1. Descrição
  if (currentPayload.description !== undefined) {
    const origDesc = (initialData.description || '').trim();
    const newDesc = String(currentPayload.description).trim();
    if (newDesc !== origDesc) {
      diff.description = newDesc;
    }
  }

  // 2. Valor
  if (currentPayload.value !== undefined) {
    const origVal = parseFloat(String(initialData.value || '0'));
    const newVal =
      typeof currentPayload.value === 'number'
        ? currentPayload.value
        : parseFloat(String(currentPayload.value || '0'));
    if (!isNaN(newVal) && Math.abs(newVal - origVal) > 0.0001) {
      diff.value = newVal;
    }
  }

  // 3. Status
  if (currentPayload.status !== undefined && currentPayload.status !== initialData.status) {
    diff.status = currentPayload.status;
  }

  // 4. Data de Vencimento (due_date)
  if (currentPayload.due_date !== undefined) {
    const origDue = initialData.due_date ? initialData.due_date.split('T')[0] : '';
    const newDue = currentPayload.due_date ? String(currentPayload.due_date).split('T')[0] : '';
    if (newDue && newDue !== origDue) {
      diff.due_date = newDue;
    }
  }

  // 5. Data de Pagamento (payment_date)
  if (currentPayload.payment_date !== undefined) {
    const origPayment = initialData.payment_date ? initialData.payment_date.split('T')[0] : '';
    const newPayment = currentPayload.payment_date ? String(currentPayload.payment_date).split('T')[0] : '';
    if (newPayment !== origPayment) {
      diff.payment_date = newPayment;
    }
  }

  // 6. Conta Bancária (bank_account_id)
  if (currentPayload.bank_account_id) {
    const origAccountId = initialData.bank_account_id;
    if (origAccountId) {
      if (currentPayload.bank_account_id !== origAccountId) {
        diff.bank_account_id = currentPayload.bank_account_id;
      }
    } else if (initialData.bank_account_name && context.accountsData) {
      const match = context.accountsData.find((a) => a.bank_name === initialData.bank_account_name);
      if (match && match.id !== currentPayload.bank_account_id) {
        diff.bank_account_id = currentPayload.bank_account_id;
      }
    }
  }

  // 7. Método de Pagamento (pay_methods_id)
  if (currentPayload.pay_methods_id) {
    const origPayMethodId = initialData.pay_methods_id || (initialData as any).pay_method_id;
    if (origPayMethodId) {
      if (currentPayload.pay_methods_id !== origPayMethodId) {
        diff.pay_methods_id = currentPayload.pay_methods_id;
      }
    } else if (initialData.pay_method_name && context.payMethodsData) {
      const match = context.payMethodsData.find((p) => p.name === initialData.pay_method_name);
      if (match && match.id !== currentPayload.pay_methods_id) {
        diff.pay_methods_id = currentPayload.pay_methods_id;
      }
    }
  }

  // 8. Categoria (category_id)
  if (currentPayload.category_id) {
    const origCategoryId = initialData.category_id;
    if (origCategoryId) {
      if (currentPayload.category_id !== origCategoryId) {
        diff.category_id = currentPayload.category_id;
      }
    } else if (initialData.category_name && context.allCategoriesData) {
      const match = context.allCategoriesData.find((c) => c.name === initialData.category_name);
      if (match && match.id !== currentPayload.category_id) {
        diff.category_id = currentPayload.category_id;
      }
    }
  }

  // 9. Contraparte (counterparty_id)
  if (currentPayload.counterparty_id) {
    const origCounterpartyId = initialData.counterparty_id;
    if (origCounterpartyId) {
      if (currentPayload.counterparty_id !== origCounterpartyId) {
        diff.counterparty_id = currentPayload.counterparty_id;
      }
    } else if (initialData.counterparty_name && context.counterpartiesData) {
      const match = context.counterpartiesData.find((cp) => cp.name === initialData.counterparty_name);
      if (match && match.id !== currentPayload.counterparty_id) {
        diff.counterparty_id = currentPayload.counterparty_id;
      }
    }
  }

  // 10. Tipo (type)
  if (currentPayload.type !== undefined && currentPayload.type !== initialData.type) {
    diff.type = currentPayload.type;
    if (currentPayload.type === 'transfers' && currentPayload.destiny_bank_account_id) {
      diff.destiny_bank_account_id = currentPayload.destiny_bank_account_id;
    }
  }

  // 11. Edição em lote de parcelas (all_installments)
  if (currentPayload.all_installments) {
    diff.all_installments = true;
  }

  return diff;
}

