'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import PrivateClientLayout from '~/components/layout/PrivateClientLayout'

export default function App({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Suspense>
      <PrivateClientLayout>{children}</PrivateClientLayout>
    </Suspense>
  )
}
