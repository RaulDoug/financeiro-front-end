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

/**
 * Hook para gerenciar o ciclo de vida de renderização e animação de desmonte de modais e drawers.
 * Mantém o componente montado durante a execução da animação de saída (exit animation).
 */
export function useModalTransition({
  isOpen,
  duration = 200,
  onClose,
}: UseModalTransitionOptions): UseModalTransitionResult {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearTimer();
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered && !isClosing) {
      // Caso isOpen seja alterado externamente para false
      setIsClosing(true);
      clearTimer();
      timeoutRef.current = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, duration);
    }

    return clearTimer;
  }, [isOpen, duration, isRendered, isClosing]);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
      onClose?.();
    }, duration);
  }, [duration, isClosing, onClose]);

  return {
    isRendered,
    isClosing,
    triggerClose,
  };
}

export default useModalTransition;
