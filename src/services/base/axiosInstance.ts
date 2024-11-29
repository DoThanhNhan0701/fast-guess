import axios from 'axios'

import { API_SERVER, REFRESH_TOKEN } from '~/settings/constants'
import webStorageClient from '~/utils/webStorageClient'

const axiosInstance = axios.create({
  baseURL: API_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 600000,
})

axiosInstance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response?.data
  },
  (error: any) => {
    const { config, response } = error
    const originalRequest = config

    if (
      response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('auth/refresh')
    ) {
      originalRequest._retry = true

      const tokenRefresh = webStorageClient.get(REFRESH_TOKEN)

      return axiosInstance
        .post('/api/auth/token/refresh/', { refresh: tokenRefresh })
        .then((res: any) => {
          // Update the token in the headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res?.access}`
          originalRequest.headers['Authorization'] = `Bearer ${res?.access}`
          webStorageClient.setToken(res?.access)
          // Repeat the original request with the updated headers
          return axiosInstance(originalRequest)
        })
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
