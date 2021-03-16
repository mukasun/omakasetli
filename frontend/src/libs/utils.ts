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
