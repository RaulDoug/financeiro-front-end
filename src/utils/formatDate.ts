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
  date?: string | null;
  payment_date?: string | null;
  purchase_date?: string | null;
  due_date?: string | null;
}): string {
  return tx.payment_date || tx.purchase_date || tx.due_date || tx.date || '';
}

/**
 * Retorna a data no formato 'YYYY-MM-DD' considerando o fuso horário local.
 * Evita que fusos com offset negativo (como UTC-3 no Brasil) adiantem o dia
 * ao usar `.toISOString().split('T')[0]`.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

