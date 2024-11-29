'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { endpointBase } from '~/services/endpoint'
import { getRequest } from '~/services/request'
import { REFRESH_TOKEN } from '~/settings/constants'
import { RootState } from '~/store'
import { actionLogout, actionUpdate } from '~/store/slice/auth'

import webStorageClient from '~/utils/webStorageClient'

export default function App({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const refreshToken = webStorageClient.get(REFRESH_TOKEN)

    if (!refreshToken) {
      router.replace('/auth')
    } else if (!userInfo?.id) {
      getMe()
    } else {
      setReady(true)
    }
  }, [router, userInfo, dispatch])

  const getMe = async () => {
    try {
      const response: any = await getRequest(endpointBase.GET_ME)
      dispatch(actionUpdate(response))
    } catch (error) {
      dispatch(actionLogout())
      router.replace('/auth')
    }
  }

  if (!ready) return null

  return children
}
