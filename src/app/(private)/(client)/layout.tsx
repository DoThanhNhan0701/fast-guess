'use client'

import { ReactNode, Suspense } from 'react'
import PrivateClientLayout from '~/components/layout/PrivateClientLayout'

export default function App({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <PrivateClientLayout>{children}</PrivateClientLayout>
    </Suspense>
  )
}
