import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bankAccountService, type BankAccountItem } from '../../services/bankAccount.service.ts';
import { payMethodService, type PayMethodItem } from '../../services/payMethod.service.ts';
import { counterpartyService, type CounterpartyItem } from '../../services/counterparty.service.ts';
import { categoryService, type CategoryItem } from '../../services/category.service.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { CategorySelect } from './CategorySelect.tsx';
import { InstallmentFields } from './InstallmentFields.tsx';
import { resolveTransactionStatus } from '../../utils/transactionStatus.ts';
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
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? initialData.due_date.split('T')[0] : todayStr
  );
  const [isPaid, setIsPaid] = useState(initialData?.status === 'completed' || false);
  const [isCancelled, setIsCancelled] = useState(initialData?.status === 'cancelled' || false);
  const [paymentDate, setPaymentDate] = useState(
    initialData?.payment_date ? initialData.payment_date.split('T')[0] : ''
  );

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

  // AC-246: Preservar e mapear FKs existentes ao editar (initialData)
  useEffect(() => {
    if (initialData) {
      if (initialData.bank_account_id) {
        setBankAccountId(initialData.bank_account_id);
      } else if (initialData.bank_account_name && accountsData.length > 0) {
        const found = accountsData.find((a: BankAccountItem) => a.bank_name === initialData.bank_account_name);
        if (found) setBankAccountId(found.id);
      }

      const pId = initialData.pay_methods_id || (initialData as any).pay_method_id;
      if (pId) {
        setPayMethodId(pId);
      } else if (initialData.pay_method_name && payMethodsData.length > 0) {
        const found = payMethodsData.find((p: PayMethodItem) => p.name === initialData.pay_method_name);
        if (found) setPayMethodId(found.id);
      }

      if (initialData.category_id) {
        setCategoryId(initialData.category_id);
      } else if (initialData.category_name && allCategoriesData.length > 0) {
        const found = allCategoriesData.find((c: CategoryItem) => c.name === initialData.category_name);
        if (found) setCategoryId(found.id);
      }

      if (initialData.counterparty_id) {
        setCounterpartyId(initialData.counterparty_id);
      } else if (initialData.counterparty_name && counterpartiesData.length > 0) {
        const found = counterpartiesData.find((cp: CounterpartyItem) => cp.name === initialData.counterparty_name);
        if (found) setCounterpartyId(found.id);
      }
    }
  }, [initialData, accountsData, payMethodsData, allCategoriesData, counterpartiesData]);

  // Auto-selecionar primeira conta e primeiro método se vazio em novo lançamento (otimização Cafézinho)
  useEffect(() => {
    if (!initialData && !bankAccountId && accountsData.length > 0) {
      setBankAccountId(accountsData[0].id);
    }
  }, [initialData, accountsData, bankAccountId]);

  useEffect(() => {
    if (!initialData && !payMethodId && payMethodsData.length > 0) {
      setPayMethodId(payMethodsData[0].id);
    }
  }, [initialData, payMethodsData, payMethodId]);

  // Auto-selecionar primeira contraparte adequada se disponível
  useEffect(() => {
    if (!initialData && !counterpartyId && counterpartiesData.length > 0) {
      const match = counterpartiesData.find((cp: CounterpartyItem) =>
        type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee'
      );
      setCounterpartyId(match ? match.id : counterpartiesData[0].id);
    }
  }, [initialData, counterpartiesData, counterpartyId, type]);

  // AC-050: Checkbox "Já está pago" define payment_date = hoje
  const handleTogglePaid = (checked: boolean) => {
    setIsPaid(checked);
    if (checked) {
      setIsCancelled(false);
      setPaymentDate(todayStr);
    } else {
      setPaymentDate('');
    }
  };

  // AC-241: Checkbox "Cancelar transação" desativa status pago e limpa payment_date
  const handleToggleCancelled = (checked: boolean) => {
    setIsCancelled(checked);
    if (checked) {
      setIsPaid(false);
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

    if (type === 'transfers') {
      // Contraparte interna padrão para transferências
      const transferMatch = counterpartiesData.find(
        (cp: CounterpartyItem) =>
          cp.name.toLowerCase() === 'transferências' || cp.name.toLowerCase() === 'transferencias'
      );
      if (transferMatch) {
        finalCounterpartyId = transferMatch.id;
      } else {
        try {
          const created = await counterpartyService.createCounterparty({
            name: 'Transferências',
            type: 'payee',
          });
          if (created?.item?.id) {
            finalCounterpartyId = created.item.id;
          }
        } catch (err) {
          console.warn('Could not auto-create transfer counterparty', err);
        }
      }
    } else {
      if (!finalCounterpartyId && counterpartiesData.length > 0) {
        const match = counterpartiesData.find(
          (cp: CounterpartyItem) =>
            cp.name.toLowerCase() !== 'transferências' &&
            cp.name.toLowerCase() !== 'transferencias' &&
            (type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee')
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
    }

    const resolvedStatus = resolveTransactionStatus({
      isCancelled,
      isPaid,
      dueDate,
    });

    // O backend atualiza automaticamente para 'expired' quando due_date < hoje ao receber 'pending'.
    // Enviar 'expired' diretamente sem alterar due_date causa erro 500 no helper updateTransactionsHelper.js.
    const payloadStatus = isCancelled ? 'cancelled' : isPaid ? 'completed' : 'pending';

    const payload: any = {
      description: description.trim(),
      value: numValue,
      bank_account_id: bankAccountId,
      due_date: dueDate,
      status: payloadStatus,
      payment_date: isPaid ? paymentDate || todayStr : undefined,
    };

    if (resolvedStatus === 'completed') {
      payload.payment_date = paymentDate || todayStr;
    } else {
      delete payload.payment_date;
    }

    if (finalCounterpartyId) {
      payload.counterparty_id = finalCounterpartyId;
    }

    if (type === 'transfers') {
      payload.type = 'transfers';
      payload.destiny_bank_account_id = destinyBankAccountId;
      payload.status = isCancelled ? 'cancelled' : 'completed';
      payload.pay_methods_id = payMethodId || payMethodsData[0]?.id;

      // Categoria padrão para transferências (AC-234)
      const transferCat = allCategoriesData.find(
        (c: CategoryItem) =>
          c.name.toLowerCase() === 'transferência' || c.name.toLowerCase() === 'transferencia'
      );
      if (transferCat) {
        payload.category_id = transferCat.id;
      } else {
        try {
          const newCat = await categoryService.createCategory({
            name: 'Transferência',
            type: 'expenses',
            icon: 'arrow-left-right',
            color: '#2563eb',
          });
          if (newCat?.item?.id) {
            payload.category_id = newCat.item.id;
          }
        } catch {
          payload.category_id = allCategoriesData[0]?.id;
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

  const projectedStatus = resolveTransactionStatus({
    isCancelled,
    isPaid,
    dueDate,
  });
  const isReactivating = Boolean(initialData && initialData.status === 'cancelled' && !isCancelled);

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
        <label className={`flex items-center gap-2 text-sm ${isCancelled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}`}>
          <input
            type="checkbox"
            checked={isPaid}
            disabled={isCancelled}
            onChange={(e) => handleTogglePaid(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          Já está pago / recebido
        </label>
      </div>

      {/* Opção de Cancelamento na Edição (AC-240, AC-241, AC-247) */}
      {initialData && (
        <div
          className={`p-3 rounded-xl border transition-colors ${
            isCancelled
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
              : 'bg-gray-50 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700'
          }`}
        >
          <label className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 cursor-pointer">
            <input
              type="checkbox"
              data-testid="cancel-transaction-checkbox"
              checked={isCancelled}
              onChange={(e) => handleToggleCancelled(e.target.checked)}
              className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
            />
            Cancelar esta transação
          </label>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 pl-5">
            Transações canceladas não impactam seus saldos e só aparecem ao selecionar o filtro de cancelados.
          </p>

          {isReactivating && (
            <div
              data-testid="reactivation-preview"
              className="mt-2.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
            >
              <span className="font-semibold">Reativação:</span>
              <span>
                Esta transação será reativada com status{' '}
                <strong className="underline">
                  {projectedStatus === 'completed'
                    ? 'Concluída'
                    : projectedStatus === 'expired'
                    ? 'Vencida'
                    : 'Pendente'}
                </strong>
                {projectedStatus === 'expired' && ' (vencimento anterior à data de hoje)'}.
              </span>
            </div>
          )}
        </div>
      )}

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
          transactionType={type as any}
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
          className={`w-full py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50 ${
            isCancelled
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting
            ? 'Salvando...'
            : initialData
            ? isCancelled
              ? 'Salvar como Cancelada'
              : isReactivating
              ? projectedStatus === 'completed'
                ? 'Reativar como Concluída'
                : projectedStatus === 'expired'
                ? 'Reativar como Vencida'
                : 'Reativar como Pendente'
              : 'Atualizar Transação'
            : 'Salvar Transação'}
        </button>
      </div>
    </form>
  );
};

