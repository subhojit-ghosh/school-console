import { useQuery } from '@tanstack/react-query';
import { getAcadDropdown, getClasses, getStudentsByClassId } from '.';

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

export function useGetStudentsByClassIdDropwdown(classId: string) {
  return useQuery({
    queryKey: ['students-dropdown', classId],
    queryFn: () => getStudentsByClassId(classId),
    enabled: !!classId,
  });
}
