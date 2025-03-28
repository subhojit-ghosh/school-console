import { useMutation, useQuery } from '@tanstack/react-query';
import { getTrasnsactionReceiptById, saveTransactionFee } from '.';

export function useSaveTransactionFee() {
  return useMutation({
    mutationFn: saveTransactionFee,
  });
}

export function useGetTrasnsactionReceiptById() {
  return useMutation({
    mutationFn: getTrasnsactionReceiptById,
  });
}
