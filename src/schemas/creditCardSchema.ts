import { z } from 'zod';

export const creditCardSchema = z.object({
  name: z.string().min(2, 'O nome do cartão deve ter pelo menos 2 caracteres'),
  bank_account_id: z.string().min(1, 'A conta bancária associada é obrigatória'),
  due_day: z
    .number({ invalid_type_error: 'Informe o dia do vencimento' })
    .int('Deve ser um número inteiro')
    .min(1, 'O dia deve estar entre 1 e 31')
    .max(31, 'O dia deve estar entre 1 e 31'),
  closing_day: z
    .number({ invalid_type_error: 'Informe o dia de fechamento' })
    .int('Deve ser um número inteiro')
    .min(1, 'O dia deve estar entre 1 e 31')
    .max(31, 'O dia deve estar entre 1 e 31'),
  last_four_digits: z
    .string()
    .length(4, 'Informe exatamente os 4 últimos dígitos')
    .regex(/^\d{4}$/, 'Os dígitos devem conter apenas números'),
  credit_limit: z
    .number({ invalid_type_error: 'Informe o limite de crédito' })
    .positive('O limite deve ser maior que zero'),
  color: z.string().optional(),
  brand: z.string().optional(),
  icon: z.string().optional(),
});

export type CreditCardSchemaType = z.infer<typeof creditCardSchema>;

