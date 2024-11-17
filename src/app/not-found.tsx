'use client'

import { useRouter } from 'next/navigation'
import Button from '~/components/common/Button'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="p-5 flex items-center justify-center flex-col gap-5 h-full">
      <p className="text-2xl font-semibold">Not found</p>
      <Button onClick={() => router.replace('/')}>Home</Button>
    </div>
  )
}
