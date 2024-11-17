import { message } from 'antd'
import webStorageClient from '~/utils/webStorageClient'
import axiosInstance from '../base/axiosInstance'
import { RequestOptionsInterface } from '~/models/services/requestOptions'

const postRequest = (
  url: string,
  options?: RequestOptionsInterface,
  fomrData?: boolean,
): Promise<object> => {
  const data = options?.data
  const tokenClient = webStorageClient.getToken()
  const enableFlashMessageSuccess = options?.enableFlashMessageSuccess || false
  const enableFlashMessageError = options?.enableFlashMessageError || true

  if (tokenClient) {
    return axiosInstance
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${tokenClient}`,
          'Content-Type': fomrData ? 'multipart/form-data' : 'application/json',
        },
        params: options?.params,
      })
      .then((res: any) => {
        if (enableFlashMessageSuccess && res?.message) {
          message.success(`Success`)
        }
        return res
      })
      .catch((err: any) => {
        if (enableFlashMessageError && err?.response?.data?.errors?.length > 0) {
          err?.response?.data?.errors?.forEach(() => {
            message.error('System error')
          })
        }
        return Promise.reject(err)
      })
  }

  return axiosInstance
    .post(url, data, {
      headers: {
        'Content-Type': fomrData ? fomrData : 'application/json',
      },
    })
    .then((res: any) => {
      if (enableFlashMessageSuccess && res?.message) {
        message.success('Success')
      }
      return res
    })
    .catch((err: any) => {
      if (enableFlashMessageError && err?.response?.data?.errors?.length > 0) {
        err?.response?.data?.errors?.forEach(() => {
          message.error('System error')
        })
      }
      return Promise.reject(err)
    })
}

export { postRequest }
