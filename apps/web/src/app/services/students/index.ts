import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function getEnrolledStudents() {
  const { data } = await httpClient.get(endpoints.students.list(), {
    params: {
      page: 1,
      size: 10,
      isEnrolled: true,
    },
  });
  return data;
}

export async function getRegStudents() {
  const { data } = await httpClient.get(endpoints.students.list(), {
    params: {
      page: 1,
      size: 10,
      isEnrolled: false,
    },
  });
  return data;
}

export async function getStudentById(id: string) {
  const { data } = await httpClient.get(endpoints.students.findById(id));
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
    endpoints.students.createPersonalInfo(),
    {
      ...payload,
    }
  );
  return data;
}

export async function updateStudentGuardianInfo(payload: any) {
  const { data } = await httpClient.put(
    endpoints.students.updatePersonalInfoById(payload.id),
    {
      ...payload,
    }
  );
  return data;
}

export async function enrolledStudent(payload: any) {
  const { data } = await httpClient.put(
    endpoints.students.enrolled(payload.id)
  );
  return data;
}

export async function updateStudentDocuments(payload: any) {
  const { data } = await httpClient.post(
    endpoints.students.updateDocumentsById(payload.id),
    payload.formData
  );
  return data;
}

export async function deleteStudentDocumentById(payload: any) {
  const { data } = await httpClient.post(
    endpoints.students.deleteDocument(payload.id),
    {
      ...payload,
    }
  );
  return data;
}
