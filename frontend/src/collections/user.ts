import { FirestoreSimple } from '@firestore-simple/web'
import { FirebaseClient } from '@/libs/FirebaseClient'

const firestoreSimple = new FirestoreSimple(FirebaseClient.instance.db)

export type User = {
  id: string
  slug: string
  displayName: string
  thumbnail: string
  bio: string
  created: Date
}

export type UserDoc = {
  slug: string
  display_name: string
  thumbnail: string
  bio: string
  created: Date
}

export const userCollection = firestoreSimple.collection<User, UserDoc>({
  path: 'users',
  encode: (user) => {
    return {
      slug: user.slug,
      display_name: user.displayName,
      thumbnail: user.thumbnail,
      bio: user.bio,
      created: user.created,
    }
  },

  decode: (doc) => {
    return {
      id: doc.id,
      slug: doc.slug,
      displayName: doc.display_name,
      thumbnail: doc.thumbnail,
      bio: doc.bio,
      created: doc.created.toDate(),
    }
  },
})

export const isUniqueSlug = async (slug: string) => {
  const users = await userCollection.where('slug', '==', slug).fetch()
  return users.length === 0
}
