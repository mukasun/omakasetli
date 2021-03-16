import { Song } from '@/libs/music/types'

type ScriptAttributes = {
  async?: boolean
  defer?: boolean
  id?: string
  source: string
}

export const loadScript = (attributes: ScriptAttributes): Promise<void> => {
  if (!attributes || !attributes.source) {
    throw new Error('Invalid attributes')
  }

  return new Promise((resolve, reject) => {
    const { async, defer, id, source }: ScriptAttributes = {
      async: false,
      defer: false,
      id: '',
      ...attributes,
    }

    const scriptTag = document.getElementById(id)

    if (!scriptTag) {
      const script = document.createElement('script')

      script.id = id
      script.type = 'text/javascript'
      script.async = async
      script.defer = defer
      script.src = source
      script.onload = () => resolve(undefined)
      script.onerror = (error: any) => reject(`createScript: ${error.message}`)

      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
}

/**
 * From http://locutus.io/php/hex2bin/
 * */
export const hex2bin = (s: string) => {
  const ret = []
  let i = 0
  let l

  s += ''

  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16)
    const k = parseInt(s.substr(i + 1, 1), 16)
    if (isNaN(c) || isNaN(k)) return ''
    ret.push((c << 4) | k)
  }

  // eslint-disable-next-line prefer-spread
  return String.fromCharCode.apply(String, ret)
}

export const json2UrlEncoded = (obj: { [key: string]: string }) =>
  Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
    .join('&')

/**
 * Retry a function with a timeout. Inspired by
 * https://stackoverflow.com/questions/59854115/how-to-retry-api-calls-using-node-fetch
 * @param func Function to be called
 * @param timeout Reject promise if timeout is reached
 * @param retries Number of times to retry the function. Default: 3
 * @param retryDelay Time between each retry. Default: 1000 milliseconds
 */
export const retryableFunc = (
  func: () => Promise<any>,
  timeout: number,
  retries = 3,
  retryDelay = 1000
): Promise<any> => {
  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })

  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject('error: timeout')
      }, timeout)
    }

    const wrapper = (n: number) => {
      func()
        .then((res) => {
          resolve(res)
        })
        .catch(async (err) => {
          if (n > 0) {
            await delay(retryDelay)
            wrapper(--n)
          } else {
            reject(err)
          }
        })
    }

    wrapper(retries)
  })
}

export const transformSongs = (songs: any): Song[] => {
  const formatArtists = (song: any, delimiter: string): string =>
    song.artists
      .reduce((acc: string, curr: any) => acc + curr.name + delimiter, '')
      .slice(0, -delimiter.length)

  return songs.map((song: any) => ({
    album: song.album.name,
    artist: formatArtists(song, ', '),
    name: song.name,
    isrc: song.external_ids.isrc,
    url: song.uri,
    smallImage: song.album.images[2].url,
    mediumImage: song.album.images[1].url,
  }))
}
