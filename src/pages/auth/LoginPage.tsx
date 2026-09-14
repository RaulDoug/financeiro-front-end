import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService, AuthError } from '../../services/auth.service.ts';
import { AuthCard } from '../../components/ui/AuthCard.tsx';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';

export const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isExpired = searchParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (err: any) {
      if (err instanceof AuthError && err.isRateLimit) {
        setIsRateLimited(true);
        setServerError('Limite de tentativas excedido. Tente novamente em 15 minutos.');
      } else if (err instanceof AuthError && err.status === 400) {
        setServerError('Credenciais inválidas');
      } else {
        setServerError(err.message || 'Credenciais inválidas');
      }
    }
  };

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Acesse sua conta para gerenciar suas finanças"
    >
      {isExpired && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Sua sessão expirou. Faça login novamente para continuar.</span>
        </div>
      )}

      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              disabled={isSubmitting || isRateLimited}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Senha
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting || isRateLimited}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isRateLimited}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Não tem uma conta?{' '}
        <Link
          to="/register"
          className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
        >
          Criar conta
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginPage;

