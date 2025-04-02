import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getTransportFeeDropdownItemsByStudentAcadId,
  getTransportFeeItemById,
  getTransportListByAcadId,
  getTransportSettingByAcadId,
  saveTransportFee,
  saveTrasnportSetting,
} from '.';

export function useSaveTransportSetting() {
  return useMutation({
    mutationFn: saveTrasnportSetting,
  });
}

export function useGetTransportSettingByAcadId(acadId: string) {
  return useQuery({
    queryFn: () => getTransportSettingByAcadId(acadId),
    queryKey: ['transport-setting-by-acad-id', acadId],
    enabled: !!acadId,
  });
}

export function useSaveTransportFee() {
  return useMutation({
    mutationFn: saveTransportFee,
  });
}

export function useGetTransportFeeDropdownItemsByStudentAcadId(
  academicYearId: string,
  studentId: string
) {
  return useQuery({
    queryFn: () =>
      getTransportFeeDropdownItemsByStudentAcadId(academicYearId, studentId),
    queryKey: [
      'transport-fee-item-by-student-acad-id',
      academicYearId,
      studentId,
    ],
    enabled: !!academicYearId && !!studentId,
  });
}

export function useGetTransportListByAcadId(academicYearId: string) {
  return useQuery({
    queryFn: () => getTransportListByAcadId(academicYearId),
    queryKey: ['transport-list-by-acad-id', academicYearId],
    enabled: !!academicYearId,
  });
}

export function useGetTransportFeeItemById(id: string) {
  return useQuery({
    queryFn: () => getTransportFeeItemById(id),
    queryKey: ['transport-fee-item-by-id', id],
    enabled: !!id,
  });
}
