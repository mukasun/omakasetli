export type SpotifyTimeRange = 'long_term' | 'medium_term' | 'short_term'

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface SpotifyPaginatedResponse<ItemType> {
  items: ItemType[]
  total: number
  limit: number
  offset: number
  previous: null
  href: string
  next: null
}

export interface SpotifyCursorPaginatedResponse<ItemType> {
  items: ItemType[]
  cursors: SpotifyCursor
  href: string
  limit: number
  next: string
  total: number
}

export interface SpotifyRecentlyPlayed {
  context: SpotifyContext
  played_at: string
  track: SpotifyTrack
}

export interface SpotifyProfile {
  display_name: string
  email: string
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  images: SpotifyImage[]
  type: string
  uri: string
}

export interface SpotifyArtist {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: Type
  uri: string
}

export interface Followers {
  href: null
  total: number
}

export interface ExternalUrls {
  spotify: string
}

export interface SpotifyImage {
  height: number
  url: string
  width: number
}

export enum Type {
  Artist = 'artist',
}

export interface SpotifyTrack {
  album: SpotifyAlbum
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIDS
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface SpotifyAlbum {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ExternalIDS {
  isrc: string
}

export interface SpotifyContext {
  external_urls: ExternalUrls
  href: string
  type: string
  uri: string
}

export interface SpotifyCursor {
  before: string
  after: string
}

export interface SpotifyAudioFeatures {
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  type: string
  id: string
  uri: string
  track_href: string
  analysis_url: string
  duration_ms: number
  time_signature: number
  [key: string]: number | string
}

export interface PlaylistTrack {
  href: string
  total: number
  added_at: string
  added_by: SpotifyProfile
  is_local: boolean
  track: SpotifyTrack
}

export interface SpotifyPlaylist {
  collaborative: boolean
  external_urls: ExternalUrls
  id: string
  images: SpotifyImage[]
  name: string
  public: string
  snapshot_id: string
  tracks: SpotifyPaginatedResponse<PlaylistTrack>
  type: string
  uri: string
  description: string
  followers: Followers
}

export interface SpotifyNowPlayingResponse {
  timestamp: number
  context: SpotifyContext
  progress_ms: number
  item: SpotifyTrack
  currently_playing_type: string
  actions: Actions
  is_playing: boolean
}

export interface Actions {
  disallows: Disallows
}

export interface Disallows {
  resuming: boolean
}
