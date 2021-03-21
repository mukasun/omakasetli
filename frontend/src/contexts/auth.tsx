import React, { useState, useEffect, useContext, createContext } from 'react'

import { User, userCollection } from '@/collections/users'
import { trackCollectionFactory } from '@/collections/users/tracks'
import { memberCollectionGroup } from '@/collections/rooms/members'
import { useRouter } from 'next/router'
import { useFirebase } from '@/libs/firebase/hook'

type ProviderMetadata = {
  uid: string
  displayName: string
  photoUrl: string
}

const AuthContext = createContext<{
  currentUser: User | null | undefined
  providerMetadata: ProviderMetadata | null
  importedTrackIds: string[]
  joiningRoomId: string
  setCurrentUser: React.Dispatch<React.SetStateAction<User>> | null
  setImportedTrackIds: React.Dispatch<React.SetStateAction<string[]>> | null
  setJoiningRoomId: React.Dispatch<React.SetStateAction<string>> | null
}>({
  currentUser: undefined,
  providerMetadata: null,
  importedTrackIds: [],
  joiningRoomId: '',
  setCurrentUser: null,
  setImportedTrackIds: null,
  setJoiningRoomId: null,
})

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [providerMetadata, setProviderMetadata] = useState<ProviderMetadata | null>(null)
  const [importedTrackIds, setImportedTrackIds] = useState<string[]>([])
  const [joiningRoomId, setJoiningRoomId] = useState('')
  const router = useRouter()
  const firebase = useFirebase()

  useEffect(() => {
    firebase.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null)
      } else {
        const targetUser = await userCollection.fetch(user.uid)
        if (targetUser) {
          // ログイン中のユーザーデータ
          setCurrentUser(targetUser)
          const trackCollection = trackCollectionFactory.create(`users/${user.uid}/tracks`)
          // プレイリストに追加しているトラックIDs & 加入中のルームID
          const [tracks, joiningMe] = await Promise.all([
            trackCollection.fetchAll(),
            memberCollectionGroup.where('slug', '==', targetUser.slug).fetch(),
          ])
          setImportedTrackIds(tracks.map((t) => t.id))
          if (joiningMe.length > 0) {
            setJoiningRoomId(joiningMe[0].roomId)
          }
          console.log('fetch target userdata')
        } else {
          setCurrentUser(null)
          router.replace('/register')
        }
        setProviderMetadata({
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoURL,
        })
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        providerMetadata,
        importedTrackIds,
        joiningRoomId,
        setCurrentUser,
        setImportedTrackIds,
        setJoiningRoomId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
