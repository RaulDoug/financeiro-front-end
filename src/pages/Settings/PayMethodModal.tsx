import React, { useEffect, useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fullPayMethodSchema } from '../../schemas/settingsSchemas.ts';
import { useWalletStore } from '../../stores/wallet.store.ts';
import { bankAccountService, type BankAccountItem } from '../../services/bankAccount.service.ts';
import type { PayMethodItem, CreatePayMethodDTO } from '../../services/payMethod.service.ts';
import { IconPicker } from '../../components/shared/IconPicker.tsx';

interface PayMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePayMethodDTO) => Promise<void>;
  payMethod?: PayMethodItem | null;
  isLoading?: boolean;
}

export const PayMethodModal: React.FC<PayMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  payMethod,
  isLoading = false,
}) => {
  const currentWalletId = useWalletStore((state) => state.currentWalletId);

  const [name, setName] = useState('');
  const [isCreditCard, setIsCreditCard] = useState(false);
  const [type, setType] = useState('pix');
  const [bankAccountId, setBankAccountId] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState('#3b82f6');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(payMethod);

  const { data: accountsData = [] } = useQuery({
    queryKey: ['bank-accounts', currentWalletId],
    queryFn: async () => {
      const res = await bankAccountService.getBankAccounts();
      return Array.isArray(res) ? res : res?.item ? [res.item] : [];
    },
    enabled: Boolean(currentWalletId),
  });

  useEffect(() => {
    if (payMethod) {
      setName(payMethod.name);
      setIsCreditCard(Boolean(payMethod.credit_card));
      setBankAccountId(payMethod.bank_account_id || '');
      setDueDay(payMethod.due_day ? String(payMethod.due_day) : '');
      setClosingDay(payMethod.closing_day ? String(payMethod.closing_day) : '');
      setLastFourDigits(payMethod.last_four_digits || '');
      setCreditLimit(payMethod.credit_limit ? String(payMethod.credit_limit) : '');
      setIcon(payMethod.icon || 'wallet');
      setColor(payMethod.color || '#3b82f6');
    } else {
      setName('');
      setIsCreditCard(false);
      setType('pix');
      setBankAccountId(accountsData[0]?.id || '');
      setDueDay('');
      setClosingDay('');
      setLastFourDigits('');
      setCreditLimit('');
      setIcon('wallet');
      setColor('#3b82f6');
    }
    setErrors({});
  }, [payMethod, isOpen, accountsData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawData = {
      name: name.trim(),
      credit_card: isCreditCard,
      type: isCreditCard ? undefined : type,
      bank_account_id: bankAccountId,
      due_day: isCreditCard && dueDay ? parseInt(dueDay, 10) : undefined,
      closing_day: isCreditCard && closingDay ? parseInt(closingDay, 10) : undefined,
      last_four_digits: isCreditCard ? lastFourDigits.trim() : undefined,
      credit_limit: isCreditCard && creditLimit ? parseFloat(creditLimit) : undefined,
      icon: isCreditCard ? undefined : icon,
      color: isCreditCard ? undefined : color,
    };

    const result = fullPayMethodSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const submissionData: CreatePayMethodDTO = {
      name: rawData.name,
      credit_card: rawData.credit_card,
      bank_account_id: rawData.bank_account_id || undefined,
      due_day: rawData.due_day,
      closing_day: rawData.closing_day,
      last_four_digits: rawData.last_four_digits,
      credit_limit: rawData.credit_limit,
      icon: isCreditCard ? (icon || 'credit-card') : icon,
      color: color || '#3b82f6',
    };

    try {
      await onSubmit(submissionData);
      onClose();
    } catch {
      // error handled by parent
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg flex flex-col max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-4" data-testid="pay-method-form">
          {/* Nome do Método */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Método *
            </label>
            <input
              type="text"
              value={name}
              data-testid="pay-method-name-input"
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pix, Dinheiro, Cartão Visa..."
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.name ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
              } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Opção É um cartão de crédito - Bloqueada em edição (AC-112) */}
          <div className="pt-1">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                isEditing
                  ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-90'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">
                      É um cartão de crédito?
                    </span>
                    {isEditing && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" aria-label="Bloqueado para edição" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? 'O tipo de cartão não pode ser alterado após a criação.'
                      : 'Habilita controle de faturas, limite e fechamento.'}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isCreditCard}
                disabled={isEditing}
                data-testid="pay-method-credit-card-toggle"
                onChange={(e) => setIsCreditCard(e.target.checked)}
                aria-label="É um cartão de crédito?"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              />
            </div>
          </div>

          {/* Campos para Métodos Normais (não cartão de crédito - AC-155) */}
          {!isCreditCard && (
            <div className="space-y-3 pt-2" data-testid="standard-pay-method-fields">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo do Método *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  data-testid="pay-method-type-select"
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    errors.type ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                  } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                >
                  <option value="pix">Pix</option>
                  <option value="money">Dinheiro em Espécie</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="bank_transfer">Transferência Bancária (TED/DOC)</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="other">Outro</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-xs text-rose-500">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conta Bancária Vinculada *
                </label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  data-testid="pay-method-bank-account-select"
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    errors.bank_account_id ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                  } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                >
                  <option value="">Selecione uma conta bancária</option>
                  {accountsData.map((acc: BankAccountItem) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name}
                    </option>
                  ))}
                </select>
                {errors.bank_account_id && (
                  <p className="mt-1 text-xs text-rose-500">{errors.bank_account_id}</p>
                )}
              </div>

              <div>
                <IconPicker
                  selectedIcon={icon}
                  selectedColor={color}
                  onSelectIcon={setIcon}
                  onSelectColor={setColor}
                />
              </div>
            </div>
          )}

          {/* Campos Dinâmicos de Cartão de Crédito (AC-154) */}
          {isCreditCard && (
            <div className="space-y-3 pt-2" data-testid="credit-card-dynamic-fields">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conta Bancária Vinculada *
                </label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  data-testid="credit-card-bank-account-select"
                  className={`w-full px-3.5 py-2.5 bg-white border ${
                    errors.bank_account_id ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                  } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                >
                  <option value="">Selecione uma conta bancária</option>
                  {accountsData.map((acc: BankAccountItem) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name}
                    </option>
                  ))}
                </select>
                {errors.bank_account_id && (
                  <p className="mt-1 text-xs text-rose-500">{errors.bank_account_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Limite de Crédito (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={creditLimit}
                    data-testid="credit-card-limit-input"
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="Ex: 5000,00"
                    className={`w-full px-3.5 py-2 bg-white border ${
                      errors.credit_limit ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                    } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                  />
                  {errors.credit_limit && (
                    <p className="mt-1 text-xs text-rose-500">{errors.credit_limit}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    4 Últimos Dígitos *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={lastFourDigits}
                    data-testid="credit-card-digits-input"
                    onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ex: 1234"
                    className={`w-full px-3.5 py-2 bg-white border ${
                      errors.last_four_digits ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                    } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                  />
                  {errors.last_four_digits && (
                    <p className="mt-1 text-xs text-rose-500">{errors.last_four_digits}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dia de Fechamento (1–31) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={closingDay}
                    data-testid="credit-card-closing-day-input"
                    onChange={(e) => setClosingDay(e.target.value)}
                    placeholder="Ex: 5"
                    className={`w-full px-3.5 py-2 bg-white border ${
                      errors.closing_day ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                    } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                  />
                  {errors.closing_day && (
                    <p className="mt-1 text-xs text-rose-500">{errors.closing_day}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dia de Vencimento (1–31) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    data-testid="credit-card-due-day-input"
                    onChange={(e) => setDueDay(e.target.value)}
                    placeholder="Ex: 15"
                    className={`w-full px-3.5 py-2 bg-white border ${
                      errors.due_day ? 'border-rose-500 ring-rose-200' : 'border-slate-300'
                    } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors`}
                  />
                  {errors.due_day && (
                    <p className="mt-1 text-xs text-rose-500">{errors.due_day}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              data-testid="btn-save-pay-method"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Método'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

