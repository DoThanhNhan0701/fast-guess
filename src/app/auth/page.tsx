import { Suspense } from 'react'
import Auth from '~/components/pages/Auth'

export default function AuthPage() {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  )
}
