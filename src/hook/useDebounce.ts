import { useEffect, useState } from 'react'

export default function useDebounce<T>(initValue: T, delay = 700) {
  const [value, setValue] = useState(initValue)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setValue(initValue)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }
  }, [initValue])

  return value
}
