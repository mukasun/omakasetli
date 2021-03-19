import * as AppleMusic from './apple'
import * as Spotify from './spotify'
import { Playlist, SearchType, Song } from './types'

export type Platform = 'apple' | 'spotify'

const getLib = (platform: Platform) =>
  ({
    apple: AppleMusic,
    spotify: Spotify,
  }[platform])

class Music {
  platform: Platform
  apple: typeof AppleMusic
  spotify: typeof Spotify

  constructor(platform: Platform) {
    this.platform = platform
    this.apple = AppleMusic
    this.spotify = Spotify
  }

  async configure() {
    AppleMusic.configure()
    await Spotify.configure()
  }

  authorize(platform: Platform) {
    return getLib(platform).authorize()
  }

  isAuthorized(platform: Platform) {
    return getLib(platform).isAuthorized()
  }

  search(query: string, searchTypes: SearchType[]) {
    return getLib(this.platform).search(query, searchTypes)
  }

  queueAndPlay(song: Song) {
    return getLib(this.platform).queueAndPlay(song)
  }

  play() {
    return getLib(this.platform).play()
  }

  pause() {
    return getLib(this.platform).pause()
  }

  progressMilliseconds() {
    return getLib(this.platform).progressMilliseconds()
  }

  progress(callback: (progress: number) => void) {
    return getLib(this.platform).progress(callback)
  }

  seek(time: number) {
    return getLib(this.platform).seek(time)
  }

  songEnded(callback: VoidFunction) {
    return getLib(this.platform).songEnded(callback)
  }

  setVolume(percentage: number) {
    return getLib(this.platform).setVolume(percentage)
  }

  getPlaylists() {
    return getLib(this.platform).getPlaylists()
  }

  getSongsForPlaylist(playlist: Playlist) {
    return getLib(this.platform).getSongsForPlaylist(playlist)
  }
}

export default Music
