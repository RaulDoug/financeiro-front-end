import type { TransactionStatus } from '../types/transaction.ts';

export interface ResolveStatusParams {
  isCancelled: boolean;
  isPaid: boolean;
  dueDate?: string | null;
  referenceDate?: string; // Formato YYYY-MM-DD (padrão: hoje)
  todayStr?: string; // Alias para referenceDate
}

/**
 * Determina dinamicamente o status da transação com base no estado de cancelamento,
 * pagamento e data de vencimento (AC-245).
 */
export function resolveTransactionStatus({
  isCancelled,
  isPaid,
  dueDate,
  referenceDate,
  todayStr: aliasToday,
}: ResolveStatusParams): TransactionStatus {
  if (isCancelled) {
    return 'cancelled';
  }

  if (isPaid) {
    return 'completed';
  }

  const todayStr = aliasToday || referenceDate || new Date().toISOString().split('T')[0];
  const cleanDueDate = dueDate ? String(dueDate).split('T')[0] : '';

  if (cleanDueDate && cleanDueDate < todayStr) {
    return 'expired';
  }

  return 'pending';
}
