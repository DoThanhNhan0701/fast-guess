import { ReactNode, Suspense } from 'react'
import PrivateCmsLayout from '~/components/layout/PrivateCmsLayout'

export default function App({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <PrivateCmsLayout>{children}</PrivateCmsLayout>
    </Suspense>
  )
}
