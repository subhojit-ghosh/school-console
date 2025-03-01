import axios from 'axios';
import { showErrorNotification } from '../utils/notification';

const httpClient = axios.create();

httpClient.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token');
  if (access_token) {
    config.headers = {
      ...(config.params || {}),
      Authorization: `Bearer ${access_token}`,
    };
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status == 401 || status == 498) {
        if (window.location.pathname != '/auth/login') {
          localStorage.removeItem('access_token');
          window.location.reload();
        }
      }
      showErrorNotification(data?.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
