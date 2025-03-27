import { useQuery } from '@tanstack/react-query';
import { getAcadDropdown, getClasses } from '.';

export function useGetClasses() {
  return useQuery({
    queryKey: ['class-list'],
    queryFn: getClasses,
  });
}

export function useGetAcadDropdown() {
  return useQuery({
    queryKey: ['academic-dropdown'],
    queryFn: getAcadDropdown,
  });
}
