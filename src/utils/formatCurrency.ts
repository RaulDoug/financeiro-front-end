export function formatCurrency(value: number | string | null | undefined): string {
  const num =
    value === null || value === undefined || isNaN(Number(value))
      ? 0
      : typeof value === 'string'
        ? parseFloat(value)
        : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
