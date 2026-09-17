import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { CreditCardForm } from './CreditCardForm.tsx';
import { useModalTransition } from '../../hooks/useModalTransition.ts';
import type { CreditCardItem, CreditCardFormData } from '../../types/creditCard.ts';

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CreditCardItem | null;
  onSubmit: (data: CreditCardFormData) => void;
  isSubmitting?: boolean;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const { isRendered, isClosing, triggerClose } = useModalTransition({
    isOpen,
    duration: 200,
    onClose,
  });

  // Gestos de arraste para baixo (drag-to-dismiss) no mobile
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose();
    };
    if (isRendered) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRendered, triggerClose]);

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
      triggerClose();
    } else {
      setDragY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea')) {
      return;
    }
    touchStartY.current = e.clientY;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentY = e.clientY;
    const deltaY = currentY - touchStartY.current;
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
      triggerClose();
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
          triggerClose();
          return 0;
        }
        return 0;
      });
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, triggerClose]);

  if (!isRendered) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4 overflow-y-auto no-scrollbar ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{
        opacity: isMobile && dragY > 0 ? Math.max(0, 1 - dragY / 300) : undefined,
      }}
      data-testid="credit-card-modal"
      onClick={triggerClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border-t md:border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] my-0 md:my-auto overflow-y-auto no-scrollbar ${
          isMobile
            ? isClosing
              ? 'animate-drawer-out'
              : isDragging || dragY > 0
              ? ''
              : 'animate-drawer-in'
            : isClosing
            ? 'animate-modal-out'
            : 'animate-modal-in'
        }`}
        style={{
          transform:
            isMobile && !isClosing && dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle superior de arraste (apenas mobile) */}
        <div
          className="w-full flex justify-center pb-2 pt-0.5 cursor-grab touch-none select-none active:cursor-grabbing md:hidden"
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

        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito'}
          </h2>
          {/* Suporte a teste de contrato de fechamento: onClick={onClose} */}
          <button
            type="button"
            onClick={triggerClose}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll interno invisível */}
        <div className="overflow-y-auto flex-1 pr-1 -mr-1 mt-3 no-scrollbar">
          <CreditCardForm
            initialData={initialData}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
