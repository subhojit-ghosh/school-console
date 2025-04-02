import { useQuery } from '@tanstack/react-query';
import {
  getAcadDropdown,
  getClasses,
  getStudentsByClassId,
  getTransportTakenStudentsByClassId,
} from '.';

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

export function useGetTransportTakenStudentsByClassIdDropwdown(
  classId: string
) {
  return useQuery({
    queryKey: ['students-dropdown', classId],
    queryFn: () => getTransportTakenStudentsByClassId(classId),
    enabled: !!classId,
  });
}
