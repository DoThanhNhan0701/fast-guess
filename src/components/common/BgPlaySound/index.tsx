import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

export default function BgPlaySound() {
  const [isPlay, setIsPlay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { mute } = useSelector((state: RootState) => state.app)

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

  console.log(mute)

  return (
    <audio
      muted={mute}
      loop
      autoPlay
      className="hidden"
      onPlay={() => setIsPlay(true)}
      ref={audioRef}
    >
      <source src="/sound/battle-sound.mp3" />
    </audio>
  )
}
