import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Plane,
  Film,
  Dumbbell,
  Smartphone,
  Wrench,
  Gift,
  Coffee,
  DollarSign,
  Briefcase,
  Landmark,
  CreditCard,
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  Tv,
  Bus,
  ShoppingCart,
  Fuel,
  PawPrint,
  Shield,
  Smile,
  type LucideIcon,
} from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  icon: LucideIcon;
  category?: string;
}

export const ICON_LIBRARY: IconOption[] = [
  { name: 'shopping-bag', label: 'Compras', icon: ShoppingBag },
  { name: 'shopping-cart', label: 'Supermercado', icon: ShoppingCart },
  { name: 'utensils', label: 'Alimentação', icon: Utensils },
  { name: 'coffee', label: 'Café & Lanches', icon: Coffee },
  { name: 'car', label: 'Transporte / Carro', icon: Car },
  { name: 'bus', label: 'Transporte Público', icon: Bus },
  { name: 'fuel', label: 'Combustível', icon: Fuel },
  { name: 'home', label: 'Moradia / Casa', icon: Home },
  { name: 'zap', label: 'Energia / Utilidades', icon: Zap },
  { name: 'heart-pulse', label: 'Saúde', icon: HeartPulse },
  { name: 'graduation-cap', label: 'Educação', icon: GraduationCap },
  { name: 'plane', label: 'Viagem', icon: Plane },
  { name: 'film', label: 'Lazer & Cinema', icon: Film },
  { name: 'tv', label: 'Assinaturas / Streaming', icon: Tv },
  { name: 'dumbbell', label: 'Academia & Esporte', icon: Dumbbell },
  { name: 'smartphone', label: 'Telefonia / Celular', icon: Smartphone },
  { name: 'wrench', label: 'Serviços & Manutenção', icon: Wrench },
  { name: 'gift', label: 'Presentes & Doações', icon: Gift },
  { name: 'paw-print', label: 'Pets', icon: PawPrint },
  { name: 'shield', label: 'Seguros', icon: Shield },
  { name: 'dollar-sign', label: 'Dinheiro / Renda', icon: DollarSign },
  { name: 'briefcase', label: 'Salário & Trabalho', icon: Briefcase },
  { name: 'trending-up', label: 'Investimentos', icon: TrendingUp },
  { name: 'piggy-bank', label: 'Poupança', icon: PiggyBank },
  { name: 'landmark', label: 'Banco / Conta', icon: Landmark },
  { name: 'credit-card', label: 'Cartão de Crédito', icon: CreditCard },
  { name: 'wallet', label: 'Carteira', icon: Wallet },
  { name: 'receipt', label: 'Boletos / Contas', icon: Receipt },
  { name: 'smile', label: 'Outros', icon: Smile },
];

export const COLOR_PALETTE = [
  { id: '#3b82f6', label: 'Azul', bgClass: 'bg-blue-500' },
  { id: '#10b981', label: 'Verde', bgClass: 'bg-emerald-500' },
  { id: '#ef4444', label: 'Vermelho', bgClass: 'bg-rose-500' },
  { id: '#f59e0b', label: 'Âmbar', bgClass: 'bg-amber-500' },
  { id: '#8b5cf6', label: 'Roxo', bgClass: 'bg-purple-500' },
  { id: '#ec4899', label: 'Rosa', bgClass: 'bg-pink-500' },
  { id: '#06b6d4', label: 'Ciano', bgClass: 'bg-cyan-500' },
  { id: '#64748b', label: 'Cinza', bgClass: 'bg-slate-500' },
];

interface IconPickerProps {
  selectedIcon?: string | null;
  selectedColor?: string | null;
  onSelectIcon: (iconName: string) => void;
  onSelectColor?: (colorHex: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  selectedColor,
  onSelectIcon,
  onSelectColor,
}) => {
  const [search, setSearch] = useState('');

  const filteredIcons = ICON_LIBRARY.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3" data-testid="icon-picker-component">
      {/* Seletor de Cores */}
      {onSelectColor && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Cor do Ícone
          </label>
          <div className="flex flex-wrap gap-2" data-testid="color-picker-palette">
            {COLOR_PALETTE.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  data-testid={`color-btn-${c.id}`}
                  onClick={() => onSelectColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bgClass} flex items-center justify-center transition-transform cursor-pointer ${
                    isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Busca de Ícones */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Ícone Selecionado
        </label>
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="icon-picker-search"
            placeholder="Buscar ícone (ex: comida, carro, mercado)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Grade de Ícones */}
        <div
          className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700"
          data-testid="icon-grid"
        >
          {filteredIcons.map((item) => {
            const IconComp = item.icon;
            const isSelected = selectedIcon === item.name;

            return (
              <button
                key={item.name}
                type="button"
                data-testid={`icon-btn-${item.name}`}
                onClick={() => onSelectIcon(item.name)}
                title={item.label}
                className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 shadow-2xs'
                }`}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export function renderLucideIcon(iconName?: string | null, className = 'w-4 h-4') {
  if (!iconName) return null;
  const match = ICON_LIBRARY.find((i) => i.name === iconName);
  if (!match) return null;
  const IconComp = match.icon;
  return <IconComp className={className} />;
}

export default IconPicker;

