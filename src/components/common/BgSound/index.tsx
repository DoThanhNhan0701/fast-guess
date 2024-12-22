'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function BgSound() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const pathname = usePathname()

  useEffect(() => {
    const handlePlay = () => {
      if (playing) return

      if (pathname.includes('play-one-')) return

      audioRef.current?.play()
    }

    window.addEventListener('click', handlePlay)

    return () => {
      window.removeEventListener('click', handlePlay)
    }
  }, [playing, pathname])

  useEffect(() => {
    if (pathname.includes('play-one-')) {
      if (!audioRef.current?.paused) audioRef.current?.pause()
    } else if (audioRef.current?.paused) audioRef.current.play()
  }, [pathname])

  return (
    <audio
      loop
      autoPlay
      controls
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      ref={audioRef}
      className="hidden"
    >
      <source src="/sound/home-sound.mp3" />
    </audio>
  )
}
