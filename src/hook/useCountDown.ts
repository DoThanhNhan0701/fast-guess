import { useEffect, useRef, useState } from 'react'

export const useCountDown = (
  start: number,
  delay = 1000,
  options?: {
    onFinish: () => void
  },
) => {
  const [time, setTime] = useState(start)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const allowRun = time > 0

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (time <= 0) {
      isRunningRef.current = false
      options?.onFinish()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [time])

  const startCountDown = () => {
    if (!isRunningRef.current && allowRun) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1)
      }, delay)
      isRunningRef.current = true
    }
  }

  const pauseCountDown = () => {
    if (isRunningRef.current) {
      isRunningRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }

  return {
    time,
    isRunning: isRunningRef.current,
    startCountDown,
    pauseCountDown,
    setTime,
  }
}
