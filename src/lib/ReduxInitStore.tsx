'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { USER_INFO } from '~/settings/constants'
import { actionUpdate } from '~/store/slice/auth'

import webStorageClient from '~/utils/webStorageClient'

export default function ReduxInitStore() {
  const dispatch = useDispatch()
  useEffect(() => {
    const data = webStorageClient.get(USER_INFO)

    dispatch(actionUpdate(data))
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])
  return null
}
