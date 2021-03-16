import { NextApiRequest } from 'next'

export type NextAPIRequestWithPagination = NextApiRequest & {
  query: {
    id?: string
    limit?: string
    offset?: string
  }
}
