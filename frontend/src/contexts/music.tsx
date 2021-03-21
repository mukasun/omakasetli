import React from 'react'
import { MusicContext } from '@/libs/music'
import { useMusicLoading } from '@/hooks/useMusicLoading'

type MusicProviderProps = {
  children: React.ReactNode
}

// This allows us to provide a loading state while Music is initializing
export const MusicProvider = ({ children }: MusicProviderProps) => {
  const { musicInstance, musicLoading } = useMusicLoading()

  return musicLoading ? (
    <></>
  ) : (
    <MusicContext.Provider value={musicInstance}>{children}</MusicContext.Provider>
  )
}
