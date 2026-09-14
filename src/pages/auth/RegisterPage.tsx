import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService, AuthError } from '../../services/auth.service.ts';
import { AuthCard } from '../../components/ui/AuthCard.tsx';
import { AlertCircle, Lock, Mail, User, Loader2, Check, X } from 'lucide-react';

export const passwordValidation = {
  minLength: (val: string) => val.length >= 8,
  hasUpper: (val: string) => /[A-Z]/.test(val),
  hasLower: (val: string) => /[a-z]/.test(val),
  hasNumber: (val: string) => /[0-9]/.test(val),
  hasSpecial: (val: string) => /[^A-Za-z0-9]/.test(val),
};

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').max(255, 'O nome deve ter no máximo 255 caracteres'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Pelo menos um caractere especial'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await authService.registerAndLogin(data);
      navigate('/onboarding');
    } catch (err: any) {
      if (err instanceof AuthError && err.isEmailInUse) {
        setServerError('Este e-mail já está em uso.');
      } else {
        setServerError(err.message || 'Falha ao registrar conta.');
      }
    }
  };

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Comece a organizar suas finanças com o FinFlow"
    >
      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Nome Completo
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              {...register('name')}
              type="text"
              placeholder="João Silva"
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>

          <div className="mt-2.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5 text-xs">
            <p className="font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Requisitos de segurança:</p>
            {[
              { label: 'Pelo menos 8 caracteres', valid: passwordValidation.minLength(passwordValue) },
              { label: 'Uma letra maiúscula', valid: passwordValidation.hasUpper(passwordValue) },
              { label: 'Uma letra minúscula', valid: passwordValidation.hasLower(passwordValue) },
              { label: 'Um número', valid: passwordValidation.hasNumber(passwordValue) },
              { label: 'Um caractere especial (@, #, $, etc.)', valid: passwordValidation.hasSpecial(passwordValue) },
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {rule.valid ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span className={rule.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>

          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Criando conta...</span>
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Já possui uma conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
        >
          Faça login
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;

