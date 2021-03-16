import { Playlist, SearchType, Song } from '../types'
import { PLAYLIST_LIMIT, SEARCH_LIMIT } from '../constants'
import { supportedAppleMusicSearchTypes, transformPlaylists, transformSongs } from './helpers'

export const configure = () => {
  console.log(process.env.NEXT_PUBLIC_APPLE_DEV_TOKEN)
  MusicKit.configure({
    developerToken: process.env.NEXT_PUBLIC_APPLE_DEV_TOKEN,
    app: {
      name: 'omakasetli',
      build: '1',
    },
  })
}

export const authorize = (): Promise<string> => {
  return MusicKit.getInstance().authorize()
}

export const isAuthorized = (): boolean => {
  return MusicKit.getInstance().isAuthorized
}

export const search = async (query: string, searchTypes: SearchType[]): Promise<Song[]> => {
  if (!query) return []

  const supportedSearchTypes = supportedAppleMusicSearchTypes(searchTypes)

  const response = await MusicKit.getInstance().api.search(query, {
    types: supportedSearchTypes.join(),
    limit: SEARCH_LIMIT,
    offset: 0,
  })

  if (response.songs === undefined)
    return Promise.reject('Apple Music search was unable to find the song. Query: ' + query)

  return transformSongs(response.songs.data)
}

const findSongByIsrc = async (song: Song): Promise<Song> => {
  let results

  try {
    results = await MusicKit.getInstance().api.songs([], {
      filter: { isrc: song.isrc },
    })
  } catch (error) {
    return Promise.reject(
      `Apple Music could not find song: ${song.name} by ISRC: ${song.isrc}. Error: ${error}`
    )
  }

  const transformedResults = transformSongs(results)
  return transformedResults[0]
}

export const queueAndPlay = async (song: Song): Promise<any> => {
  const APPLE_MUSIC_BASE_URL = 'https://music.apple.com'
  let appleMusicSong = song

  try {
    if (!appleMusicSong.url.includes(APPLE_MUSIC_BASE_URL)) {
      appleMusicSong = await findSongByIsrc(song)
    }
  } catch (error) {
    console.warn('Apple music ISRC search failed. Falling back to manual search', error)
  }

  // If ISRC search failed, try to find the song with manual search
  try {
    if (!appleMusicSong.url.includes(APPLE_MUSIC_BASE_URL)) {
      const songNameWithoutBrackets = song.name.split('(', 1)[0].trim()
      const songName = songNameWithoutBrackets.replace(/[^a-z]/gi, ' ')
      const songArtist = song.artist.replace(/[^a-z]/gi, ' ')
      const query = `${songName} ${songArtist}`

      const searchResults = await search(query, ['track'])
      if (!searchResults.length) {
        throw new Error('Manual search failed')
      }

      appleMusicSong = searchResults[0]
    }
  } catch (error) {
    return Promise.reject(error)
  }

  await MusicKit.getInstance().setQueue({ url: appleMusicSong.url })

  return MusicKit.getInstance().play()
}

export const play = async (): Promise<any> => {
  await MusicKit.getInstance().play()
}

export const pause = (): Promise<any> => {
  return MusicKit.getInstance().pause()
}

export const progressMilliseconds = (): Promise<number> => {
  const progressInSeconds = MusicKit.getInstance().player.currentPlaybackTime

  return Promise.resolve(Math.floor(progressInSeconds * 1000))
}

export const progress = (callback: (progress: number) => void): VoidFunction => {
  MusicKit.getInstance().addEventListener(
    'playbackProgressDidChange',
    ({ progress }: { progress: number }) => {
      callback(progress)
    }
  )

  return () => MusicKit.getInstance().removeEventListener('playbackProgressDidChange', callback)
}

export const seek = (time: number): Promise<any> => {
  return MusicKit.getInstance().seekToTime(time / 1000)
}

export const songEnded = (callback: VoidFunction): VoidFunction => {
  let previousProgress = 0

  MusicKit.getInstance().addEventListener(
    'playbackProgressDidChange',
    ({ progress }: { progress: number }) => {
      if (progress < previousProgress || progress === 1) {
        previousProgress = 0
        callback()
      } else {
        previousProgress = progress
      }
    }
  )

  return () => MusicKit.getInstance().removeEventListener('playbackProgressDidChange', callback)
}

export const setVolume = (percentage: number): Promise<void> => {
  const volume = Math.abs(percentage / 100)
  MusicKit.getInstance().player.volume = volume
  return Promise.resolve()
}

export const getPlaylists = async (): Promise<Playlist[]> => {
  const playlistsResponse = await fetch(
    `https://api.music.apple.com/v1/me/library/playlists?limit=${PLAYLIST_LIMIT}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_DEV_TOKEN}`,
        'Music-User-Token': MusicKit.getInstance().musicUserToken,
      },
    }
  )

  const playlists = await playlistsResponse.json()
  return transformPlaylists(playlists.data)
}

export const getSongsForPlaylist = async (playlist: Playlist): Promise<Song[]> => {
  const playlistWithSongsResponse = await fetch(
    `https://api.music.apple.com${playlist.id}?include=tracks`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_DEV_TOKEN}`,
        'Music-User-Token': MusicKit.getInstance().musicUserToken,
      },
    }
  )
  const playlistWithSongs = await playlistWithSongsResponse.json()

  // We only request one song, so get the first from data
  const trackIds: string[] = playlistWithSongs.data[0].relationships.tracks.data.map(
    (track: any) => track.attributes.playParams.catalogId
  )

  // Apple has a limit on how many tracks can be requested at a go.
  // TODO: Need to do this multiple times for long playlists
  if (trackIds.length > 300) {
    trackIds.splice(300, trackIds.length)
  }

  const trackIdsList = trackIds.join(',')

  const playlistSongsResponse = await fetch(
    `https://api.music.apple.com/v1/catalog/ca/songs?ids=${trackIdsList}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_DEV_TOKEN}`,
        'Music-User-Token': MusicKit.getInstance().musicUserToken,
      },
    }
  )
  const responseJson = await playlistSongsResponse.json()

  return transformSongs(responseJson.data)
}
