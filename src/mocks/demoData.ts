import type { BankAccountItem } from '../types/bankAccount.ts';
import type { CategoryItem } from '../services/category.service.ts';
import type { PayMethodItem } from '../services/payMethod.service.ts';
import type { CounterpartyItem } from '../services/counterparty.service.ts';
import type { Transaction } from '../types/transaction.ts';

export const DEMO_USER = {
  id: 'demo-user-id',
  name: 'Usuário Demonstração',
  email: 'demo@finflow.app',
};

export const DEMO_WALLET = {
  id: 'demo-wallet-id',
  name: 'Carteira Principal (Demo)',
  currency: 'BRL',
  role: 'owner',
  members_count: 1,
  created_at: new Date().toISOString(),
};

export const DEMO_BANK_ACCOUNTS: BankAccountItem[] = [
  {
    id: 'demo-bank-1',
    display_id: 1,
    wallet_id: DEMO_WALLET.id,
    bank_name: 'Nubank Conta Corrente',
    balance: 4250.75,
    allow_negative_balance: false,
    color: '#820AD1',
    icon: 'building-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-bank-2',
    display_id: 2,
    wallet_id: DEMO_WALLET.id,
    bank_name: 'Itaú Reserva de Emergência',
    balance: 14800.00,
    allow_negative_balance: false,
    color: '#EC7000',
    icon: 'building-2',
    created_at: new Date().toISOString(),
  },
];

export const DEMO_CATEGORIES: CategoryItem[] = [
  {
    id: 'demo-cat-1',
    display_id: 1,
    wallet_id: DEMO_WALLET.id,
    name: 'Salário & Remuneração',
    type: 'incomings',
    color: '#10B981',
    icon: 'briefcase',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-2',
    display_id: 2,
    wallet_id: DEMO_WALLET.id,
    name: 'Freelance & Consultoria',
    type: 'incomings',
    color: '#06B6D4',
    icon: 'trending-up',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-3',
    display_id: 3,
    wallet_id: DEMO_WALLET.id,
    name: 'Moradia (Aluguel & Contas)',
    type: 'expenses',
    color: '#6366F1',
    icon: 'home',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-4',
    display_id: 4,
    wallet_id: DEMO_WALLET.id,
    name: 'Alimentação & Mercado',
    type: 'expenses',
    color: '#F59E0B',
    icon: 'shopping-cart',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-5',
    display_id: 5,
    wallet_id: DEMO_WALLET.id,
    name: 'Transporte & Mobilidade',
    type: 'expenses',
    color: '#EF4444',
    icon: 'car',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-6',
    display_id: 6,
    wallet_id: DEMO_WALLET.id,
    name: 'Lazer & Assinaturas',
    type: 'expenses',
    color: '#EC4899',
    icon: 'film',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cat-7',
    display_id: 7,
    wallet_id: DEMO_WALLET.id,
    name: 'Saúde & Farmácia',
    type: 'expenses',
    color: '#14B8A6',
    icon: 'heart-pulse',
    created_at: new Date().toISOString(),
  },
];

export const DEMO_PAY_METHODS: PayMethodItem[] = [
  {
    id: 'demo-card-1',
    display_id: 1,
    wallet_id: DEMO_WALLET.id,
    name: 'Nubank Roxinho',
    credit_card: true,
    bank_account_id: 'demo-bank-1',
    due_day: 10,
    closing_day: 3,
    last_four_digits: '4821',
    credit_limit: 8000,
    color: '#820AD1',
    icon: 'credit-card',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-pay-pix',
    display_id: 2,
    wallet_id: DEMO_WALLET.id,
    name: 'Pix / Transferência',
    credit_card: false,
    bank_account_id: 'demo-bank-1',
    icon: 'zap',
    color: '#10B981',
    created_at: new Date().toISOString(),
  },
];

export const DEMO_COUNTERPARTIES: CounterpartyItem[] = [
  {
    id: 'demo-cp-1',
    display_id: 1,
    wallet_id: DEMO_WALLET.id,
    name: 'Tech Solutions Ltda',
    type: 'payer',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cp-2',
    display_id: 2,
    wallet_id: DEMO_WALLET.id,
    name: 'Supermercado Central',
    type: 'payee',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cp-3',
    display_id: 3,
    wallet_id: DEMO_WALLET.id,
    name: 'Imobiliária Aliança',
    type: 'payee',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-cp-4',
    display_id: 4,
    wallet_id: DEMO_WALLET.id,
    name: 'Uber do Brasil',
    type: 'payee',
    created_at: new Date().toISOString(),
  },
];

