import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function getClasses() {
  const { data } = await httpClient.get(endpoints.classes.dropdown());
  return data.data.map((rec: any) => ({
    ...rec,
    value: String(rec.id),
    label: rec.name,
  }));
}

export async function getAcadDropdown() {
  const { data } = await httpClient.get(endpoints.academicYears.dropdown());
  return data.data.map((rec: any) => ({
    ...rec,
    value: String(rec.id),
    label: rec.name,
  }));
}

export async function getStudentsByClassId(classId: string) {
  const { data } = await httpClient.get(endpoints.students.list(), {
    params: {
      size: 9999,
      classId: classId,
    },
  });
  return data.data.map((item: any) => ({
    label: `${item.name} (${item.isEnrolled ? item.enrolledNo : item.regId})`,
    value: String(item.id),
  }));
}

export async function getTransportTakenStudentsByClassId(classId: string) {
  const { data } = await httpClient.get(endpoints.students.list(), {
    params: {
      size: 9999,
      classId: classId,
      isTransportTaken: 1,
    },
  });
  return data.data.map((item: any) => ({
    label: `${item.name} (${item.isEnrolled ? item.enrolledNo : item.regId})`,
    value: String(item.id),
  }));
}
