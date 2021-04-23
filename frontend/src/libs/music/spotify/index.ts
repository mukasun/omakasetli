import SpotifyWebApi from 'spotify-web-api-js'
import cryptoRandomString from 'crypto-random-string'
import { Playlist, SearchType, Song } from '../types'
import { PLAYLIST_LIMIT, PLAYLIST_PLACEHOLDER_IMAGE, SEARCH_LIMIT } from '../constants'
import {
  getPlayerOptions,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  transformSongs,
  json2UrlEncoded,
} from './helpers'

let spotifyWebApi: SpotifyWebApi.SpotifyWebApiJs

export const configure = async () => {
  spotifyWebApi = new SpotifyWebApi()
  // await loadSpotifyWebPlayer()

  const authTokenExpirationTime = parseInt(localStorage.getItem('spotifyAuthExpirationTime') || '')
  const isExpired = authTokenExpirationTime <= Date.now()
  const isRefreshable = !!localStorage.getItem('spotifyRefreshToken')

  // authorized
  if (isExpired && isRefreshable) {
    await refreshAuth()
  }

  const authToken = localStorage.getItem('spotifyAuthToken') || ''

  if (authToken) {
    spotifyWebApi.setAccessToken(authToken)
    // await initializePlayer(authToken)
  }
}

const parseSessionData = async (
  response: Response
): Promise<{
  authToken: string
  expiresIn: number
  refreshToken: string
}> => {
  const {
    access_token: authToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  } = await response.json()

  if (!authToken) throw new Error('No auth token')

  spotifyWebApi.setAccessToken(authToken)

  // Persist auth in local storage
  localStorage.setItem('spotifyAuthToken', authToken)
  localStorage.setItem('spotifyRefreshToken', refreshToken)
  localStorage.setItem('spotifyAuthExpirationTime', `${Date.now() + expiresIn * 1000}`)

  return { authToken, refreshToken, expiresIn }
}

export const authorize = async (): Promise<void> => {
  const codeVerifier = cryptoRandomString({ length: 100 })
  const childWindow = openSpotifyLoginWindow(codeVerifier)

  const { code } = await getAuthTokenFromChildWindow(childWindow)

  const fetchBody = json2UrlEncoded({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.NEXT_PUBLIC_APP_BASE_URL + '/spotify_callback',
    code_verifier: codeVerifier,
  })

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fetchBody,
  })

  const { expiresIn } = await parseSessionData(response)
  // await initializePlayer(authToken)

  // Refresh 10 seconds before expiry
  setTimeout(refreshAuth, (expiresIn - 10) * 1000)
}

const refreshAuth = async () => {
  const fetchBody = json2UrlEncoded({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    grant_type: 'refresh_token',
    refresh_token: localStorage.getItem('spotifyRefreshToken') || '',
  })

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fetchBody,
  })

  const { expiresIn } = await parseSessionData(response)
  // await initializePlayer(authToken)

  // Refresh 10 seconds before expiry
  setTimeout(refreshAuth, (expiresIn - 10) * 1000)
}

export const isAuthorized = (): boolean => {
  const authTokenExpirationTime = parseInt(localStorage.getItem('spotifyAuthExpirationTime') || '')
  return spotifyWebApi.getAccessToken() !== '' && authTokenExpirationTime > Date.now()
}

export const search = async (query: string, searchTypes: SearchType[]): Promise<Playlist[]> => {
  if (!query) return []
  const response = await spotifyWebApi.search(query, searchTypes, {
    limit: SEARCH_LIMIT,
  })
  const transformedPlaylists: Playlist[] = response.playlists?.items.map(
    (playlist): Playlist => ({
      id: playlist.uri.substring('spotify:playlist:'.length),
      name: playlist.name,
      description: playlist.description || '',
      image: playlist.images[0] !== undefined ? playlist.images[0].url : PLAYLIST_PLACEHOLDER_IMAGE,
      platform: 'spotify',
    })
  )
  return transformedPlaylists
}

// const findSongByIsrc = async (song: Song): Promise<Song> => {
//   const response = await spotifyWebApi.searchTracks(`isrc:${song.isrc}`)

//   if (!response.tracks.items.length) {
//     return Promise.reject(`Spotify could not find song: ${song.name}. ISRC: ${song.isrc}`)
//   }

//   const transformedResults = transformSongs(response.tracks.items)
//   return transformedResults[0]
// }

