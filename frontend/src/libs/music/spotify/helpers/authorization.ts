import { hex2bin } from './utils'
import { sha256 } from 'js-sha256'

/**
 * It looks a bit nicer to log the user in in a separate window
 */
export const openSpotifyLoginWindow = (codeVerifier: string) => {
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const response_type = 'code'
  const redirect_uri = encodeURIComponent(
    process.env.NEXT_PUBLIC_APP_BASE_URL + '/spotify_callback'
  )

  // I'm not sure why hex2bin, but I found it in the source here:
  // https://www.oauth.com/playground/authorization-code-with-pkce.html
  const hashedCodeVerifier = hex2bin(sha256(codeVerifier))
  const codeChallenge = btoa(hashedCodeVerifier)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  const codeChallengeMethod = 'S256'

  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
  ].join(' ')

  const spotify_auth_url =
    'https://accounts.spotify.com/authorize' +
    '?client_id=' +
    client_id +
    '&response_type=' +
    response_type +
    '&redirect_uri=' +
    redirect_uri +
    '&scope=' +
    encodeURIComponent(scopes) +
    '&code_challenge_method=' +
    codeChallengeMethod +
    '&code_challenge=' +
    codeChallenge

  return window.open(
    spotify_auth_url,
    '_blank',
    'location=yes,height=600,width=600,scrollbars=yes,status=yes'
  )
}

/**
 * The child window used for login gives us the auth token
 * @param childWindow
 */
export const getAuthTokenFromChildWindow = async (childWindow: Window | null) => {
  const spotifyData = {
    code: '',
  }

  // Set a function that can be called by the child window
  window.setSpotifyAuthToken = ({ code }: { code: string }) => {
    spotifyData.code = code
  }

  // Check if the child window has been closed every so often and resolve when it closes
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (childWindow?.closed) {
        clearInterval(interval)
        resolve()
      }
    }, 500)
  })

  return spotifyData
}
