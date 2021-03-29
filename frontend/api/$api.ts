/* eslint-disable */
import { AspidaClient } from 'aspida'
import { Methods as Methods0 } from './setlist_solver'

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined
    ? 'https://asia-northeast1-omakasetli.cloudfunctions.net'
    : baseURL
  ).replace(/\/$/, '')
  const PATH0 = '/setlist_solver'
  const POST = 'POST'

  return {
    setlist_solver: {
      post: (option: { body: Methods0['post']['reqBody']; config?: T }) =>
        fetch<Methods0['post']['resBody']>(prefix, PATH0, POST, option).json(),
      $post: (option: { body: Methods0['post']['reqBody']; config?: T }) =>
        fetch<Methods0['post']['resBody']>(prefix, PATH0, POST, option)
          .json()
          .then((r) => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
  }
}

export type ApiInstance = ReturnType<typeof api>
export default api
