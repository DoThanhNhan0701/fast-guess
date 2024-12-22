import { useEffect, useRef, useState } from 'react'

export default function BgPlaySound() {
  const [isPlay, setIsPlay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    audioRef.current && (audioRef.current.volume = 0.5)
    const handlePlay = () => {
      if (!isPlay) {
        audioRef.current?.play()
      }
    }
    window.addEventListener('click', handlePlay)

    return () => {
      window.removeEventListener('click', handlePlay)
    }
  }, [isPlay])

  return (
    <audio loop autoPlay className="hidden" onPlay={() => setIsPlay(true)} ref={audioRef}>
      <source src="/sound/battle-sound.mp3" />
    </audio>
  )
}
