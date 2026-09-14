export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';

  // Se já estiver no formato YYYY-MM-DD
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function resolveTransactionDate(tx: {
  date?: string;
  payment_date?: string;
  purchase_date?: string;
  due_date?: string;
}): string {
  return tx.payment_date || tx.purchase_date || tx.due_date || tx.date || '';
}
