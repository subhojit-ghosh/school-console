import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function saveTrasnportSetting(payload: any) {
  const { data } = await httpClient.post(
    endpoints.transports.saveSettings(payload.id || null),
    {
      ...payload,
    }
  );
  return data;
}

export async function getTransportSettingByAcadId(id: string) {
  const { data } = await httpClient.get(
    endpoints.transports.getSettingsByAcadId(id)
  );

  return data;
}

export async function saveTransportFee(payload: any) {
  const { data } = await httpClient.post(
    endpoints.transports.saveTransportFee(),
    {
      ...payload,
    }
  );
  return data;
}

export async function getTransportFeeDropdownItemsByStudentAcadId(
  academicYearId: string,
  studentId: string
) {
  const { data } = await httpClient.get(
    endpoints.transports.getFeeDropDownItemByStudentAcadId(
      academicYearId,
      studentId
    )
  );

  return data;
}

export async function getTransportListByAcadId(academicYearId: string) {
  const { data } = await httpClient.get(
    endpoints.transports.getListByAcadId(academicYearId)
  );

  return data;
}

export async function getTransportFeeItemById(id: string) {
  const { data } = await httpClient.get(
    endpoints.transports.getTransportItemById(id)
  );

  return data;
}

export async function getTrasnsportReceiptById(payload: any) {
  const { data } = await httpClient.post(
    endpoints.transports.receiptById(payload.id),
    {},
    {
      responseType: 'blob',
    }
  );

  const pdfBlob = new Blob([data], { type: 'application/pdf' });
  const objectUrl = window.URL.createObjectURL(pdfBlob);
  return objectUrl;
}
