export type SearchType = 'album' | 'artist' | 'playlist' | 'track'

export type Song = {
  album: string
  artist: string
  name: string
  isrc: string
  url: string
  smallImage: string
  mediumImage: string
}

export type Playlist = {
  id: string
  name: string
  description: string
  image: string
}