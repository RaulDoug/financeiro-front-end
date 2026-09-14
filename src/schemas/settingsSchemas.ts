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
});

export type PayMethodFormData = z.infer<typeof payMethodSchema>;

export const walletNameSchema = z.object({
  name: z.string().min(2, 'O nome da carteira deve ter pelo menos 2 caracteres'),
});

export type WalletNameFormData = z.infer<typeof walletNameSchema>;

