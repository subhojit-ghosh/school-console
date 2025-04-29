export type AcademicFeesRecord = {
  uid?: string;
  index?: number;
  id?: number | null;
  academicYearId: string;
  classId: string;
  name: string;
  amount: number | null;
  dueDate: string | null;
  cname?: string;
};
