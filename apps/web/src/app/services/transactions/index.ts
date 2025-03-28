import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

export async function saveTransactionFee(payload: any) {
  const { data } = await httpClient.post(
    endpoints.transactions.saveTransaction(),
    {
      ...payload,
    }
  );
  return data;
}

export async function getTrasnsactionReceiptById(payload: any) {
  const { data } = await httpClient.post(
    endpoints.transactions.receiptById(payload.id, payload.studentId),
    {},
    {
      responseType: 'blob',
    }
  );

  const pdfBlob = new Blob([data], { type: 'application/pdf' });
  const objectUrl = window.URL.createObjectURL(pdfBlob);
  window.open(objectUrl);
  // const anchor = document.createElement('a');
  // anchor.href = objectUrl;
  // anchor.download = `p.pdf`;
  // document.body.appendChild(anchor);
  // anchor.click();
  // anchor.remove();
  // window.URL.revokeObjectURL(objectUrl);
  return data;
}
