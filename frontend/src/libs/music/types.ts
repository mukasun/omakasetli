import { Platform } from './music'

export type SearchType = 'album' | 'artist' | 'playlist' | 'track'

export type Song = {
  album: string
  artist: string
  name: string
  isrc: string
  url: string
  smallImage: string
  mediumImage: string
  durationMs: number
  releaseYear: number
  previewUrl: string
  platform: Platform
}

export type Playlist = {
  id: string
  name: string
  description: string
  image: string
  platform: Platform
}
