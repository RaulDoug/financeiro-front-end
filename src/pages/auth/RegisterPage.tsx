import React from 'react';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../components/ui/AuthCard.tsx';
import { AlertCircle } from 'lucide-react';

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
  return (
    <AuthCard
      title="Cadastros Temporariamente Suspensos"
      subtitle="Estamos aprimorando a segurança do sistema"
    >
      <div className="space-y-4 text-center py-2" data-testid="register-suspended-card">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2.5 text-left">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            A criação de novas contas está temporariamente desabilitada para prevenir registros sem validação de e-mail.
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Você pode experimentar todas as funcionalidades agora mesmo através do Modo de Demonstração!
        </p>

        <Link
          to="/demo"
          className="w-full py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-violet-500/20"
        >
          <span>Acessar Modo Demonstração</span>
        </Link>

        <div className="pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
};

export default RegisterPage;
