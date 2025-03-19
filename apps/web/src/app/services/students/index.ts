import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function saveStudent(payload: any) {
  const { data } = await httpClient.post(endpoints.students.create(), {
    ...payload,
  });
  console.log('debug-data', data);
  return data;
}
