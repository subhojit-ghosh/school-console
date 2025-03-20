import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllStudents, saveStudent, saveStudentPersonalInfo } from '.';

export function useGetStudents() {
  return useQuery({
    queryKey: ['all-students'],
    queryFn: getAllStudents,
    retry: 0,
  });
}

export function useAddStudent() {
  return useMutation({
    mutationFn: saveStudent,
  });
}

export function useAddStudentPersonal() {
  return useMutation({
    mutationFn: saveStudentPersonalInfo,
  });
}
