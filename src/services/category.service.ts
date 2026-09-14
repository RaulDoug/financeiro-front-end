import { api } from '../lib/axios.ts';

export interface CategoryItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  name: string;
  type: 'incomings' | 'expenses';
  created_at?: string;
}

export interface CategoryResponse {
  message?: string;
  item?: CategoryItem;
}

export const categoryService = {
  async getCategories(type?: 'incomings' | 'expenses'): Promise<CategoryItem[]> {
    const params = type ? { type } : undefined;
    const response = await api.get('/categorie', { params });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.item) return [data.item];
    return [];
  },

  async createCategory(payload: { name: string; type: 'incomings' | 'expenses' }): Promise<CategoryResponse> {
    const response = await api.post('/categorie/register', payload);
    return response.data;
  },

  async updateCategory(
    id: number | string,
    payload: { name?: string; type?: 'incomings' | 'expenses' }
  ): Promise<CategoryResponse> {
    const response = await api.patch(`/categorie/update/${id}`, payload);
    return response.data;
  },

  async deleteCategory(id: number | string): Promise<CategoryResponse> {
    const response = await api.delete(`/categorie/delete/${id}`);
    return response.data;
  },
};

export default categoryService;
