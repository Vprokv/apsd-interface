import axios from 'axios'

// export const API_URL = 'http://10.20.56.47/'
export const API_URL = 'http://10.20.56.50/'
// export const API_URL = 'http://192.168.42.105/'
// export const API_URL =
//   process.env.NODE_ENV !== 'production'
//     ? process.env.REACT_APP_API_BASE_URL || 'http://192.168.42.105/'
//     : window.location.origin

axios.defaults.baseURL = API_URL

export default function ({ token, ...apiParams }) {
  const api = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    ...apiParams,
  })

  if (token) {
    api.interceptors.request.use(
      (config) => {
        config.data = config.data ? { ...config.data, token } : { token }
        return config
      },
      function (error) {
        return Promise.reject(error)
      },
    )
  }

  return api
}