export function getInitialDemoTransactions(): Transaction[] {
  const currentYear = new Date().getFullYear();
  const pad = (n: number) => String(n).padStart(2, '0');

  // Gerar conjunto rico de transações cobrindo os meses do ano corrente
  const list: Transaction[] = [];

  // Meses anteriores e atual (1 até mês atual)
  const currentMonth = new Date().getMonth() + 1;

  for (let m = 1; m <= Math.max(currentMonth, 6); m++) {
    const isCurrent = m === currentMonth;
    const isPast = m < currentMonth;
    const monthStr = pad(m);

    // Salário (Receita)
    list.push({
      id: `demo-tx-salario-${m}`,
      value: '7500.00',
      description: `Salário Mensal Ref. ${monthStr}/${currentYear}`,
      type: 'incomings',
      status: 'completed',
      due_date: `${currentYear}-${monthStr}-05`,
      payment_date: `${currentYear}-${monthStr}-05`,
      purchase_date: `${currentYear}-${monthStr}-05`,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: 'Nubank Conta Corrente',
      bank_account_id: 'demo-bank-1',
      category_name: 'Salário & Remuneração',
      category_id: 'demo-cat-1',
      pay_method_name: 'Pix / Transferência',
      pay_methods_id: 'demo-pay-pix',
      counterparty_name: 'Tech Solutions Ltda',
      counterparty_id: 'demo-cp-1',
      creator_user_name: 'Usuário Demonstração',
      created_at: `${currentYear}-${monthStr}-05T10:00:00.000Z`,
    });

    // Aluguel (Despesa fixa)
    list.push({
      id: `demo-tx-aluguel-${m}`,
      value: '2200.00',
      description: `Aluguel Apartamento ${monthStr}/${currentYear}`,
      type: 'expenses',
      status: isPast ? 'completed' : isCurrent ? 'completed' : 'pending',
      due_date: `${currentYear}-${monthStr}-10`,
      payment_date: isPast || isCurrent ? `${currentYear}-${monthStr}-10` : null,
      purchase_date: `${currentYear}-${monthStr}-10`,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: 'Nubank Conta Corrente',
      bank_account_id: 'demo-bank-1',
      category_name: 'Moradia (Aluguel & Contas)',
      category_id: 'demo-cat-3',
      pay_method_name: 'Pix / Transferência',
      pay_methods_id: 'demo-pay-pix',
      counterparty_name: 'Imobiliária Aliança',
      counterparty_id: 'demo-cp-3',
      creator_user_name: 'Usuário Demonstração',
      created_at: `${currentYear}-${monthStr}-10T12:00:00.000Z`,
    });

    // Mercado (Despesa variável)
    list.push({
      id: `demo-tx-mercado-${m}`,
      value: String((1100 + (m * 45) % 300).toFixed(2)),
      description: 'Compras do Mês - Mercado Central',
      type: 'expenses',
      status: 'completed',
      due_date: `${currentYear}-${monthStr}-15`,
      payment_date: `${currentYear}-${monthStr}-15`,
      purchase_date: `${currentYear}-${monthStr}-15`,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: 'Nubank Conta Corrente',
      bank_account_id: 'demo-bank-1',
      category_name: 'Alimentação & Mercado',
      category_id: 'demo-cat-4',
      pay_method_name: 'Nubank Roxinho',
      pay_methods_id: 'demo-card-1',
      counterparty_name: 'Supermercado Central',
      counterparty_id: 'demo-cp-2',
      creator_user_name: 'Usuário Demonstração',
      created_at: `${currentYear}-${monthStr}-15T15:30:00.000Z`,
    });

    // Transporte / Uber
    list.push({
      id: `demo-tx-transporte-${m}`,
      value: String((320 + (m * 30) % 150).toFixed(2)),
      description: 'Corridas Uber e Mobilidade',
      type: 'expenses',
      status: 'completed',
      due_date: `${currentYear}-${monthStr}-20`,
      payment_date: `${currentYear}-${monthStr}-20`,
      purchase_date: `${currentYear}-${monthStr}-20`,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: 'Nubank Conta Corrente',
      bank_account_id: 'demo-bank-1',
      category_name: 'Transporte & Mobilidade',
      category_id: 'demo-cat-5',
      pay_method_name: 'Nubank Roxinho',
      pay_methods_id: 'demo-card-1',
      counterparty_name: 'Uber do Brasil',
      counterparty_id: 'demo-cp-4',
      creator_user_name: 'Usuário Demonstração',
      created_at: `${currentYear}-${monthStr}-20T18:00:00.000Z`,
    });

    // Lazer / Streaming
    list.push({
      id: `demo-tx-lazer-${m}`,
      value: '189.90',
      description: 'Assinaturas Digitais (Streaming & Música)',
      type: 'expenses',
      status: 'completed',
      due_date: `${currentYear}-${monthStr}-25`,
      payment_date: `${currentYear}-${monthStr}-25`,
      purchase_date: `${currentYear}-${monthStr}-25`,
      transfers_id: null,
      invoice_id: null,
      current_installment: null,
      bank_account_name: 'Nubank Conta Corrente',
      bank_account_id: 'demo-bank-1',
      category_name: 'Lazer & Assinaturas',
      category_id: 'demo-cat-6',
      pay_method_name: 'Nubank Roxinho',
      pay_methods_id: 'demo-card-1',
      counterparty_name: null,
      counterparty_id: null,
      creator_user_name: 'Usuário Demonstração',
      created_at: `${currentYear}-${monthStr}-25T08:00:00.000Z`,
    });
  }

  // Receita extra freelance no mês atual
  const mNowStr = pad(currentMonth);
  list.push({
    id: 'demo-tx-freelance-extra',
    value: '1850.00',
    description: 'Projeto UI/UX Freelance',
    type: 'incomings',
    status: 'completed',
    due_date: `${currentYear}-${mNowStr}-18`,
    payment_date: `${currentYear}-${mNowStr}-18`,
    purchase_date: `${currentYear}-${mNowStr}-18`,
    transfers_id: null,
    invoice_id: null,
    current_installment: null,
    bank_account_name: 'Nubank Conta Corrente',
    bank_account_id: 'demo-bank-1',
    category_name: 'Freelance & Consultoria',
    category_id: 'demo-cat-2',
    pay_method_name: 'Pix / Transferência',
    pay_methods_id: 'demo-pay-pix',
    counterparty_name: null,
    counterparty_id: null,
    creator_user_name: 'Usuário Demonstração',
    created_at: `${currentYear}-${mNowStr}-18T14:20:00.000Z`,
  });

  return list;
}
