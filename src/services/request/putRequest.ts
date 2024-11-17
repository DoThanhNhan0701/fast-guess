import webStorageClient from '~/utils/webStorageClient'
import axiosInstance from '../base/axiosInstance'
import { message } from 'antd'
import { RequestOptionsInterface } from '~/models/services/requestOptions'

const updateRequest = (
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
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${tokenClient}`,
          'Content-Type': fomrData ? 'multipart/form-data' : 'application/json',
          // TODO
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

  return axiosInstance
    .put(url, data, {
      headers: {},
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
          message.error('Error')
        })
      }
      return Promise.reject(err)
    })
}

export { updateRequest }
