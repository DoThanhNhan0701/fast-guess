import axiosInstance from '../base/axiosInstance'
import { message } from 'antd'
import { RequestOptionsInterface } from '~/models/services/requestOptions'
import webStorageClient from '~/utils/webStorageClient'

const deleteRequest = (url: string, options?: RequestOptionsInterface): Promise<object> => {
  const data = options?.data
  const tokenClient = webStorageClient.getToken()
  const enableFlashMessageSuccess = options?.enableFlashMessageSuccess || false
  const enableFlashMessageError = options?.enableFlashMessageError || true

  return axiosInstance
    .delete(url, {
      data,
      headers: {
        Authorization: `Bearer ${tokenClient}`,
      },
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

export { deleteRequest }
