import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useDemoStore } from '../stores/demo.store.ts';
import { useAuthStore } from '../stores/auth.store.ts';
import { DEMO_WALLET } from '../mocks/demoData.ts';

export function isDemoRequest(_config?: InternalAxiosRequestConfig): boolean {
  const isDemo = useDemoStore.getState().isDemoMode;
  const token = useAuthStore.getState().token;
  return isDemo || token === 'mock-demo-session-token';
}

export async function handleDemoMockRequest(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const demoStore = useDemoStore.getState();

  let data: any = null;
  const status = 200;

  // Normalizar path removendo query params se houver
  const cleanPath = url.split('?')[0];

  // Extrair payload se POST/PATCH/DELETE
  let body: any = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
  }

  // --- Rotas de Carteira ---
  if (cleanPath.startsWith('/wallet')) {
    data = { walletsList: [DEMO_WALLET], message: 'Carteiras carregadas' };
  }

  // --- Rotas de Contas Bancárias ---
  else if (cleanPath.startsWith('/bank-account')) {
    if (method === 'post') {
      const newBank = {
        id: `demo-bank-${Date.now()}`,
        display_id: demoStore.bankAccounts.length + 1,
        wallet_id: DEMO_WALLET.id,
        bank_name: body.bank_name || 'Nova Conta Demo',
        balance: Number(body.balance) || 0,
        allow_negative_balance: Boolean(body.allow_negative_balance),
        color: body.color || '#3b82f6',
        icon: body.icon || 'building-2',
        created_at: new Date().toISOString(),
      };
      useDemoStore.setState({ bankAccounts: [...demoStore.bankAccounts, newBank] });
      data = { message: 'Conta bancária criada com sucesso!', item: newBank };
    } else {
      data = demoStore.bankAccounts;
    }
  }

  // --- Rotas de Categorias ---
  else if (cleanPath.startsWith('/categorie')) {
    if (method === 'post') {
      const newCat = {
        id: `demo-cat-${Date.now()}`,
        display_id: demoStore.categories.length + 1,
        wallet_id: DEMO_WALLET.id,
        name: body.name || 'Nova Categoria Demo',
        type: body.type || 'expenses',
        color: body.color || '#10b981',
        icon: body.icon || 'tag',
        created_at: new Date().toISOString(),
      };
      useDemoStore.setState({ categories: [...demoStore.categories, newCat] });
      data = { message: 'Categoria criada com sucesso!', item: newCat };
    } else {
      const typeParam = config.params?.type;
      data = typeParam
        ? demoStore.categories.filter((c) => c.type === typeParam)
        : demoStore.categories;
    }
  }

  // --- Rotas de Contrapartes ---
  else if (cleanPath.startsWith('/counterpartie')) {
    if (method === 'post') {
      const newCp = {
        id: `demo-cp-${Date.now()}`,
        display_id: demoStore.counterparties.length + 1,
        wallet_id: DEMO_WALLET.id,
        name: body.name || 'Nova Contraparte Demo',
        type: body.type || 'payee',
        created_at: new Date().toISOString(),
      };
      useDemoStore.setState({ counterparties: [...demoStore.counterparties, newCp] });
      data = { message: 'Contraparte criada com sucesso!', item: newCp };
    } else {
      const typeParam = config.params?.type;
      data = typeParam
        ? demoStore.counterparties.filter((c) => c.type === typeParam)
        : demoStore.counterparties;
    }
  }

  // --- Rotas de Métodos de Pagamento e Cartões ---
  else if (cleanPath.startsWith('/pay-method')) {
    if (method === 'post') {
      const newPay = {
        id: `demo-pay-${Date.now()}`,
        display_id: demoStore.payMethods.length + 1,
        wallet_id: DEMO_WALLET.id,
        name: body.name || 'Novo Cartão Demo',
        credit_card: Boolean(body.credit_card),
        bank_account_id: body.bank_account_id || null,
        due_day: body.due_day ? Number(body.due_day) : null,
        closing_day: body.closing_day ? Number(body.closing_day) : null,
        last_four_digits: body.last_four_digits || '1234',
        credit_limit: body.credit_limit ? Number(body.credit_limit) : null,
        color: body.color || '#820ad1',
        icon: body.icon || 'credit-card',
        created_at: new Date().toISOString(),
      };
      useDemoStore.setState({ payMethods: [...demoStore.payMethods, newPay] });
      data = { message: 'Método de pagamento criado com sucesso!', item: newPay };
    } else {
      data = demoStore.payMethods;
    }
  }

  // --- Rotas de Transações ---
  else if (cleanPath.startsWith('/transaction')) {
    if (cleanPath.includes('/register') && method === 'post') {
      const created = demoStore.addTransaction(body);
      data = { message: 'Transação cadastrada com sucesso!', item: created };
    } else if (cleanPath.includes('/update') && method === 'patch') {
      data = { message: 'Transação atualizada com sucesso!' };
    } else if (cleanPath.includes('/delete') && method === 'delete') {
      data = { message: 'Transação excluída com sucesso!' };
    } else {
      // Listagem com filtros
      // Pode vir em config.params ou no URL search params
      const searchParams = new URLSearchParams(url.split('?')[1] || '');
      const getP = (key: string) => config.params?.[key] || searchParams.get(key) || undefined;
      const getList = (key: string) => {
        if (config.params?.[key]) {
          return Array.isArray(config.params[key]) ? config.params[key] : [config.params[key]];
        }
        const all = searchParams.getAll(key);
        return all.length > 0 ? all : undefined;
      };

      const filters = {
        type: getList('type'),
        status: getList('status'),
        bank_account_id: getList('bank_account_id'),
        category_id: getList('category_id'),
        pay_methods_id: getList('pay_methods_id'),
        counterparty_id: getList('counterparty_id'),
        description: getP('description'),
        due_date_from: getP('due_date_from'),
        due_date_to: getP('due_date_to'),
        page: Number(getP('page')) || 1,
        limit: Number(getP('limit')) || 20,
      };

      data = demoStore.getTransactions(filters as any);
    }
  }

  // --- Rotas de Relatórios do Dashboard e Relatórios Gerais ---
  else if (cleanPath.startsWith('/dashboard-report/summary')) {
    data = demoStore.getDashboardSummary(config.params);
  } else if (cleanPath.startsWith('/dashboard-report/account-balances')) {
    data = demoStore.getAccountBalances();
  } else if (cleanPath.startsWith('/dashboard-report/expense-by-category')) {
    data = demoStore.getExpenseByCategory(config.params);
  } else if (cleanPath.startsWith('/dashboard-report/income-vs-expense')) {
    const year = config.params?.year ? Number(config.params.year) : undefined;
    data = demoStore.getAnnualDRE(year);
  } else if (cleanPath.startsWith('/dashboard-report/credit-card-summary')) {
    data = demoStore.getCreditCardSummary();
  } else if (cleanPath.startsWith('/dashboard-report/recent-transactions')) {
    const limit = config.params?.limit ? Number(config.params.limit) : 5;
    data = demoStore.getRecentTransactions(limit);
  } else if (cleanPath.startsWith('/dashboard-report/overdue-alerts')) {
    data = demoStore.getOverdueAlerts();
  }

  // --- Rotas de Autenticação / Outras ---
  else if (cleanPath.startsWith('/auth/logout')) {
    data = { message: 'Logout realizado com sucesso!' };
  } else {
    data = { message: 'Mock response OK' };
  }

  return {
    data,
    status,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  };
}
