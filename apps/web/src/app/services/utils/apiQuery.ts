import { useQuery } from '@tanstack/react-query';
import { getClasses } from '.';

export function useGetClasses() {
  return useQuery({
    queryKey: ['class-list'],
    queryFn: getClasses,
  });
}
