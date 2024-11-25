'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import PrivateCmsLayout from '~/components/layout/PrivateCmsLayout'

export default function App({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Suspense>
      <PrivateCmsLayout>{children}</PrivateCmsLayout>
    </Suspense>
  )
}
