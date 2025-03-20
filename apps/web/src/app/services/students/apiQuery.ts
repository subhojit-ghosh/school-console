import { useMutation, useQuery } from '@tanstack/react-query';
import {
  enrolledStudent,
  getEnrolledStudents,
  getRegStudents,
  getStudentById,
  saveStudent,
  saveStudentPersonalInfo,
  updateStudentGuardianInfo,
} from '.';

export function useGetEnrolledStudents() {
  return useQuery({
    queryKey: ['enrolled-students'],
    queryFn: getEnrolledStudents,
    retry: 0,
  });
}

export function useGetStudents() {
  return useQuery({
    queryKey: ['reg-students'],
    queryFn: getRegStudents,
    retry: 0,
  });
}

export function useGetStudentById(id: string) {
  return useQuery({
    queryKey: ['get-student-by-id', id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
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

export function useUpdateStudentGuardianInfo() {
  return useMutation({
    mutationFn: updateStudentGuardianInfo,
  });
}

export function useEnrolledStudent() {
  return useMutation({
    mutationFn: enrolledStudent,
  });
}
