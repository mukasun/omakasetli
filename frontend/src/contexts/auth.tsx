import React, { useState, useEffect, useContext, createContext } from 'react'
import { FirebaseClient } from '@/libs/FirebaseClient'
import { User, userCollection } from '@/collections/user'
import { useRouter } from 'next/router'

type ProviderMetadata = {
  uid: string
  displayName: string
  photoUrl: string
}

const AuthContext = createContext<{
  currentUser: User | null | undefined
  providerMetadata: ProviderMetadata | null
  setCurrentUser: React.Dispatch<React.SetStateAction<User>> | null
}>({
  currentUser: undefined,
  providerMetadata: null,
  setCurrentUser: null,
})

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [providerMetadata, setProviderMetadata] = useState<ProviderMetadata | null>(null)
  const router = useRouter()

  useEffect(() => {
    FirebaseClient.instance.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null)
      } else {
        const targetUser = await userCollection.fetch(user.uid)
        if (targetUser) {
          setCurrentUser(targetUser)
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
    <AuthContext.Provider value={{ currentUser, providerMetadata, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
