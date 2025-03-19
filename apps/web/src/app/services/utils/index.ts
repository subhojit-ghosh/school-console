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
