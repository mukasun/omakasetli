import Firebase from '@/libs/firebase/firebase'
import { Platform } from '@/libs/music/music'

export type Track = {
  id: string
  album: string
  artist: string
  name: string
  isrc: string
  url: string
  previewUrl: string
  smallImage: string
  mediumImage: string
  priority: number
  durationMs: number
  releaseYear: number
  platform: Platform
}

export type TrackDoc = {
  album: string
  artist: string
  name: string
  isrc: string
  url: string
  preview_url: string
  small_image: string
  medium_image: string
  priority: number
  duration_ms: number
  release_year: number
  platform: Platform
}

export const trackCollectionFactory = Firebase.instance.db.collectionFactory<Track, TrackDoc>({
  encode: (track) => {
    return {
      album: track.album,
      artist: track.artist,
      name: track.name,
      isrc: track.isrc,
      url: track.url,
      preview_url: track.previewUrl,
      small_image: track.smallImage,
      medium_image: track.mediumImage,
      priority: track.priority,
      duration_ms: track.durationMs,
      release_year: track.releaseYear,
      platform: track.platform,
    }
  },
  decode: (doc) => {
    return {
      id: doc.id,
      album: doc.album,
      artist: doc.artist,
      name: doc.name,
      isrc: doc.isrc,
      url: doc.url,
      previewUrl: doc.preview_url,
      smallImage: doc.small_image,
      mediumImage: doc.medium_image,
      priority: doc.priority,
      durationMs: doc.duration_ms,
      releaseYear: doc.release_year,
      platform: doc.platform,
    }
  },
})
