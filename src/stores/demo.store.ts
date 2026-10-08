import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DEMO_USER,
  DEMO_WALLET,
  DEMO_BANK_ACCOUNTS,
  DEMO_CATEGORIES,
  DEMO_PAY_METHODS,
  DEMO_COUNTERPARTIES,
  getInitialDemoTransactions,
} from '../mocks/demoData.ts';
import type { BankAccountItem } from '../types/bankAccount.ts';
import type { CategoryItem } from '../services/category.service.ts';
import type { PayMethodItem } from '../services/payMethod.service.ts';
import type { CounterpartyItem } from '../services/counterparty.service.ts';
import type {
  Transaction,
  TransactionListResponse,
  TransactionFilters,
  CreateTransactionPayload,
} from '../types/transaction.ts';
import type {
  DashboardSummary,
  AccountBalancesReport,
  ExpenseByCategoryReport,
  IncomeVsExpenseReport,
  CreditCardSummaryReport,
  OverdueAlertsReport,
  RecentTransactionsReport,
} from '../types/dashboard.ts';
import { useAuthStore } from './auth.store.ts';
import { useWalletStore } from './wallet.store.ts';

interface DemoState {
  isDemoMode: boolean;
  bankAccounts: BankAccountItem[];
  categories: CategoryItem[];
  payMethods: PayMethodItem[];
  counterparties: CounterpartyItem[];
  transactions: Transaction[];

  enterDemo: () => void;
  exitDemo: () => void;
  resetDemoData: () => void;

  addTransaction: (payload: CreateTransactionPayload) => Transaction;
  getTransactions: (filters?: TransactionFilters) => TransactionListResponse;
  getAnnualDRE: (year?: number) => IncomeVsExpenseReport;
  getExpenseByCategory: (params?: { startDate?: string; endDate?: string }) => ExpenseByCategoryReport;
  getDashboardSummary: (params?: { startDate?: string; endDate?: string }) => DashboardSummary;
  getAccountBalances: () => AccountBalancesReport;
  getCreditCardSummary: () => CreditCardSummaryReport;
  getRecentTransactions: (limit?: number) => RecentTransactionsReport;
  getOverdueAlerts: () => OverdueAlertsReport;
}

