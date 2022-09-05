import axios from "axios";

axios.defaults.baseURL = window.location.origin

export default function ({ token, ...apiParams}) {
  const api = axios.create({
    // baseURL: env.API_URL,
    baseURL: "http://192.168.42.105",
    timeout: 60000,
    ...apiParams
  });

  if (token) {
    api.interceptors.request.use((config) => {
      config.data = config.data ? { ...config.data, token } : { token }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  return api
}