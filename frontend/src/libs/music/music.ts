import * as AppleMusic from './apple'
import * as Spotify from './spotify'

export type Platform = 'apple' | 'spotify'

const getLib = (platform: Platform) =>
  ({
    apple: AppleMusic,
    spotify: Spotify,
  }[platform])

class Music {
  apple: typeof AppleMusic
  spotify: typeof Spotify

  constructor() {
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
}

export default Music
