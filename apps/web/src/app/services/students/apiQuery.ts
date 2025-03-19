import { useMutation } from '@tanstack/react-query';
import { saveStudent } from '.';

export function useAddStudent() {
  return useMutation({
    mutationFn: saveStudent,
  });
}
