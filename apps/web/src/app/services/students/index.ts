import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function getAllStudents() {
  const { data } = await httpClient.get(
    endpoints.students.list('page=1&size=10')
  );
  return data;
}

export async function saveStudent(payload: any) {
  const { data } = await httpClient.post(endpoints.students.create(), {
    ...payload,
  });
  console.log('debug-data', data);
  return data;
}

export async function saveStudentPersonalInfo(payload: any) {
  const { data } = await httpClient.post(
    endpoints.students.createPerosnalInfo(),
    {
      ...payload,
    }
  );
  return data;
}
