import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OnboardingState {
  currentStep: number;
  createdWalletId: string | null;
  createdWalletName: string;
  createdBankAccountId: string | null;
  draftWalletName: string;
  draftBankName: string;
  draftBalance: string;
  draftAllowNegativeBalance: boolean;

  setCurrentStep: (step: number) => void;
  setCreatedWallet: (id: string, name: string) => void;
  setCreatedBankAccount: (id: string) => void;
  setDraftWallet: (name: string) => void;
  setDraftBankAccount: (data: Partial<{ bank_name: string; balance: string; allow_negative_balance: boolean }>) => void;
  resetOnboarding: () => void;
}

const memoryStorage = new Map<string, string>();
const storage = typeof window !== 'undefined' && window.localStorage
  ? window.localStorage
  : {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
      removeItem: (key: string) => { memoryStorage.delete(key); },
    };

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      createdWalletId: null,
      createdWalletName: '',
      createdBankAccountId: null,
      draftWalletName: '',
      draftBankName: '',
      draftBalance: '',
      draftAllowNegativeBalance: false,

      setCurrentStep: (step: number) => set({ currentStep: step }),

      setCreatedWallet: (id: string, name: string) =>
        set({
          createdWalletId: id,
          createdWalletName: name,
          draftWalletName: name,
        }),

      setCreatedBankAccount: (id: string) =>
        set({
          createdBankAccountId: id,
        }),

      setDraftWallet: (name: string) =>
        set({
          draftWalletName: name,
        }),

      setDraftBankAccount: (data) =>
        set((state) => ({
          draftBankName: data.bank_name !== undefined ? data.bank_name : state.draftBankName,
          draftBalance: data.balance !== undefined ? data.balance : state.draftBalance,
          draftAllowNegativeBalance:
            data.allow_negative_balance !== undefined
              ? data.allow_negative_balance
              : state.draftAllowNegativeBalance,
        })),

      resetOnboarding: () =>
        set({
          currentStep: 1,
          createdWalletId: null,
          createdWalletName: '',
          createdBankAccountId: null,
          draftWalletName: '',
          draftBankName: '',
          draftBalance: '',
          draftAllowNegativeBalance: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => storage as Storage),
    }
  )
);

