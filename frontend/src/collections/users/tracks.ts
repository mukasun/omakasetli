import { FirestoreSimple } from '@firestore-simple/web'
import Firebase from '@/libs/firebase/firebase'

const firestoreSimple = new FirestoreSimple(Firebase.instance.db)

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
}

export const trackCollection = firestoreSimple.collectionFactory<Track, TrackDoc>({
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
    }
  },
})
