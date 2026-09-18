/**
 * Formata o identificador de parcelas no padrão fracionado "X/Y" (Ex: 1/3, 2/3, 3/3).
 *
 * @param current Número ou string da parcela atual
 * @param total Número ou string do total de parcelas
 * @returns String formatada (ex: "1/3") ou apenas a parcela atual se total ausente, ou null se não houver parcela.
 */
export function formatInstallment(
  current?: number | string | null,
  total?: number | string | null
): string | null {
  if (current === undefined || current === null || current === '') {
    return null;
  }

  const currentStr = String(current).trim();
  if (!currentStr || currentStr === 'null' || currentStr === 'undefined') {
    return null;
  }

  // Se current já vier no formato "1/3"
  if (currentStr.includes('/')) {
    return currentStr;
  }

  if (total !== undefined && total !== null && total !== '') {
    const totalStr = String(total).trim();
    if (totalStr && totalStr !== 'null' && totalStr !== 'undefined') {
      return `${currentStr}/${totalStr}`;
    }
  }

  return currentStr;
}

