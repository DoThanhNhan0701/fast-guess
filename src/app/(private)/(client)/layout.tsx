'use client'

import { ReactNode, Suspense, useLayoutEffect, useState } from 'react'
import BgSound from '~/components/common/BgSound'
import PrivateClientLayout from '~/components/layout/PrivateClientLayout'

export default function App({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrivateClientLayout>{children}</PrivateClientLayout>
      <BgSound />
    </Suspense>
  )
}
