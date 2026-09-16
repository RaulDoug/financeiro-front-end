import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['incomings', 'expenses'], {
    required_error: 'Selecione o tipo de categoria',
  }),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const counterpartySchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['payer', 'payee'], {
    required_error: 'Selecione o tipo de contraparte',
  }),
});

export type CounterpartyFormData = z.infer<typeof counterpartySchema>;

export const payMethodSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  credit_card: z.boolean().default(false),
  type: z.string().optional(),
  bank_account_id: z.string().optional(),
  due_day: z.number().optional(),
  closing_day: z.number().optional(),
  last_four_digits: z.string().optional(),
  credit_limit: z.number().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const fullPayMethodSchema = payMethodSchema.superRefine((data, ctx) => {
  if (data.credit_card) {
    if (!data.bank_account_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'A conta bancária associada é obrigatória', path: ['bank_account_id'] });
    }
    if (!data.due_day || data.due_day < 1 || data.due_day > 31) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'O dia de vencimento deve estar entre 1 e 31', path: ['due_day'] });
    }
    if (!data.closing_day || data.closing_day < 1 || data.closing_day > 31) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'O dia de fechamento deve estar entre 1 e 31', path: ['closing_day'] });
    }
    if (!data.last_four_digits || !/^\d{4}$/.test(data.last_four_digits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Informe exatamente os 4 últimos dígitos numéricos', path: ['last_four_digits'] });
    }
    if (!data.credit_limit || data.credit_limit <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'O limite de crédito deve ser maior que zero', path: ['credit_limit'] });
    }
  } else {
    if (!data.type || data.type.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selecione o tipo do método', path: ['type'] });
    }
    if (!data.bank_account_id || data.bank_account_id.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'A conta bancária associada é obrigatória', path: ['bank_account_id'] });
    }
  }
});

export type PayMethodFormData = z.infer<typeof payMethodSchema>;

export const walletNameSchema = z.object({
  name: z.string().min(2, 'O nome da carteira deve ter pelo menos 2 caracteres'),
});

export type WalletNameFormData = z.infer<typeof walletNameSchema>;