const memoryStorage = new Map<string, string>();
const storage = typeof window !== 'undefined' && window.localStorage
  ? window.localStorage
  : {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
      removeItem: (key: string) => { memoryStorage.delete(key); },
    };

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      isDemoMode: false,
      bankAccounts: DEMO_BANK_ACCOUNTS,
      categories: DEMO_CATEGORIES,
      payMethods: DEMO_PAY_METHODS,
      counterparties: DEMO_COUNTERPARTIES,
      transactions: getInitialDemoTransactions(),

      enterDemo: () => {
        const state = get();
        const hasTransactions = state.transactions && state.transactions.length > 0;

        set({
          isDemoMode: true,
          bankAccounts: state.bankAccounts?.length ? state.bankAccounts : DEMO_BANK_ACCOUNTS,
          categories: state.categories?.length ? state.categories : DEMO_CATEGORIES,
          payMethods: state.payMethods?.length ? state.payMethods : DEMO_PAY_METHODS,
          counterparties: state.counterparties?.length ? state.counterparties : DEMO_COUNTERPARTIES,
          transactions: hasTransactions ? state.transactions : getInitialDemoTransactions(),
        });

        // Configurar sessão fake no useAuthStore
        useAuthStore.getState().setAuth(DEMO_USER, 'mock-demo-session-token');
        useAuthStore.getState().setActiveWalletId(DEMO_WALLET.id);

        // Configurar wallet fake no useWalletStore
        useWalletStore.setState({
          wallets: [DEMO_WALLET as any],
          currentWalletId: DEMO_WALLET.id,
          hasCheckedWallets: true,
          isLoading: false,
        });
      },

      exitDemo: () => {
        set({
          isDemoMode: false,
          bankAccounts: DEMO_BANK_ACCOUNTS,
          categories: DEMO_CATEGORIES,
          payMethods: DEMO_PAY_METHODS,
          counterparties: DEMO_COUNTERPARTIES,
          transactions: getInitialDemoTransactions(),
        });

        useAuthStore.getState().logout();
        useWalletStore.setState({
          wallets: [],
          currentWalletId: null,
          hasCheckedWallets: false,
          isLoading: false,
        });

        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('finflow-demo-storage');
        }
      },

      resetDemoData: () => {
        set({
          bankAccounts: DEMO_BANK_ACCOUNTS,
          categories: DEMO_CATEGORIES,
          payMethods: DEMO_PAY_METHODS,
          counterparties: DEMO_COUNTERPARTIES,
          transactions: getInitialDemoTransactions(),
        });
      },

      addTransaction: (payload: CreateTransactionPayload) => {
        const { transactions, bankAccounts, categories, payMethods, counterparties } = get();

        const cat = categories.find((c) => String(c.id) === String(payload.category_id));
        const bank = bankAccounts.find((b) => String(b.id) === String(payload.bank_account_id));
        const pay = payMethods.find((p) => String(p.id) === String(payload.pay_methods_id));
        const cp = counterparties.find((c) => String(c.id) === String(payload.counterparty_id));

        const numVal = Math.abs(Number(payload.value) || 0);
        const valStr = numVal.toFixed(2);
        const nowIso = new Date().toISOString();
        const dateStr = payload.due_date || payload.purchase_date || payload.payment_date || nowIso.split('T')[0];

        const newTx: Transaction = {
          id: `demo-tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          value: valStr,
          description: payload.description || 'Lançamento Demonstração',
          type: (payload.type as any) || 'expenses',
          status: (payload.status as any) || 'completed',
          due_date: payload.due_date || dateStr,
          payment_date: payload.payment_date || (payload.status === 'completed' ? dateStr : null),
          purchase_date: payload.purchase_date || dateStr,
          transfers_id: null,
          invoice_id: null,
          current_installment: (payload as any).current_installment || null,
          total_installments: (payload as any).total_installments || (payload as any).installments_number || null,
          bank_account_name: bank?.bank_name || 'Nubank Conta Corrente',
          bank_account_id: payload.bank_account_id || 'demo-bank-1',
          category_name: cat?.name || null,
          category_id: payload.category_id || null,
          pay_method_name: pay?.name || 'Pix / Transferência',
          pay_methods_id: payload.pay_methods_id || 'demo-pay-pix',
          counterparty_name: cp?.name || null,
          counterparty_id: payload.counterparty_id || null,
          creator_user_name: 'Usuário Demonstração',
          created_at: nowIso,
        };

        // Atualizar saldo da conta caso a transação seja concluída
        const updatedBankAccounts = bankAccounts.map((b) => {
          if (String(b.id) === String(newTx.bank_account_id)) {
            const currentBal = Number(b.balance) || 0;
            const delta = newTx.type === 'incomings' ? numVal : -numVal;
            return { ...b, balance: currentBal + delta };
          }
          return b;
        });

        const updatedTransactions = [newTx, ...transactions];

        set({
          transactions: updatedTransactions,
          bankAccounts: updatedBankAccounts,
        });

        return newTx;
      },

      getTransactions: (filters: TransactionFilters = {}) => {
        const { transactions } = get();

        let filtered = [...transactions];

        if (filters.type) {
          const types = Array.isArray(filters.type) ? filters.type : [filters.type];
          filtered = filtered.filter((t) => types.includes(t.type));
        }

        if (filters.status) {
          const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
          filtered = filtered.filter((t) => statuses.includes(t.status));
        }

        if (filters.category_id) {
          const catIds = Array.isArray(filters.category_id) ? filters.category_id : [filters.category_id];
          filtered = filtered.filter((t) => t.category_id && catIds.includes(String(t.category_id)));
        }

        if (filters.bank_account_id) {
          const bankIds = Array.isArray(filters.bank_account_id) ? filters.bank_account_id : [filters.bank_account_id];
          filtered = filtered.filter((t) => t.bank_account_id && bankIds.includes(String(t.bank_account_id)));
        }

        if (filters.pay_methods_id) {
          const payIds = Array.isArray(filters.pay_methods_id) ? filters.pay_methods_id : [filters.pay_methods_id];
          filtered = filtered.filter((t) => t.pay_methods_id && payIds.includes(String(t.pay_methods_id)));
        }

        if (filters.description) {
          const term = filters.description.toLowerCase().trim();
          filtered = filtered.filter((t) => t.description.toLowerCase().includes(term));
        }

        if (filters.due_date_from) {
          filtered = filtered.filter((t) => {
            const date = t.due_date || t.purchase_date || t.created_at?.split('T')[0];
            return date ? date >= filters.due_date_from! : true;
          });
        }

        if (filters.due_date_to) {
          filtered = filtered.filter((t) => {
            const date = t.due_date || t.purchase_date || t.created_at?.split('T')[0];
            return date ? date <= filters.due_date_to! : true;
          });
        }

        // Ordenação decrescente por data
        filtered.sort((a, b) => {
          const dateA = a.due_date || a.purchase_date || a.created_at;
          const dateB = b.due_date || b.purchase_date || b.created_at;
          return dateB.localeCompare(dateA);
        });

        // Totais
        const incomings = filtered
          .filter((t) => t.type === 'incomings' && t.status !== 'cancelled')
          .reduce((acc, t) => acc + (Number(t.value) || 0), 0);

        const expenses = filtered
          .filter((t) => t.type === 'expenses' && t.status !== 'cancelled')
          .reduce((acc, t) => acc + (Number(t.value) || 0), 0);

        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 20;
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginatedRows = filtered.slice(startIndex, startIndex + limit);

        return {
          rows: paginatedRows,
          pagination: {
            page,
            limit,
            total_items: totalItems,
            total_pages: totalPages,
            has_more: page < totalPages,
          },
          totals: {
            incomings,
            expenses,
          },
        };
      },

      getAnnualDRE: (year?: number) => {
        const { transactions } = get();
        const targetYear = year || new Date().getFullYear();

        const monthlyTotals: Record<number, { income: number; expense: number }> = {};
        for (let m = 1; m <= 12; m++) {
          monthlyTotals[m] = { income: 0, expense: 0 };
        }

        transactions.forEach((tx) => {
          if (tx.status === 'cancelled') return;
          const dateStr = tx.due_date || tx.purchase_date || tx.payment_date || tx.created_at;
          if (!dateStr) return;

          const [txYear, txMonth] = dateStr.split('-').map(Number);
          if (txYear === targetYear && txMonth >= 1 && txMonth <= 12) {
            const val = Number(tx.value) || 0;
            if (tx.type === 'incomings') {
              monthlyTotals[txMonth].income += val;
            } else if (tx.type === 'expenses') {
              monthlyTotals[txMonth].expense += val;
            }
          }
        });

        const yearly = Object.entries(monthlyTotals).map(([mStr, totals]) => {
          const m = Number(mStr);
          return {
            month: m,
            income: Number(totals.income.toFixed(2)),
            expense: Number(totals.expense.toFixed(2)),
            balance: Number((totals.income - totals.expense).toFixed(2)),
          };
        });

        const currentMonthNum = new Date().getMonth() + 1;
        const currentMonthTotals = monthlyTotals[currentMonthNum] || { income: 0, expense: 0 };
        const currentBalance = currentMonthTotals.income - currentMonthTotals.expense;
        const savingsRate = currentMonthTotals.income > 0
          ? ((currentBalance) / currentMonthTotals.income) * 100
          : 0;

        return {
          incomeVsExpense: {
            monthly: {
              totalIncome: Number(currentMonthTotals.income.toFixed(2)),
              totalExpense: Number(currentMonthTotals.expense.toFixed(2)),
              netBalance: Number(currentBalance.toFixed(2)),
              savingsRatePercentage: Number(savingsRate.toFixed(1)),
            },
            yearly,
          },
        };
      },

      getExpenseByCategory: (params?: { startDate?: string; endDate?: string }) => {
        const { transactions } = get();

        const filtered = transactions.filter((tx) => {
          if (tx.type !== 'expenses' || tx.status === 'cancelled') return false;
          const dateStr = tx.due_date || tx.purchase_date || tx.payment_date || tx.created_at;
          if (!dateStr) return false;
          if (params?.startDate && dateStr < params.startDate) return false;
          if (params?.endDate && dateStr > params.endDate) return false;
          return true;
        });

        const categorySums: Record<string, { name: string; amount: number }> = {};

        filtered.forEach((tx) => {
          const catId = tx.category_id || 'sem-categoria';
          const catName = tx.category_name || 'Outras Despesas';
          const val = Number(tx.value) || 0;

          if (!categorySums[catId]) {
            categorySums[catId] = { name: catName, amount: 0 };
          }
          categorySums[catId].amount += val;
        });

        const totalExpenseAll = Object.values(categorySums).reduce((acc, curr) => acc + curr.amount, 0);

        const expensesByCategory = Object.entries(categorySums)
          .map(([catId, data]) => ({
            category_id: catId,
            category_name: data.name,
            total_amount: Number(data.amount.toFixed(2)),
            percentage: totalExpenseAll > 0 ? Number(((data.amount / totalExpenseAll) * 100).toFixed(1)) : 0,
          }))
          .sort((a, b) => b.total_amount - a.total_amount);

        return { expensesByCategory };
      },

      getDashboardSummary: (params?: { startDate?: string; endDate?: string }) => {
        const { transactions, bankAccounts } = get();

        const currentMonthPrefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

        const monthTxs = transactions.filter((tx) => {
          if (tx.status === 'cancelled') return false;
          const dateStr = tx.due_date || tx.purchase_date || tx.payment_date || tx.created_at;
          if (params?.startDate && params?.endDate) {
            return dateStr >= params.startDate && dateStr <= params.endDate;
          }
          return dateStr.startsWith(currentMonthPrefix);
        });

        let completedIncomes = 0;
        let completedExpenses = 0;
        let pendingIncomes = 0;
        let pendingExpenses = 0;

        monthTxs.forEach((tx) => {
          const val = Number(tx.value) || 0;
          if (tx.type === 'incomings') {
            if (tx.status === 'completed') completedIncomes += val;
            else pendingIncomes += val;
          } else if (tx.type === 'expenses') {
            if (tx.status === 'completed') completedExpenses += val;
            else pendingExpenses += val;
          }
        });

        const totalBalance = bankAccounts.reduce((acc, b) => acc + (Number(b.balance) || 0), 0);
        const monthForecast = completedIncomes + pendingIncomes - (completedExpenses + pendingExpenses);

        return {
          completedIncomes: Number(completedIncomes.toFixed(2)),
          completedExpenses: Number(completedExpenses.toFixed(2)),
          pendingIncomes: Number(pendingIncomes.toFixed(2)),
          pendingExpenses: Number(pendingExpenses.toFixed(2)),
          totalBalance: Number(totalBalance.toFixed(2)),
          monthForecast: Number(monthForecast.toFixed(2)),
          monthForecastFinal: Number((totalBalance + monthForecast).toFixed(2)),
        };
      },

      getAccountBalances: () => {
        const { bankAccounts } = get();
        const accountBalances = bankAccounts.map((b) => ({
          id: b.id,
          bank_name: b.bank_name,
          balance: Number(b.balance) || 0,
        }));
        const totalBalances = accountBalances.reduce((acc, b) => acc + b.balance, 0);

        return {
          accountBalances,
          totalBalances: Number(totalBalances.toFixed(2)),
        };
      },

      getCreditCardSummary: () => {
        const { payMethods, transactions } = get();
        const cards = payMethods.filter((p) => Boolean(p.credit_card));

        const creditCardSummary = cards.map((card) => {
          const cardTxs = transactions.filter(
            (tx) => tx.pay_methods_id === card.id && tx.status !== 'cancelled'
          );
          const used = cardTxs.reduce((acc, tx) => acc + (Number(tx.value) || 0), 0);
          const limit = Number(card.credit_limit) || 5000;
          const available = Math.max(0, limit - used);

          return {
            pay_method_id: card.id,
            name: card.name,
            credit_limit: limit,
            used_credit_limit: Number(used.toFixed(2)),
            available_limit: Number(available.toFixed(2)),
            current_invoice_total: Number(used.toFixed(2)),
            transactions: cardTxs.slice(0, 5).map((t) => ({
              id: t.id,
              description: t.description,
              value: t.value,
              status: t.status,
              due_date: t.due_date || '',
            })),
          };
        });

        return { creditCardSummary };
      },

      getRecentTransactions: (limit = 5): RecentTransactionsReport => {
        const { transactions } = get();
        const recent = transactions.slice(0, limit).map((t) => ({
          id: t.id,
          description: t.description,
          value: Number(t.value) || 0,
          type: t.type,
          status: (t.status as any) || 'completed',
          date: t.due_date || t.purchase_date || t.created_at,
          category_name: t.category_name || undefined,
          pay_method_name: t.pay_method_name || undefined,
        }));
        return { recentTransactions: recent };
      },

      getOverdueAlerts: (): OverdueAlertsReport => {
        const { transactions } = get();
        const todayStr = new Date().toISOString().split('T')[0];

        const overdue = transactions.filter(
          (t) => (t.status === 'expired' || (t.status === 'pending' && t.due_date && t.due_date < todayStr))
        );

        const items = overdue.map((t) => ({
          id: t.id,
          description: t.description,
          value: Number(t.value) || 0,
          due_date: t.due_date || todayStr,
          type: t.type,
          days_overdue: 1,
        }));

        return {
          overdueAlerts: {
            total_overdue: items.reduce((acc, t) => acc + t.value, 0),
            items: items.slice(0, 5),
          },
        };
      },
    }),
    {
      name: 'finflow-demo-storage',
      storage: createJSONStorage(() => storage as Storage),
      partialize: (state) => ({
        isDemoMode: state.isDemoMode,
        bankAccounts: state.bankAccounts,
        categories: state.categories,
        payMethods: state.payMethods,
        counterparties: state.counterparties,
        transactions: state.transactions,
      }),
    }
  )
);
