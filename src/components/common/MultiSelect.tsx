import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  testId?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = 'Selecione...',
  options,
  selectedValues,
  onChange,
  testId,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleSelectAll = () => {
    const allFilteredValues = filteredOptions.map((opt) => opt.value);
    const newSelected = Array.from(new Set([...selectedValues, ...allFilteredValues]));
    onChange(newSelected);
  };

  const handleClear = () => {
    onChange([]);
  };

  const getButtonText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const match = options.find((opt) => opt.value === selectedValues[0]);
      return match ? match.label : '1 selecionado';
    }
    return `${selectedValues.length} selecionadas`;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} data-testid={testId}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Botão Gatilho */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-testid={testId ? `${testId}-trigger` : undefined}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 hover:bg-gray-50/50 dark:hover:bg-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate">{getButtonText()}</span>
          {selectedValues.length > 1 && (
            <span className="shrink-0 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Chips das opções selecionadas para fácil remoção */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            if (!opt) return null;
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-100 dark:border-blue-900/40"
              >
                <span className="truncate max-w-[140px]">{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(val);
                  }}
                  className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                  title={`Remover ${opt.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Painel Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          data-testid={testId ? `${testId}-dropdown` : undefined}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-2.5 space-y-2"
        >
          {/* Campo de Busca */}
          {options.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar opções..."
                autoFocus
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Barra de Ações Rápidas */}
          <div className="flex items-center justify-between text-[11px] pt-1 px-1 border-b border-gray-100 dark:border-slate-700 pb-1.5">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
            >
              Selecionar todas
            </button>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
              >
                Limpar seleção
              </button>
            )}
          </div>

          {/* Lista de Opções */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400 dark:text-slate-500">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleToggle(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100/70 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="truncate text-left">{opt.label}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
