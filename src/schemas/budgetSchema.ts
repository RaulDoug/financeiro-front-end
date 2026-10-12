import { z } from 'zod';

export const createBudgetFormSchema = z.object({
  category_id: z.string().min(1, 'Selecione uma categoria'),
  year: z.coerce.number().int().positive('Ano inválido'),
  month: z.coerce.number().int().min(1).max(12, 'Mês inválido'),
  target_amount: z.coerce
    .number({ invalid_type_error: 'Informe um valor numérico' })
    .positive('O valor da meta deve ser maior que zero'),
  mode: z.enum(['single', 'recurrent']),
  months_quantity: z.coerce
    .number()
    .int()
    .min(2, 'Mínimo de 2 meses')
    .max(12, 'Máximo de 12 meses')
    .optional(),
});

export const updateBudgetFormSchema = z.object({
  target_amount: z.coerce
    .number({ invalid_type_error: 'Informe um valor numérico' })
    .positive('O valor da meta deve ser maior que zero'),
  scope: z.enum(['single', 'following']),
});

export type CreateBudgetFormData = z.infer<typeof createBudgetFormSchema>;
export type UpdateBudgetFormData = z.infer<typeof updateBudgetFormSchema>;
