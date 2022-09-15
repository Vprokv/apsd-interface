import axios from "axios";

const API_URL = process.env.NODE_ENV !== "production" 
  ? process.env.REACT_APP_API_BASE_URL
  : window.location.origin

axios.defaults.baseURL = API_URL

export default function ({ token, ...apiParams}) {
  const api = axios.create({
    baseURL: API_URL,
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