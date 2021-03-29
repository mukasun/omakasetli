import { SetlistDoc } from '@/collections/rooms/setlists'

export type Methods = {
  post: {
    reqHeaders: {
      'Content-Type': string
    }
    reqBody: {
      room_id: string
      time_limit: number
      c_weight?: number
      timeout?: number
      num_unit_step?: number
    }
    resBody: SetlistDoc
  }
}
