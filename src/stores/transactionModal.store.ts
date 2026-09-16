import { create } from 'zustand';
import type { Transaction } from '../types/transaction.ts';

export type TransactionType = 'incomings' | 'expenses' | 'transfers';

interface TransactionModalState {
  isOpen: boolean;
  defaultType: TransactionType;
  initialData?: Transaction | null;
  openModal: (type?: TransactionType, initialData?: Transaction | null) => void;
  closeModal: () => void;
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  isOpen: false,
  defaultType: 'expenses',
  initialData: null,
  openModal: (type = 'expenses', initialData = null) =>
    set({ isOpen: true, defaultType: type, initialData }),
  closeModal: () => set({ isOpen: false, initialData: null }),
}));
