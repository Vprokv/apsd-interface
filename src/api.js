import axios from 'axios'

//development
// const API_URL = 'http://192.168.42.105/'

//stage
export const API_URL = 'http://10.20.56.47/'

//production
// export const API_URL = 'https://psd.moesk.ru'

//config for master branch
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
