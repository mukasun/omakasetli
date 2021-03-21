import Firebase from '@/libs/firebase/firebase'

export type Room = {
  id: string
  name: string
  code: string
  owner: string
  createdAt: Date
}

export type RoomDoc = {
  name: string
  code: string
  owner: string
  created_at: Date
}

export const roomCollection = Firebase.instance.db.collection<Room, RoomDoc>({
  path: 'rooms',
  encode: (room) => ({
    name: room.name,
    code: room.code,
    owner: room.owner,
    created_at: room.createdAt,
  }),

  decode: (doc) => ({
    id: doc.id,
    name: doc.name,
    code: doc.code,
    owner: doc.owner,
    createdAt: doc.created_at.toDate(),
  }),
})
