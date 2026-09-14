import { api } from '../lib/axios.ts';
import { useAuthStore } from '../stores/auth.store.ts';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userInfo: {
    token: string;
    id: string;
    name: string;
    email: string;
  };
}

export class AuthError extends Error {
  status?: number;
  isRateLimit: boolean;
  isEmailInUse: boolean;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.isRateLimit = status === 429;
    this.isEmailInUse = status === 400 && (
      message?.toLowerCase().includes('email') ||
      message?.toLowerCase().includes('cadastrado') ||
      message?.toLowerCase().includes('em uso')
    );
  }
}

export const authService = {
  async register(data: RegisterDTO): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Falha no cadastro';
      throw new AuthError(message, status);
    }
  },

  async login(data: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      const { userInfo } = response.data;
      if (userInfo?.token) {
        useAuthStore.getState().setAuth(
          {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
          },
          userInfo.token
        );
      }
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      let message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Falha no login';
      if (status === 429) {
        message = 'Limite de tentativas excedido. Tente novamente em 15 minutos.';
      }
      throw new AuthError(message, status);
    }
  },

  async registerAndLogin(data: RegisterDTO): Promise<LoginResponse> {
    await this.register(data);
    return await this.login({
      email: data.email,
      password: data.password,
    });
  },
};

