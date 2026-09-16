import { api } from '../../lib/axios.ts';
import { normalizeCardColor, COLOR_HEX_MAP } from '../../utils/creditCardColors.ts';
import type {
  CreditCardItem,
  CreditCardSummaryWithTransactions,
  CreditCardFormData,
} from '../../types/creditCard.ts';

export type LimitHealthStatus = 'healthy' | 'warning' | 'critical';

export const creditCardService = {
  async getCreditCards(): Promise<CreditCardItem[]> {
    const response = await api.get('/pay-method');
    const items = Array.isArray(response.data)
      ? response.data
      : response.data?.items || (response.data?.item ? [response.data.item] : []);

    return items
      .filter((item: any) => Boolean(item.credit_card))
      .map((item: any) => ({
        ...item,
        color: normalizeCardColor(item.color),
        last_four_digits: item.last_four_digits !== undefined && item.last_four_digits !== null
          ? String(item.last_four_digits).padStart(4, '0')
          : '',
        brand: item.brand || (item.icon && item.icon !== 'credit-card' ? item.icon : undefined),
      }));
  },

  async getCreditCardSummary(params: {
    startDate?: string;
    endDate?: string;
    includeTransactions?: boolean;
  } = {}): Promise<CreditCardSummaryWithTransactions[]> {
    const response = await api.get('/dashboard-report/credit-card-summary', {
      params: {
        includeTransactions: true,
        ...params,
      },
    });

    return response.data?.creditCardSummary || [];
  },

  async createCreditCard(data: CreditCardFormData): Promise<any> {
    const colorKey = normalizeCardColor(data.color);
    const colorHex = COLOR_HEX_MAP[colorKey] || '#1e3a8a';

    const payload = {
      name: data.name.trim(),
      credit_card: true,
      bank_account_id: data.bank_account_id,
      due_day: Number(data.due_day),
      closing_day: Number(data.closing_day),
      last_four_digits: String(data.last_four_digits).trim(),
      credit_limit: Number(data.credit_limit),
      icon: (data as any).icon || (data.brand ? data.brand.toLowerCase() : 'credit-card'),
      color: colorHex,
    };

    const response = await api.post('/pay-method/register', payload);
    return response.data;
  },

  async updateCreditCard(id: string | number, data: Partial<CreditCardFormData>): Promise<any> {
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.bank_account_id !== undefined) payload.bank_account_id = data.bank_account_id;
    if (data.due_day !== undefined) payload.due_day = Number(data.due_day);
    if (data.closing_day !== undefined) payload.closing_day = Number(data.closing_day);
    if (data.credit_limit !== undefined) payload.credit_limit = Number(data.credit_limit);
    if (data.last_four_digits !== undefined) payload.last_four_digits = String(data.last_four_digits).trim();
    if ((data as any).icon !== undefined) {
      payload.icon = (data as any).icon;
    } else if (data.brand !== undefined) {
      payload.icon = data.brand.toLowerCase();
    }
    if (data.color !== undefined) {
      const colorKey = normalizeCardColor(data.color);
      payload.color = COLOR_HEX_MAP[colorKey] || data.color;
    }

    const response = await api.patch(`/pay-method/update/${id}`, payload);
    return response.data;
  },

  async deleteCreditCard(id: string | number): Promise<any> {
    const response = await api.delete(`/pay-method/delete/${id}`);
    return response.data;
  },

  calculateLimitStatus(used: number, total: number): {
    percentage: number;
    status: LimitHealthStatus;
    colorClass: string;
    bgClass: string;
    barColor: string;
  } {
    if (!total || total <= 0) {
      return {
        percentage: 0,
        status: 'healthy',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50',
        barColor: '#10b981',
      };
    }

    const percentage = Math.min(100, Math.max(0, (used / total) * 100));

    if (percentage < 60) {
      return {
        percentage,
        status: 'healthy',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50',
        barColor: '#10b981', // Verde
      };
    }

    if (percentage <= 80) {
      return {
        percentage,
        status: 'warning',
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50',
        barColor: '#f59e0b', // Amarelo
      };
    }

    return {
      percentage,
      status: 'critical',
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-50',
      barColor: '#ef4444', // Vermelho
    };
  },
};

export default creditCardService;

