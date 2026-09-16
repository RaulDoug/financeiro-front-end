import type { Transaction } from '../types/transaction.ts';

export interface ConsolidatedCounterparty {
  name: string;
  totalAmount: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  percentage: number;
  type: 'payer' | 'payee' | 'mixed';
}

export function consolidateCounterparties(
  transactions: Transaction[]
): ConsolidatedCounterparty[] {
  if (!transactions || transactions.length === 0) return [];

  const map = new Map<
    string,
    {
      displayName: string;
      totalIncome: number;
      totalExpense: number;
      count: number;
    }
  >();

  transactions.forEach((tx) => {
    const rawName = tx.counterparty_name?.trim();
    if (!rawName) return;

    const key = rawName.toLowerCase();
    const amount = Number(tx.value) || 0;

    const current = map.get(key) || {
      displayName: rawName,
      totalIncome: 0,
      totalExpense: 0,
      count: 0,
    };

    if (tx.type === 'incomings' || tx.type === 'transfer_in') {
      current.totalIncome += amount;
    } else {
      current.totalExpense += amount;
    }
    current.count += 1;

    map.set(key, current);
  });

  const list: {
    name: string;
    totalAmount: number;
    totalIncome: number;
    totalExpense: number;
    transactionCount: number;
    type: 'payer' | 'payee' | 'mixed';
  }[] = [];

  let grandTotal = 0;

  map.forEach((value) => {
    const totalAmount = value.totalIncome + value.totalExpense;
    grandTotal += totalAmount;

    let type: 'payer' | 'payee' | 'mixed' = 'mixed';
    if (value.totalIncome > 0 && value.totalExpense === 0) {
      type = 'payer'; // Receitas (Pagador)
    } else if (value.totalExpense > 0 && value.totalIncome === 0) {
      type = 'payee'; // Despesas (Recebedor)
    }

    list.push({
      name: value.displayName,
      totalAmount,
      totalIncome: value.totalIncome,
      totalExpense: value.totalExpense,
      transactionCount: value.count,
      type,
    });
  });

  // AC-103: Ordenar pelo maior volume transacionado
  list.sort((a, b) => b.totalAmount - a.totalAmount);

  // Calcular percentual sobre o total
  return list.map((item) => ({
    ...item,
    percentage: grandTotal > 0 ? (item.totalAmount / grandTotal) * 100 : 0,
  }));
}