// export const queueAndPlay = async (song: Song): Promise<any> => {
//   const { playerId } = getPlayerOptions()
//   const SPOTIFY_BASE_URL = 'spotify'

//   let spotifySong = song

//   try {
//     if (!spotifySong.url.includes(SPOTIFY_BASE_URL)) {
//       spotifySong = await findSongByIsrc(song)
//     }
//   } catch (error) {
//     console.warn('Spotify search failed. Falling back to manual search', error)
//   }

//   // If ISRC search failed, try to find the song with manual search
//   try {
//     if (!spotifySong.url.includes(SPOTIFY_BASE_URL)) {
//       const songNameWithoutBrackets = song.name.split('(', 1)[0].trim()
//       const songName = songNameWithoutBrackets.replace(/[^a-z]/gi, ' ')
//       const songArtist = song.artist.replace(/[^a-z]/gi, ' ')
//       const query = `${songName} ${songArtist}`

//       const searchResults = await search(query, ['track'])

//       if (!searchResults.length) {
//         throw new Error('Manual search failed')
//       }

//       spotifySong = searchResults[0]
//     }
//   } catch (error) {
//     return Promise.reject(error)
//   }

//   // Playing sometimes fails if we just defined the player.
//   // Keep trying to queue up the song if it fails
//   return retryableFunc(
//     () =>
//       spotifyWebApi.play({
//         device_id: playerId,
//         uris: [spotifySong.url],
//       }),
//     5000
//   )
// }

export const play = async (): Promise<any> => {
  const { playerId } = getPlayerOptions()
  const state = await window.spotifyPlayer.getCurrentState()

  // Playing when already playing results in a 403
  if (state === null || state.paused === false) return Promise.resolve()

  return spotifyWebApi.play({
    device_id: playerId,
  })
}

export const pause = async (): Promise<any> => {
  const { playerId } = getPlayerOptions()
  const state = await window.spotifyPlayer.getCurrentState()

  if (state === null || state.paused === true) return Promise.resolve()

  return spotifyWebApi.pause({
    device_id: playerId,
  })
}

export const progressMilliseconds = async (): Promise<number> => {
  const response = await spotifyWebApi.getMyCurrentPlaybackState()

  return response.progress_ms || 0
}

export const progress = (callback: (progress: number) => void): VoidFunction => {
  const refreshProgress = setInterval(
    () =>
      window.spotifyPlayer
        .getCurrentState()
        .then((args: { position: number; duration: number } | null) => {
          const { position, duration } = args || { position: 0, duration: 1 }
          callback(position / duration)
        }),
    1000
  )

  return () => clearInterval(refreshProgress)
}

export const seek = (time: number): Promise<any> => {
  const { playerId } = getPlayerOptions()

  return spotifyWebApi.seek(time, {
    device_id: playerId,
  })
}

export const songEnded = (callback: VoidFunction): VoidFunction => {
  let previousPosition = 0

  window.spotifyPlayer.addListener('player_state_changed', ({ position }: { position: number }) => {
    if (position < previousPosition) {
      previousPosition = 0
      callback()
    } else {
      previousPosition = position
    }
  })

  return () => window.spotifyPlayer.removeListener('player_state_changed', callback)
}

export const setVolume = (percentage: number): Promise<void> => {
  const volume = Math.abs(percentage / 100)
  return window.spotifyPlayer.setVolume(volume)
}

export const getPlaylists = async (): Promise<Playlist[]> => {
  const playlists = await spotifyWebApi.getUserPlaylists(undefined, {
    limit: PLAYLIST_LIMIT,
  })

  const transformedPlaylists: Playlist[] = playlists.items.map(
    (playlist): Playlist => ({
      id: playlist.uri.substring('spotify:playlist:'.length),
      name: playlist.name,
      description: playlist.description || '',
      image: playlist.images[0] !== undefined ? playlist.images[0].url : PLAYLIST_PLACEHOLDER_IMAGE,
      platform: 'spotify',
    })
  )

  return transformedPlaylists
}

export const getSongsForPlaylist = async (playlist: Playlist): Promise<Song[]> => {
  const playlistTrackResponse = await spotifyWebApi.getPlaylistTracks(playlist.id)
  const tracks = playlistTrackResponse.items.map((item) => item.track)

  return transformSongs(tracks)
}
