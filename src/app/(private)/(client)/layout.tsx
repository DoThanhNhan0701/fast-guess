'use client'

import { ReactNode, Suspense, useLayoutEffect, useState } from 'react'
import PrivateClientLayout from '~/components/layout/PrivateClientLayout'
import { accessToken, domainSocket } from '~/helper/contant'
import { useWebSocket } from '~/hook/useWebSocket'

export default function App({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  const wsUrl = `ws://${new URL(domainSocket ?? '').host}/ws/game/roomName/?token=${accessToken}`
  const { isConnected } = useWebSocket(wsUrl)

  if (isConnected) {
    console.log('Websocket connect')
  } else {
    console.log('Websocket disconnected')
  }

  if (!isClient) return null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrivateClientLayout>{children}</PrivateClientLayout>
    </Suspense>
  )
}
