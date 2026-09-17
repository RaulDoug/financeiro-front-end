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

  return {
    isRendered,
    isClosing,
    triggerClose,
  };
}

export default useModalTransition;
