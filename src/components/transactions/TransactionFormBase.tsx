import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bankAccountService, type BankAccountItem } from '../../services/bankAccount.service.ts';
import { payMethodService, type PayMethodItem } from '../../services/payMethod.service.ts';
import { counterpartyService, type CounterpartyItem } from '../../services/counterparty.service.ts';
import { categoryService } from '../../services/category.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { CategorySelect } from './CategorySelect.tsx';
import { InstallmentFields } from './InstallmentFields.tsx';
import type { Transaction, TransactionType } from '../../types/transaction.ts';

interface Props {
  type: TransactionType;
  initialData?: Transaction | null;
  onSubmit: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const TransactionFormBase: React.FC<Props> = ({
  type,
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const todayStr = new Date().toISOString().split('T')[0];

  const [description, setDescription] = useState(initialData?.description || '');
  const [value, setValue] = useState(initialData?.value ? parseFloat(initialData.value) : '');
  const [bankAccountId, setBankAccountId] = useState('');
  const [destinyBankAccountId, setDestinyBankAccountId] = useState('');
  const [payMethodId, setPayMethodId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [counterpartyId, setCounterpartyId] = useState(initialData?.counterparty_id || '');
  const [dueDate, setDueDate] = useState(initialData?.due_date || todayStr);
  const [isPaid, setIsPaid] = useState(initialData?.status === 'completed' || false);
  const [paymentDate, setPaymentDate] = useState(initialData?.payment_date || '');

  // Parcelamento
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsNumber, setInstallmentsNumber] = useState(2);
  const [dueDay, setDueDay] = useState(10);
  const [firstThisMonth, setFirstThisMonth] = useState(true);

  // Edição em lote
  const [applyToAllInstallments, setApplyToAllInstallments] = useState(false);

  // Erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar contas bancárias
  const { data: accountsData = [] } = useQuery({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId),
  });

  // Buscar métodos de pagamento
  const { data: payMethodsData = [] } = useQuery({
    queryKey: ['pay-methods', currentWalletId],
    queryFn: async () => {
      const res = await payMethodService.getPayMethods();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId),
  });

  // Buscar contrapartes
  const { data: counterpartiesData = [] } = useQuery({
    queryKey: ['counterparties', currentWalletId],
    queryFn: () => counterpartyService.getCounterparties(),
    enabled: Boolean(currentWalletId),
  });

  // Buscar todas as categorias (para fallback de transferências)
  const { data: allCategoriesData = [] } = useQuery({
    queryKey: ['categories-all', currentWalletId],
    queryFn: () => categoryService.getCategories(),
    enabled: Boolean(currentWalletId),
  });

  // Auto-selecionar primeira conta e primeiro método se vazio (otimização Cafézinho)
  useEffect(() => {
    if (!bankAccountId && accountsData.length > 0) {
      setBankAccountId(accountsData[0].id);
    }
  }, [accountsData, bankAccountId]);

  useEffect(() => {
    if (!payMethodId && payMethodsData.length > 0) {
      setPayMethodId(payMethodsData[0].id);
    }
  }, [payMethodsData, payMethodId]);

  // Auto-selecionar primeira contraparte adequada se disponível
  useEffect(() => {
    if (!counterpartyId && counterpartiesData.length > 0) {
      const match = counterpartiesData.find((cp: CounterpartyItem) =>
        type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee'
      );
      setCounterpartyId(match ? match.id : counterpartiesData[0].id);
    }
  }, [counterpartiesData, counterpartyId, type]);

  // AC-050: Checkbox "Já está pago" define payment_date = hoje
  const handleTogglePaid = (checked: boolean) => {
    setIsPaid(checked);
    if (checked) {
      setPaymentDate(todayStr);
    } else {
      setPaymentDate('');
    }
  };

  const selectedPayMethod = payMethodsData.find((p: PayMethodItem) => p.id === payMethodId);
  const isCreditCard = Boolean(selectedPayMethod?.credit_card);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description || description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter pelo menos 3 caracteres';
    }
    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
    if (!numValue || isNaN(numValue) || numValue <= 0) {
      newErrors.value = 'Informe um valor maior que zero';
    }

