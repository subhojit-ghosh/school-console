import axios from 'axios';
import { showErrorNotification } from '../utils/notification';

const httpClient = axios.create({
  withCredentials: true,
});

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
      if (status === 401) {
        if (window.location.pathname != '/auth/login') {
          // window.location.reload();
        }
      }

      if (status !== 401) {
        showErrorNotification(data?.message);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
