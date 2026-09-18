import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  CalendarCheck,
  Tag,
  Wallet,
  FileText,
  Check,
  Zap,
  ChevronDown,
  CheckCircle2,
  CreditCard,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { categoryService, type CategoryItem } from '../../services/category.service.ts';
import { bankAccountService, type BankAccountItem } from '../../services/bankAccount.service.ts';
import { payMethodService, type PayMethodItem } from '../../services/payMethod.service.ts';
import { counterpartyService, type CounterpartyItem } from '../../services/counterparty.service.ts';
import { renderLucideIcon } from '../shared/IconPicker.tsx';
import { detectBankByName } from '../../lib/bankDetector.ts';
import { resolveTransactionStatus } from '../../utils/transactionStatus.ts';
import type { TransactionType } from '../../types/transaction.ts';

interface MobileQuickEntryProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
  initialType?: TransactionType;
  onSubmit: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const MobileQuickEntry: React.FC<MobileQuickEntryProps> = ({
  isOpen,
  onClose,
  isClosing = false,
  initialType = 'expenses',
  onSubmit,
  isSubmitting = false,
}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);
  const todayStr = new Date().toISOString().split('T')[0];

  const [type, setType] = useState<TransactionType>(initialType);
  const [valueCents, setValueCents] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => todayStr);
  const [paymentDate, setPaymentDate] = useState(() => todayStr);
  const [categoryId, setCategoryId] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [destinyBankAccountId, setDestinyBankAccountId] = useState('');
  const [payMethodId, setPayMethodId] = useState('');
  const [counterpartyId, setCounterpartyId] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Estados e manipuladores para drag-to-dismiss (arraste vertical descendente)
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea')) {
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      onClose();
    } else {
      setDragY(0);
    }
  };

  // Suporte a mouse para testes no desktop / DevTools
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea')) {
      return;
    }
    touchStartY.current = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      onClose();
    } else {
      setDragY(0);
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragY((curr) => {
        if (curr > 90) {
          onClose();
          return 0;
        }
        return 0;
      });
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, onClose]);

  // Sub-pickers compatibilidade retroativa
  const [activePicker, setActivePicker] = useState<string | null>(null);
  if (false as boolean) {
    void activePicker;
    void setActivePicker;
  }

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', currentWalletId],
    queryFn: () => categoryService.getCategories(),
    enabled: Boolean(currentWalletId && isOpen),
  });

  const { data: accountsData = [] } = useQuery({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId && isOpen),
  });

  const { data: payMethodsData = [] } = useQuery({
    queryKey: ['pay-methods', currentWalletId],
    queryFn: async () => {
      const res = await payMethodService.getPayMethods();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId && isOpen),
  });

  const { data: counterpartiesData = [] } = useQuery({
    queryKey: ['counterparties', currentWalletId],
    queryFn: () => counterpartyService.getCounterparties(),
    enabled: Boolean(currentWalletId && isOpen),
  });

  const selectedPayMethod = payMethodsData.find((p: PayMethodItem) => p.id === payMethodId);
  const isCreditCard = Boolean(selectedPayMethod?.credit_card);

  // Auto-seleções padrão
  useEffect(() => {
    if (!bankAccountId && accountsData.length > 0) {
      setBankAccountId(accountsData[0].id);
    }
  }, [accountsData, bankAccountId]);

  // AC-313: Vincular e bloquear conta bancária quando o método de pagamento for cartão de crédito
  useEffect(() => {
    if (isCreditCard && selectedPayMethod?.bank_account_id) {
      setBankAccountId(selectedPayMethod.bank_account_id);
    }
  }, [isCreditCard, selectedPayMethod?.bank_account_id]);

  const handlePayMethodChange = (newPayMethodId: string) => {
    setPayMethodId(newPayMethodId);
    const pm = payMethodsData.find((p: PayMethodItem) => p.id === newPayMethodId);
    if (pm?.credit_card && pm.bank_account_id) {
      setBankAccountId(pm.bank_account_id);
    }
  };

  useEffect(() => {
    if (!destinyBankAccountId && accountsData.length > 1) {
      setDestinyBankAccountId(accountsData[1].id);
    }
  }, [accountsData, destinyBankAccountId]);

  useEffect(() => {
    const targetType = type === 'incomings' ? 'incomings' : 'expenses';
    const filtered = categories
      .filter(
        (c: CategoryItem) =>
          !c.name.toLowerCase().startsWith('transferência') &&
          !c.name.toLowerCase().startsWith('transferencia')
      )
      .filter((c: CategoryItem) => c.type === targetType);
    if (filtered.length > 0) {
      const currentExists = filtered.some((c: CategoryItem) => c.id === categoryId);
      if (!currentExists) {
        setCategoryId(filtered[0].id);
      }
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, type]);

  useEffect(() => {
    if (!payMethodId && payMethodsData.length > 0) {
      setPayMethodId(payMethodsData[0].id);
      if (payMethodsData[0].credit_card && payMethodsData[0].bank_account_id) {
        setBankAccountId(payMethodsData[0].bank_account_id);
      }
    }
  }, [payMethodsData, payMethodId]);

  useEffect(() => {
    if (counterpartiesData.length > 0) {
      if (type === 'transfers') {
        const transferCp = counterpartiesData.find(
          (cp: CounterpartyItem) =>
            cp.name.toLowerCase() === 'transferências' || cp.name.toLowerCase() === 'transferencias'
        );
        if (transferCp) {
          setCounterpartyId(transferCp.id);
          return;
        }
      }
      const expectedType = type === 'incomings' ? 'payer' : 'payee';
      const match = counterpartiesData.find(
        (cp: CounterpartyItem) =>
          cp.name.toLowerCase() !== 'transferências' &&
          cp.name.toLowerCase() !== 'transferencias' &&
          cp.type === expectedType
      );
      setCounterpartyId(match ? match.id : counterpartiesData[0].id);
    }
  }, [counterpartiesData, type]);

  useEffect(() => {
    if (isOpen) {
      setErrorBanner(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const cents = parseInt(rawDigits || '0', 10);
    setValueCents(cents > 99999999 ? 99999999 : cents);
  };

  const numericValue = valueCents / 100;

  const formattedCents = (valueCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSave = async () => {
    if (numericValue <= 0) return;
    setErrorBanner(null);

    const defaultDesc =
      type === 'expenses' ? 'Despesa' : type === 'incomings' ? 'Receita' : 'Transferência';

    const finalDueDate = dueDate.trim() || todayStr;
    const finalPaymentDate = paymentDate.trim() || todayStr;

    // Garantir contraparte válida para evitar erro 400 Bad Request
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
      isCancelled: false,
      isPaid,
      dueDate: finalDueDate,
      todayStr,
    });

    const payload: any = {
      description: description.trim() || defaultDesc,
      value: numericValue,
      type,
      due_date: finalDueDate,
      status: resolvedStatus || (isPaid ? 'completed' : 'pending'),
      payment_date: isPaid ? finalPaymentDate : undefined,
    };

    if (finalCounterpartyId) {
      payload.counterparty_id = finalCounterpartyId;
    }

    if (type === 'transfers') {
      payload.bank_account_id = bankAccountId || accountsData[0]?.id;
      payload.destiny_bank_account_id =
        destinyBankAccountId || accountsData[1]?.id || accountsData[0]?.id;
      payload.pay_methods_id = payMethodId || payMethodsData[0]?.id;

      // Categoria padrão de sistema para transferências (AC-234)
      let transferCategoryId = categories.find(
        (c: CategoryItem) =>
          c.name.toLowerCase() === 'transferência' || c.name.toLowerCase() === 'transferencia'
      )?.id;

      if (!transferCategoryId) {
        try {
          const created = await categoryService.createCategory({
            name: 'Transferência',
            type: 'expenses',
            icon: 'arrow-left-right',
            color: '#2563eb',
          });
          if (created?.item?.id) {
            transferCategoryId = created.item.id;
          }
        } catch (err) {
          console.warn('Could not auto-create transfer category', err);
        }
      }

      payload.category_id = transferCategoryId || categories[0]?.id;
    } else {
      const finalBankAccountId =
        isCreditCard && selectedPayMethod?.bank_account_id
          ? selectedPayMethod.bank_account_id
          : bankAccountId || accountsData[0]?.id;
      payload.bank_account_id = finalBankAccountId;
      payload.category_id = categoryId || categories[0]?.id;
      payload.pay_methods_id = payMethodId || payMethodsData[0]?.id;
    }

    try {
      await onSubmit(payload);
      setValueCents(0);
      setDescription('');
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Não foi possível salvar a transação. Verifique os dados.';
      setErrorBanner(msg);
    }
  };

  const selectedCategory = categories.find((c: CategoryItem) => c.id === categoryId);
  const selectedAccount = accountsData.find((a: BankAccountItem) => a.id === bankAccountId);
  const selectedDestinyAccount = accountsData.find((a: BankAccountItem) => a.id === destinyBankAccountId);
  const selectedCounterparty = counterpartiesData.find((cp: CounterpartyItem) => cp.id === counterpartyId);

  const detectedBank = selectedAccount ? detectBankByName(selectedAccount.bank_name) : null;
  const selectedAccountColor = selectedAccount?.color || detectedBank?.primaryColor || '#2563eb';

  const detectedDestiny = selectedDestinyAccount ? detectBankByName(selectedDestinyAccount.bank_name) : null;
  const selectedDestinyColor = selectedDestinyAccount?.color || detectedDestiny?.primaryColor || '#2563eb';

  const filteredCategories = categories
    .filter(
      (c: CategoryItem) =>
        !c.name.toLowerCase().startsWith('transferência') &&
        !c.name.toLowerCase().startsWith('transferencia')
    )
    .filter((c: CategoryItem) =>
      type === 'incomings' ? c.type === 'incomings' : c.type === 'expenses'
    );

  const filteredCounterparties = counterpartiesData
    .filter(
      (cp: CounterpartyItem) =>
        cp.name.toLowerCase() !== 'transferências' && cp.name.toLowerCase() !== 'transferencias'
    )
    .filter((cp: CounterpartyItem) =>
      type === 'incomings' ? cp.type === 'payer' : cp.type === 'payee'
    );

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(new Date(dateStr + 'T12:00:00'));
    } catch {
      return dateStr;
    }
  };

  const formattedDueDateDisplay = formatFriendlyDate(dueDate || todayStr);
  const formattedPaymentDateDisplay = formatFriendlyDate(paymentDate || todayStr);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{
        opacity: dragY > 0 ? Math.max(0, 1 - dragY / 300) : undefined,
      }}
      data-testid="mobile-quick-entry-container"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-4 pb-6 space-y-3 max-h-[94vh] flex flex-col overflow-y-auto ${
          isClosing ? 'animate-drawer-out' : isDragging || dragY > 0 ? '' : 'animate-drawer-in'
        }`}
        style={{
          transform: isClosing ? undefined : dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid="mobile-quick-entry-card"
      >
        {/* Handle superior de arraste */}
        <div
          className="w-full flex justify-center pb-1 pt-1 cursor-grab touch-none select-none active:cursor-grabbing"
          id="drawer-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Header com Ícone Raio, Título e Botão Fechar */}
        <div
          className="flex items-center justify-between touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="flex items-center gap-2.5 pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                Fluxo Ágil
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                O Cafézinho • 10 segundos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Fechar"
            id="close-drawer"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner de Erro caso ocorra falha na API */}
        {errorBanner && (
          <div
            data-testid="quick-entry-error-banner"
            className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Abas Segmentadas de Tipo */}
        <div
          className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1"
          data-testid="quick-entry-tabs"
        >
          <button
            type="button"
            data-testid="tab-quick-income"
            onClick={() => setType('incomings')}
            className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold transition-all cursor-pointer ${
              type === 'incomings'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            data-testid="tab-quick-expense"
            onClick={() => setType('expenses')}
            className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold transition-all cursor-pointer ${
              type === 'expenses'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Despesa
          </button>
          <button
            type="button"
            data-testid="tab-quick-transfer"
            onClick={() => setType('transfers')}
            className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold transition-all cursor-pointer ${
              type === 'transfers'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Transferência
          </button>
        </div>

        {/* Display do Valor Monetário com Input Nativo (AC-225) */}
        <div
          className="flex flex-col items-center justify-center py-1"
          data-testid="mobile-quick-keypad"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            {type === 'expenses'
              ? 'Valor da Despesa'
              : type === 'incomings'
              ? 'Valor da Receita'
              : 'Valor da Transferência'}
          </span>
          <div
            data-testid="quick-entry-display-value"
            className={`flex items-baseline justify-center font-extrabold ${
              type === 'incomings'
                ? 'text-emerald-600 dark:text-emerald-400'
                : type === 'expenses'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            <span className="text-xl font-bold mr-1.5 select-none">R$</span>
            <input
              type="text"
              inputMode="numeric"
              data-testid="quick-entry-value-input"
              value={formattedCents}
              onChange={handleValueChange}
              autoFocus
              className="text-3xl font-extrabold tracking-tight bg-transparent focus:outline-none text-center w-44"
            />
          </div>
        </div>

        {/* Campo de Descrição (AC-226) */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
            Descrição
          </label>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 h-11 border border-slate-200 dark:border-slate-700">
            <FileText className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              data-testid="quick-entry-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'expenses'
                  ? 'Qual foi o gasto?'
                  : type === 'incomings'
                  ? 'Qual foi a receita?'
                  : 'Descrição da transferência'
              }
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Grid de Conta e Categoria (ou Origem e Destino) (AC-226) */}
        {type === 'transfers' ? (
          <div className="grid grid-cols-2 gap-2">
            {/* Conta de Origem */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
                Conta de Origem
              </label>
              <div
                data-testid="chip-account"
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: selectedAccountColor }}
                  />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedAccount?.bank_name || 'Origem'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  data-testid="select-quick-account"
                >
                  {accountsData.map((acc: BankAccountItem) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conta de Destino */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
                Conta de Destino
              </label>
              <div
                data-testid="chip-account-destiny"
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: selectedDestinyColor }}
                  />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedDestinyAccount?.bank_name || 'Destino'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={destinyBankAccountId}
                  onChange={(e) => setDestinyBankAccountId(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  data-testid="select-quick-destiny-account"
                >
                  {accountsData.map((acc: BankAccountItem) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* Conta */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
                {type === 'incomings' ? 'Conta de Entrada' : 'Conta de Saída'}
                {isCreditCard && (
                  <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                    (Vinculada ao cartão)
                  </span>
                )}
              </label>
              <div
                data-testid="chip-account"
                className={`flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden ${
                  isCreditCard ? 'opacity-70 bg-slate-200/60 dark:bg-slate-800/40 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: selectedAccountColor }}
                  />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedAccount?.bank_name || 'Conta'}
                  </span>
                </div>
                {!isCreditCard && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                <select
                  value={bankAccountId}
                  disabled={isCreditCard}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className={`absolute inset-0 opacity-0 w-full h-full ${
                    isCreditCard ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                  }`}
                  data-testid="select-quick-account"
                >
                  {accountsData.map((acc: BankAccountItem) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
                Categoria
              </label>
              <div
                data-testid="chip-category"
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="text-amber-500 shrink-0">
                    {renderLucideIcon(selectedCategory?.icon, 'w-3.5 h-3.5') || (
                      <Tag className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedCategory?.name || 'Categoria'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  data-testid="select-quick-category"
                >
                  {filteredCategories.map((cat: CategoryItem) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Grid: Forma de Pagamento e Contraparte (AC-226, AC-232, AC-233) */}
        {type === 'transfers' ? (
          <div className="flex flex-col gap-1 relative">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1 truncate">
              Forma de Pagamento
            </label>
            <div
              data-testid="chip-pay-method"
              className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <div className="text-blue-500 shrink-0">
                  {selectedPayMethod?.credit_card ? (
                    <CreditCard className="w-3.5 h-3.5" />
                  ) : (
                    renderLucideIcon(selectedPayMethod?.icon, 'w-3.5 h-3.5') || (
                      <Wallet className="w-3.5 h-3.5" />
                    )
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {selectedPayMethod?.name || 'Pagamento'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={payMethodId}
                onChange={(e) => handlePayMethodChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                data-testid="select-quick-pay-method"
              >
                {payMethodsData.map((pm: PayMethodItem) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* Forma de Pagamento */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1 truncate">
                Forma de Pagamento
              </label>
              <div
                data-testid="chip-pay-method"
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="text-blue-500 shrink-0">
                    {selectedPayMethod?.credit_card ? (
                      <CreditCard className="w-3.5 h-3.5" />
                    ) : (
                      renderLucideIcon(selectedPayMethod?.icon, 'w-3.5 h-3.5') || (
                        <Wallet className="w-3.5 h-3.5" />
                      )
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedPayMethod?.name || 'Pagamento'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={payMethodId}
                  onChange={(e) => handlePayMethodChange(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  data-testid="select-quick-pay-method"
                >
                  {payMethodsData.map((pm: PayMethodItem) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contraparte / Favorecido (AC-232) */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1 truncate">
                {type === 'incomings' ? 'Pagador / Origem' : 'Beneficiário / Destino'}
              </label>
              <div
                data-testid="chip-counterparty"
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-11 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {selectedCounterparty?.name || 'Geral'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={counterpartyId}
                  onChange={(e) => setCounterpartyId(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  data-testid="select-quick-counterparty"
                >
                  {filteredCounterparties.length > 0 ? (
                    filteredCounterparties.map((cp: CounterpartyItem) => (
                      <option key={cp.id} value={cp.id}>
                        {cp.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Geral</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Datas: Vencimento e Pagamento (AC-228, AC-230) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Data de Vencimento */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
              Data de Vencimento
            </label>
            <div
              data-testid="chip-date"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try {
                    input.showPicker();
                  } catch {
                    input.focus();
                  }
                }
              }}
              title={`Vencimento: ${formattedDueDateDisplay}`}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 h-11 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                data-testid="input-quick-due-date"
              />
            </div>
          </div>

          {/* Data de Pagamento */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
              Data de Pagamento
            </label>
            <div
              data-testid="chip-payment-date"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try {
                    input.showPicker();
                  } catch {
                    input.focus();
                  }
                }
              }}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 h-11 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-500 shrink-0 pointer-events-none" />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => {
                  setPaymentDate(e.target.value);
                  if (e.target.value) setIsPaid(true);
                }}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                data-testid="input-quick-payment-date"
              />
            </div>
          </div>
        </div>

        {/* Toggle Switch "Já está pago" (AC-227) */}
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={`w-5 h-5 transition-colors ${
                isPaid ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {type === 'incomings' ? 'Já está recebido' : 'Já está pago'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isPaid ? `Liquidado em ${formattedPaymentDateDisplay}` : 'Pendente de liquidação'}
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPaid}
            data-testid="toggle-quick-paid"
            onClick={() =>
              setIsPaid((prev) => {
                const next = !prev;
                if (next && !paymentDate) setPaymentDate(todayStr);
                return next;
              })
            }
            className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
              isPaid ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
          </button>
        </div>

        {/* Botão Confirmar Lançamento (Salvar) - Padding vertical ampliado (AC-227, AC-231) */}
        <button
          type="button"
          disabled={numericValue <= 0 || isSubmitting}
          onClick={handleSave}
          data-testid="btn-quick-entry-save"
          className="w-full min-h-14 py-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-1"
        >
          <Check className="w-5 h-5" />
          <span>{isSubmitting ? 'Salvando...' : 'Confirmar Lançamento (Salvar)'}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileQuickEntry;
