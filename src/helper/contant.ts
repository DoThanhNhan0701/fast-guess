import { ACCESS_TOKEN } from '~/settings/constants'
import webStorageClient from '~/utils/webStorageClient'

export const domainSocket = process.env.NEXT_PUBLIC_SERVER_API
export const accessToken = webStorageClient.get(ACCESS_TOKEN)
