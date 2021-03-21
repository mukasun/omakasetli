import { useRef, useEffect, useState } from 'react'
import Music from '@/libs/music'

export const useMusicLoading = () => {
  const [musicLoading, setMusicLoading] = useState(true)
  const musicInstance = useRef(new Music())

  useEffect(() => {
    musicInstance.current.configure().then(() => {
      setMusicLoading(false)
    })
  }, [musicInstance])

  return { musicInstance: musicInstance.current, musicLoading }
}
