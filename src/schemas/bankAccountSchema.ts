import { z } from 'zod';

export const bankAccountSchema = z.object({
  bank_name: z
    .string()
    .min(2, 'O nome do banco deve ter pelo menos 2 caracteres'),
  balance: z
    .number({ invalid_type_error: 'Informe um valor válido para o saldo' })
    .default(0),
  allow_negative_balance: z.boolean().default(false),
});

export type BankAccountSchemaType = z.infer<typeof bankAccountSchema>;

