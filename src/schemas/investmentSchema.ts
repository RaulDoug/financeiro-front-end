import { z } from 'zod';

export const investmentAssetSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome do ativo deve ter pelo menos 2 caracteres'),
  bank_account_id: z
    .string({ required_error: 'A conta bancária é obrigatória' })
    .min(1, 'A conta bancária é obrigatória'),
  due_date: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

export type InvestmentAssetFormData = z.infer<typeof investmentAssetSchema>;

