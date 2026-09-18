import { useState, useEffect, useCallback, useRef } from 'react';

interface UseModalTransitionOptions {
  isOpen: boolean;
  duration?: number;
  onClose?: () => void;
}

export interface UseModalTransitionResult {
  isRendered: boolean;
  isClosing: boolean;
  triggerClose: () => void;
}

let activeModalsCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Hook para gerenciar o ciclo de vida de renderização, animação de desmonte e bloqueio de rolagem
 * de fundo de modais e gavetas (AC-271, AC-296).
 */
export function useModalTransition({
  isOpen,
  duration = 200,
  onClose,
}: UseModalTransitionOptions): UseModalTransitionResult {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpenRef = useRef(isOpen);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (!wasOpen && isOpen) {
      // Abertura recente (passou de false para true)
      clearTimer();
      setIsRendered(true);
      setIsClosing(false);
    } else if (wasOpen && !isOpen) {
      // Fechamento disparado externamente (mudança de prop isOpen de true para false)
      clearTimer();
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, duration);
    }
  }, [isOpen, duration, clearTimer]);

  const triggerClose = useCallback(() => {
    clearTimer();
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
      onCloseRef.current?.();
    }, duration);
  }, [duration, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Bloqueio de rolagem do body enquanto o modal estiver aberto no desktop/mobile (AC-296)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (isRendered) {
      if (activeModalsCount === 0) {
        originalOverflow = document.body.style.overflow;
        originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.overflow = 'hidden';
      }
      activeModalsCount++;

      return () => {
        activeModalsCount = Math.max(0, activeModalsCount - 1);
        if (activeModalsCount === 0) {
          document.body.style.overflow = originalOverflow;
          document.body.style.paddingRight = originalPaddingRight;
        }
      };
    }
  }, [isRendered]);

  return {
    isRendered,
    isClosing,
    triggerClose,
  };
}

export default useModalTransition;
