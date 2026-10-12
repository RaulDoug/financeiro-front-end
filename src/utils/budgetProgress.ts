export function getProgressColor(percentage: number): {
  barClass: string;
  badgeClass: string;
  statusLabel: string;
} {
  if (percentage >= 100) {
    return {
      barClass: 'bg-rose-500',
      badgeClass:
        'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400',
      statusLabel: 'Estourado',
    };
  }
  if (percentage >= 80) {
    return {
      barClass: 'bg-amber-500',
      badgeClass:
        'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-400',
      statusLabel: 'Atenção',
    };
  }
  return {
    barClass: 'bg-emerald-500',
    badgeClass:
      'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400',
    statusLabel: 'Saudável',
  };
}
