import { create } from 'zustand';

export type TransactionType = 'incomings' | 'expenses' | 'transfers';

interface TransactionModalState {
  isOpen: boolean;
  defaultType: TransactionType;
  openModal: (type?: TransactionType) => void;
  closeModal: () => void;
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  isOpen: false,
  defaultType: 'expenses',
  openModal: (type = 'expenses') => set({ isOpen: true, defaultType: type }),
  closeModal: () => set({ isOpen: false }),
}));
