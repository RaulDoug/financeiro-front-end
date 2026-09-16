import React from 'react';
import { useTransactionModalStore } from '../../stores/transactionModal.store.ts';
import { useTransactionMutations } from '../../hooks/useTransactionMutations.ts';
import { TransactionModal } from './TransactionModal.tsx';

export const GlobalTransactionModal: React.FC = () => {
  const { isOpen, defaultType, initialData, closeModal } = useTransactionModalStore();
  const { createMutation, updateMutation } = useTransactionMutations();

  if (!isOpen) return null;

  const handleSubmit = async (data: any) => {
    if (initialData?.id) {
      await updateMutation.mutateAsync({
        id: initialData.id,
        payload: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    closeModal();
  };

  return (
    <TransactionModal
      isOpen={isOpen}
      onClose={closeModal}
      initialType={defaultType}
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
    />
  );
};

export default GlobalTransactionModal;

