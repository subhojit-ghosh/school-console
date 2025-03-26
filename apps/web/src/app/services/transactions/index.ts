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
