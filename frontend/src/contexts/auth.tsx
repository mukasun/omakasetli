import React, { useState, useEffect, useContext, createContext } from 'react'

import { User, userCollection } from '@/collections/users'
import { trackCollectionFactory } from '@/collections/users/tracks'
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
  setCurrentUser: React.Dispatch<React.SetStateAction<User>> | null
  setImportedTrackIds: React.Dispatch<React.SetStateAction<string[]>> | null
}>({
  currentUser: undefined,
  providerMetadata: null,
  importedTrackIds: [],
  setCurrentUser: null,
  setImportedTrackIds: null,
})

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [providerMetadata, setProviderMetadata] = useState<ProviderMetadata | null>(null)
  const [importedTrackIds, setImportedTrackIds] = useState<string[]>([])
  const router = useRouter()
  const firebase = useFirebase()

  useEffect(() => {
    firebase.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null)
      } else {
        const targetUser = await userCollection.fetch(user.uid)
        if (targetUser) {
          setCurrentUser(targetUser)
          const trackCollection = trackCollectionFactory.create(`users/${user.uid}/tracks`)
          trackCollection.fetchAll().then((tracks) => setImportedTrackIds(tracks.map((t) => t.id)))
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
        setCurrentUser,
        setImportedTrackIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
