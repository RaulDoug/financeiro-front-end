import { api } from '../../lib/axios.ts';
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

    return items.filter((item: any) => Boolean(item.credit_card));
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
    const payload = {
      ...data,
      credit_card: true,
    };
    const response = await api.post('/pay-method/register', payload);
    return response.data;
  },

  async updateCreditCard(id: string, data: Partial<CreditCardFormData>): Promise<any> {
    const response = await api.patch(`/pay-method/update/${id}`, data);
    return response.data;
  },

  async deleteCreditCard(id: string): Promise<any> {
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

