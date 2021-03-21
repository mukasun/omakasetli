import Firebase from '@/libs/firebase/firebase'
import { User, UserDoc } from '@/collections/users'

export type Member = User & { joinedAt: Date; roomId: string }

export type MemberDoc = UserDoc & { joined_at: Date; room_id: string }

export const memberCollectionFactory = Firebase.instance.db.collectionFactory<Member, MemberDoc>({
  encode: (member) => ({
    slug: member.slug,
    display_name: member.displayName,
    thumbnail: member.thumbnail,
    bio: member.bio,
    room_id: member.roomId,
    created_at: member.createdAt,
    joined_at: member.joinedAt,
  }),
  decode: (doc) => ({
    id: doc.id,
    slug: doc.slug,
    displayName: doc.display_name,
    thumbnail: doc.thumbnail,
    bio: doc.bio,
    roomId: doc.room_id,
    createdAt: doc.created_at.toDate(),
    joinedAt: doc.joined_at.toDate(),
  }),
})

export const memberCollectionGroup = Firebase.instance.db.collectionGroup<Member, MemberDoc>({
  collectionId: 'members',
  decode: (doc) => ({
    id: doc.id,
    slug: doc.slug,
    displayName: doc.display_name,
    thumbnail: doc.thumbnail,
    bio: doc.bio,
    roomId: doc.room_id,
    createdAt: doc.created_at.toDate(),
    joinedAt: doc.joined_at.toDate(),
  }),
})