    if (type === 'transfers') {
      if (!bankAccountId) newErrors.bankAccountId = 'Selecione a conta de origem';
      if (!destinyBankAccountId) newErrors.destinyBankAccountId = 'Selecione a conta de destino';
      if (bankAccountId && destinyBankAccountId && bankAccountId === destinyBankAccountId) {
        newErrors.destinyBankAccountId = 'As contas de origem e destino devem ser diferentes';
      }
    } else {
      if (!bankAccountId) newErrors.bankAccountId = 'Selecione a conta';
      if (!payMethodId) newErrors.payMethodId = 'Selecione a forma de pagamento';
      if (!categoryId) newErrors.categoryId = 'Selecione uma categoria';

      // AC-055: Bloqueio de cartão como receita recorrente
      if (isCreditCard && type === 'incomings' && isInstallment) {
        newErrors.payMethodId = 'Não é possível usar cartão de crédito como forma de entrada recorrente';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Garantir contraparte válida
    let finalCounterpartyId = counterpartyId;
    if (!finalCounterpartyId && counterpartiesData.length > 0) {
      const match = counterpartiesData.find((cp: CounterpartyItem) =>
        type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee'
      );
      finalCounterpartyId = match ? match.id : counterpartiesData[0].id;
    }

    if (!finalCounterpartyId) {
      try {
        const created = await counterpartyService.createCounterparty({
          name: 'Geral',
          type: type === 'incomings' ? 'payer' : 'payee',
        });
        if (created?.item?.id) {
          finalCounterpartyId = created.item.id;
        }
      } catch (err) {
        console.warn('Could not auto-create counterparty', err);
      }
    }

    const payload: any = {
      description: description.trim(),
      value: numValue,
      bank_account_id: bankAccountId,
      due_date: dueDate,
      status: isPaid ? 'completed' : 'pending',
      payment_date: isPaid ? paymentDate || todayStr : undefined,
    };

    if (finalCounterpartyId) {
      payload.counterparty_id = finalCounterpartyId;
    }

    if (type === 'transfers') {
      payload.type = 'transfers';
      payload.destiny_bank_account_id = destinyBankAccountId;
      payload.status = isPaid ? 'completed' : 'completed';
      payload.category_id = categoryId || allCategoriesData[0]?.id;
      payload.pay_methods_id = payMethodId || payMethodsData[0]?.id;

      if (!payload.category_id) {
        try {
          const newCat = await categoryService.createCategory({
            name: 'Transferência',
            type: 'expenses',
          });
          if (newCat?.item?.id) {
            payload.category_id = newCat.item.id;
          }
        } catch {
          // ignore
        }
      }
    } else {
      payload.type = type;
      payload.pay_methods_id = payMethodId;
      payload.category_id = categoryId;

      if (isInstallment) {
        payload.installments_number = installmentsNumber;
        payload.due_day = dueDay;
        payload.first_this_month = firstThisMonth;
      }
    }

    if (initialData?.current_installment && applyToAllInstallments) {
      payload.all_installments = true;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Valor Proeminente (Cafézinho) */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Valor (R$) *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">R$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="0,00"
            autoFocus
            className={`w-full pl-11 pr-4 py-2.5 text-2xl font-bold rounded-lg border focus:outline-none focus:ring-2 ${
              errors.value ? 'border-rose-300 ring-rose-200' : 'border-gray-200 focus:ring-blue-500'
            }`}
          />
        </div>
        {errors.value && <p className="text-xs text-rose-500 mt-1">{errors.value}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição *</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Café da tarde, Salário, Transferência..."
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.description ? 'border-rose-300 ring-rose-200' : 'border-gray-200 focus:ring-blue-500'
          }`}
        />
        {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
      </div>

      {/* Seção Condicional: Transferência vs Receita/Despesa */}
      {type === 'transfers' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Conta de Origem *</label>
            <select
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">Selecione a origem</option>
              {accountsData.map((a: BankAccountItem) => (
                <option key={a.id} value={a.id}>
                  {a.bank_name}
                </option>
              ))}
            </select>
            {errors.bankAccountId && <p className="text-xs text-rose-500 mt-1">{errors.bankAccountId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Conta de Destino *</label>
            <select
              value={destinyBankAccountId}
              onChange={(e) => setDestinyBankAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">Selecione o destino</option>
              {accountsData.map((a: BankAccountItem) => (
                <option key={a.id} value={a.id}>
                  {a.bank_name}
                </option>
              ))}
            </select>
            {errors.destinyBankAccountId && (
              <p className="text-xs text-rose-500 mt-1">{errors.destinyBankAccountId}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Categoria filtrada */}
          <CategorySelect
            type={type}
            value={categoryId}
            onChange={setCategoryId}
            error={errors.categoryId}
          />

          {/* Conta Bancária */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Conta Bancária *</label>
            <select
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500"
            >
              <option value="">Selecione a conta</option>
              {accountsData.map((a: BankAccountItem) => (
                <option key={a.id} value={a.id}>
                  {a.bank_name}
                </option>
              ))}
            </select>
            {errors.bankAccountId && <p className="text-xs text-rose-500 mt-1">{errors.bankAccountId}</p>}
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Forma de Pagamento *</label>
            <select
              value={payMethodId}
              onChange={(e) => setPayMethodId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500"
            >
              <option value="">Selecione a forma</option>
              {payMethodsData.map((p: PayMethodItem) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.credit_card ? '(Cartão)' : ''}
                </option>
              ))}
            </select>
            {errors.payMethodId && <p className="text-xs text-rose-500 mt-1">{errors.payMethodId}</p>}
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Data de Vencimento *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500"
            />
          </div>

          {/* Contraparte / Favorecido */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {type === 'incomings' ? 'Pagador / Origem' : 'Beneficiário / Destino'}
            </label>
            <select
              value={counterpartyId}
              onChange={(e) => setCounterpartyId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-blue-500"
            >
              <option value="">Selecione a contraparte (ou Geral)</option>
              {counterpartiesData.map((cp: CounterpartyItem) => (
                <option key={cp.id} value={cp.id}>
                  {cp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Checkbox "Já está pago" (AC-050) */}
      <div className="flex items-center gap-2 pt-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => handleTogglePaid(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Já está pago / recebido
        </label>
      </div>

      {/* Seção de Parcelamento */}
      {type !== 'transfers' && !initialData && (
        <InstallmentFields
          isInstallment={isInstallment}
          onToggleInstallment={setIsInstallment}
          installmentsNumber={installmentsNumber}
          onChangeInstallmentsNumber={setInstallmentsNumber}
          dueDay={dueDay}
          onChangeDueDay={setDueDay}
          firstThisMonth={firstThisMonth}
          onChangeFirstThisMonth={setFirstThisMonth}
          isCreditCard={isCreditCard}
          transactionType={type}
        />
      )}

      {/* Opção "Aplicar a todas as parcelas" na Edição (AC-057) */}
      {initialData?.current_installment && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <label className="flex items-center gap-2 text-xs font-semibold text-blue-800 cursor-pointer">
            <input
              type="checkbox"
              checked={applyToAllInstallments}
              onChange={(e) => setApplyToAllInstallments(e.target.checked)}
              className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
            />
            Aplicar alterações a todas as parcelas desta série ({initialData.current_installment})
          </label>
        </div>
      )}

      {/* Botão de Envio */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar Transação' : 'Salvar Transação'}
        </button>
      </div>
    </form>
  );
};

