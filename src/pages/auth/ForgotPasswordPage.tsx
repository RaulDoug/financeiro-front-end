import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../components/ui/AuthCard.tsx';
import { Mail, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <AuthCard
      title="Recuperação de Senha"
      subtitle="Recupere o acesso à sua conta FinFlow"
    >
      <div className="mb-6 p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs flex items-start gap-2.5 text-left">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-violet-600 dark:text-violet-400" />
        <div>
          <p className="font-semibold">Funcionalidade em desenvolvimento</p>
          <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
            A recuperação automática de senhas estará disponível em breve. Insira seu e-mail para registrar a solicitação.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base">
            Solicitação anotada!
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            Assim que a funcionalidade for liberada, você receberá as instruções por e-mail.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              E-mail cadastrado
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-violet-500/20"
          >
            Enviar instruções (Placeholder)
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o login
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
