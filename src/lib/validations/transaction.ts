import { z } from 'zod';

export const transactionBaseSchema = z.object({
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  value: z
    .number({ invalid_type_error: 'Informe um valor numérico válido' })
    .positive('O valor deve ser maior que zero'),
  bank_account_id: z.string().min(1, 'Selecione uma conta bancária'),
  pay_methods_id: z.string().min(1, 'Selecione uma forma de pagamento'),
  category_id: z.string().min(1, 'Selecione uma categoria'),
  counterparty_id: z.string().optional(),
  due_date: z.string().min(1, 'Informe a data de vencimento'),
  payment_date: z.string().optional(),
  purchase_date: z.string().optional(),
  is_recurrent: z.boolean().optional(),
  is_installment: z.boolean().optional(),
  installments_number: z.number().int().min(2, 'Mínimo de 2 parcelas').max(72, 'Máximo de 72 parcelas').optional(),
  due_day: z.number().int().min(1, 'Dia entre 1 e 31').max(31, 'Dia entre 1 e 31').optional(),
  first_this_month: z.boolean().optional(),
});

export const transferSchema = z
  .object({
    description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    value: z
      .number({ invalid_type_error: 'Informe um valor numérico válido' })
      .positive('O valor deve ser maior que zero'),
    bank_account_id: z.string().min(1, 'Selecione a conta de origem'),
    destiny_bank_account_id: z.string().min(1, 'Selecione a conta de destino'),
    due_date: z.string().min(1, 'Informe a data'),
    payment_date: z.string().optional(),
  })
  .refine((data) => data.bank_account_id !== data.destiny_bank_account_id, {
    message: 'As contas de origem e destino devem ser diferentes',
    path: ['destiny_bank_account_id'],
  });

export type TransactionFormData = z.infer<typeof transactionBaseSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;

