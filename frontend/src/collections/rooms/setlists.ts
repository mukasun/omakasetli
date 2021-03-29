import Firebase from '@/libs/firebase/firebase'

export type Setlist = {
  id: string
  scoreAvg: number
  scoreSum: number
  scoreVar: number
  scores: number[]
  totalTime: number
  tracks: {
    id: string
    duration_ms: number
    artist: string
    name: string
    preview_url: string
    small_image: string
    p: number[]
  }[]
}

export type SetlistDoc = {
  score_avg: number
  score_sum: number
  score_var: number
  scores: number[]
  total_time: number
  tracks: {
    id: string
    duration_ms: number
    artist: string
    name: string
    preview_url: string
    small_image: string
    p: number[]
  }[]
}

export const setlistCollectionFactory = Firebase.instance.db.collectionFactory<Setlist, SetlistDoc>(
  {
    encode: (setlist) => ({
      score_avg: setlist.scoreAvg,
      score_var: setlist.scoreVar,
      score_sum: setlist.scoreSum,
      scores: setlist.scores,
      total_time: setlist.totalTime,
      tracks: setlist.tracks,
    }),
    decode: (doc) => ({
      id: doc.id,
      scoreAvg: doc.score_avg,
      scoreSum: doc.score_sum,
      scoreVar: doc.score_var,
      scores: doc.scores,
      totalTime: doc.total_time,
      tracks: doc.tracks,
    }),
  }
)
