import axiosInstance from '../base/axiosInstance'
import { message } from 'antd'
import { RequestOptionsInterface } from '~/models/services/requestOptions'
import { ACCESS_TOKEN } from '~/settings/constants'
import webStorageClient from '~/utils/webStorageClient'
import { getCookiesByKey } from '~/utils/webStorageServer'

const getRequest = <T = object>(url: string, options?: RequestOptionsInterface): Promise<T> => {
  const params = options?.params
  const context = options?.context
  const enableFlashMessageSuccess = options?.enableFlashMessageSuccess || false
  const enableFlashMessageError = options?.enableFlashMessageError || true

  const tokenClient = webStorageClient.getToken()
  const tokenServer = getCookiesByKey(context, ACCESS_TOKEN)

  if (tokenServer || tokenClient) {
    return axiosInstance
      .get(url, {
        params: params,
        headers: {
          Authorization: `Bearer ${tokenServer || tokenClient}`,
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
            message.error(`System error`)
          })
        }
        return Promise.reject(err)
      })
  }

  return axiosInstance
    .get(url, {
      params: params,
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
          message.error('System error')
        })
      }
      return Promise.reject(err)
    })
}

export { getRequest }
