import { api } from '../lib/axios.ts';

export interface CategoryItem {
  id: string;
  display_id?: number;
  wallet_id?: string;
  name: string;
  type: 'incomings' | 'expenses';
  icon?: string;
  color?: string;
  created_at?: string;
}

export interface CategoryResponse {
  message?: string;
  item?: CategoryItem;
}

export const categoryService = {
  async getCategories(type?: string): Promise<CategoryItem[]> {
    const response = await api.get('/categorie');
    const data = response.data;
    let list: CategoryItem[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data?.item) {
      list = [data.item];
    }
    if (type) {
      return list.filter((item) => item.type === type);
    }
    return list;
  },

  async createCategory(payload: {
    name: string;
    type: 'incomings' | 'expenses';
    icon?: string;
    color?: string;
  }): Promise<CategoryResponse> {
    const response = await api.post('/categorie/register', payload);
    return response.data;
  },

  async updateCategory(
    id: number | string,
    payload: {
      name?: string;
      type?: 'incomings' | 'expenses';
      icon?: string;
      color?: string;
    }
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
