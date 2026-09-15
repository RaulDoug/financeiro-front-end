import { create } from 'zustand';
import type { Transaction } from '../types/transaction.ts';

interface TransactionDetailsModalState {
  isOpen: boolean;
  transaction: Transaction | null;
  onEditCallback?: ((transaction: Transaction) => void) | null;
  onDeleteCallback?: ((transaction: Transaction) => void) | null;
  openModal: (
    transaction: Transaction,
    callbacks?: {
      onEdit?: (transaction: Transaction) => void;
      onDelete?: (transaction: Transaction) => void;
    }
  ) => void;
  closeModal: () => void;
}

export const useTransactionDetailsModalStore = create<TransactionDetailsModalState>((set) => ({
  isOpen: false,
  transaction: null,
  onEditCallback: null,
  onDeleteCallback: null,
  openModal: (transaction, callbacks) =>
    set({
      isOpen: true,
      transaction,
      onEditCallback: callbacks?.onEdit ?? null,
      onDeleteCallback: callbacks?.onDelete ?? null,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      transaction: null,
      onEditCallback: null,
      onDeleteCallback: null,
    }),
}));
