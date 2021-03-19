import { FirestoreSimple } from '@firestore-simple/web'
import Firebase from '@/libs/firebase/firebase'

const firestoreSimple = new FirestoreSimple(Firebase.instance.db)

export type User = {
  id: string
  slug: string
  displayName: string
  thumbnail: string
  bio: string
  createdAt: Date
}

export type UserDoc = {
  slug: string
  display_name: string
  thumbnail: string
  bio: string
  created_at: Date
}

export const userCollection = firestoreSimple.collection<User, UserDoc>({
  path: 'users',
  encode: (user) => {
    return {
      slug: user.slug,
      display_name: user.displayName,
      thumbnail: user.thumbnail,
      bio: user.bio,
      created_at: user.createdAt,
    }
  },
  decode: (doc) => {
    return {
      id: doc.id,
      slug: doc.slug,
      displayName: doc.display_name,
      thumbnail: doc.thumbnail,
      bio: doc.bio,
      createdAt: doc.created_at.toDate(),
    }
  },
})

export const isUniqueSlug = async (slug: string) => {
  const users = await userCollection.where('slug', '==', slug).fetch()
  return users.length === 0
}
