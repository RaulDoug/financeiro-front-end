export interface BankInfo {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  icon: string;
  keywords: string[];
}

export const BRAZILIAN_BANKS: BankInfo[] = [
  {
    id: 'nubank',
    name: 'Nubank',
    primaryColor: '#820AD1',
    secondaryColor: '#E6D4F8',
    icon: 'credit-card',
    keywords: ['nu', 'nubank', 'roxinho'],
  },
  {
    id: 'itau',
    name: 'Itaú',
    primaryColor: '#EC7000',
    secondaryColor: '#003399',
    icon: 'landmark',
    keywords: ['itau', 'itaú', 'personnalite', 'personalite'],
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    primaryColor: '#CC092F',
    secondaryColor: '#F5F5F5',
    icon: 'landmark',
    keywords: ['bradesco', 'prime'],
  },
  {
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    primaryColor: '#FAEA00',
    secondaryColor: '#003DA5',
    icon: 'landmark',
    keywords: ['bb', 'banco do brasil'],
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica',
    primaryColor: '#0066AE',
    secondaryColor: '#F39200',
    icon: 'landmark',
    keywords: ['caixa', 'cef', 'economica', 'econômica'],
  },
  {
    id: 'santander',
    name: 'Santander',
    primaryColor: '#EC0000',
    secondaryColor: '#FFFFFF',
    icon: 'landmark',
    keywords: ['santander', 'select'],
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    primaryColor: '#FF7A00',
    secondaryColor: '#000000',
    icon: 'landmark',
    keywords: ['inter', 'banco inter', 'intermedium'],
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    primaryColor: '#242424',
    secondaryColor: '#F2F2F2',
    icon: 'landmark',
    keywords: ['c6', 'c6 bank', 'c6bank'],
  },
  {
    id: 'btg',
    name: 'BTG Pactual',
    primaryColor: '#001E62',
    secondaryColor: '#C4D600',
    icon: 'landmark',
    keywords: ['btg', 'btg pactual', 'pactual'],
  },
  {
    id: 'sicoob',
    name: 'Sicoob',
    primaryColor: '#003641',
    secondaryColor: '#7BB31A',
    icon: 'landmark',
    keywords: ['sicoob'],
  },
  {
    id: 'sicredi',
    name: 'Sicredi',
    primaryColor: '#006633',
    secondaryColor: '#78B833',
    icon: 'landmark',
    keywords: ['sicredi'],
  },
  {
    id: 'picpay',
    name: 'PicPay',
    primaryColor: '#11C76F',
    secondaryColor: '#0B7A44',
    icon: 'wallet',
    keywords: ['picpay', 'pic pay'],
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    primaryColor: '#009EE3',
    secondaryColor: '#FFE600',
    icon: 'wallet',
    keywords: ['mercado pago', 'mercadopago', 'mp'],
  },
  {
    id: 'xp',
    name: 'XP Investimentos',
    primaryColor: '#000000',
    secondaryColor: '#F4C01E',
    icon: 'trending-up',
    keywords: ['xp', 'xp investimentos'],
  },
  {
    id: 'original',
    name: 'Banco Original',
    primaryColor: '#16B455',
    secondaryColor: '#000000',
    icon: 'landmark',
    keywords: ['original', 'banco original'],
  },
  {
    id: 'safra',
    name: 'Banco Safra',
    primaryColor: '#B69248',
    secondaryColor: '#0D1E3A',
    icon: 'landmark',
    keywords: ['safra'],
  },
];

/**
 * Detecta automaticamente o banco pelo nome da conta bancária (correspondência parcial insensível a maiúsculas/minúsculas).
 * Ex: "Nubank Raul" -> Nubank
 */
export function detectBankByName(accountName: string): BankInfo | null {
  if (!accountName || typeof accountName !== 'string') return null;

  const normalized = accountName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const words = normalized.split(/\s+/);

  for (const bank of BRAZILIAN_BANKS) {
    for (const kw of bank.keywords) {
      const normalizedKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      // Correspondência exata em alguma palavra ou início da frase
      if (
        words.includes(normalizedKw) ||
        normalized.startsWith(normalizedKw) ||
        normalized.includes(normalizedKw)
      ) {
        return bank;
      }
    }
  }

  return null;
}

