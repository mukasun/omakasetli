export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {}
  keys.forEach((key) => {
    ret[key] = obj[key]
  })

  return ret
}

export const isBadStatusCode = (res: Response) => res.status === 204 || res.status > 400

export const millisToMinutesAndSeconds = (millis: number) => {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds
}

export const orgRound = (value: number, base: number) => {
  return Math.round(value * base) / base
}

export const genRamdomNumberCode = (digits: number) => {
  const CODE_TABLE = '0123456789'
  let r = ''
  for (let i = 0, k = CODE_TABLE.length; i < digits; i++) {
    r += CODE_TABLE.charAt(Math.floor(k * Math.random()))
  }
  return r
}
