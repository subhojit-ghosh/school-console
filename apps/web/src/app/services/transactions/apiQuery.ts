import { useMutation, useQuery } from '@tanstack/react-query';
import { saveTransactionFee } from '.';

export function useSaveTransactionFee() {
  return useMutation({
    mutationFn: saveTransactionFee,
  });
}
