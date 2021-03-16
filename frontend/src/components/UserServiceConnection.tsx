import React, { useEffect, useState } from 'react'
import { Button, Stack, useToast, Alert, AlertIcon } from '@chakra-ui/react'
// import { useAuth } from '@/contexts/auth'
// import { useRouter } from 'next/router'
// import { useFirebase } from '@/libs/firebase/hook'
import { useMusic } from '@/libs/music/hook'
import { Platform } from '@/libs/music/music'
import { FaSpotify, FaApple } from 'react-icons/fa'

export const UserServiceConnection: React.FC = () => {
  // const router = useRouter()
  const music = useMusic()
  // const firebase = useFirebase()
  const toast = useToast()
  const [isConnectedSpotify, setIsConnectedSpotify] = useState(false)
  const [isConnectedApple, setIsConnectedApple] = useState(false)
  // const { currentUser, setCurrentUser } = useAuth()

  useEffect(() => {
    console.log('useEffect')
    setIsConnectedSpotify(music.isAuthorized('spotify'))
    setIsConnectedApple(music.isAuthorized('apple'))
  }, [music])

  const onAuthorize = () => async () => {
    try {
      // const userCredentials = await firebase.auth.signInAnonymously()
      // const userId = userCredentials.user?.uid || ''
      // // TODO: Fix this by pulling the entire user and only updating the name field
      // const nameSnapshot = await firebase.db.ref(`users/${userId}/name`).once('value')
      // const name = nameSnapshot.val() ?? ''
      // // updateUserInFirebase({ userId, name, platform })
      // dispatch(updateUserId(userId))
      // if (name === '') {
      //   router.push('/register')
      // } else {
      //   router.push('/')
      // }
    } catch (error) {
      console.error('Error authenticating. Code:', error.code, '. Message:', error.message)
    }
  }

  const signInWithMusic = (platform: Platform) => {
    music.platform = platform
    music
      .authorize()
      .then(() => {
        onAuthorize()
        setIsConnectedSpotify(true)
        toast({ title: `${platform}と連携しました。`, status: 'success' })
      })
      .catch((e) => {
        console.error(`Unable to log in with ${platform}: `, e)
        toast({ title: `${platform}との連携時にエラーが発生しました。`, status: 'error' })
      })
  }

  return (
    <>
      <Stack align="center" mt={4} spacing={8}>
        <Button
          bg="#84BD00"
          color="#fff"
          _hover={{ bg: 'rgba(132, 189, 0, 0.75)' }}
          leftIcon={<FaSpotify />}
          isFullWidth
          isDisabled={isConnectedSpotify}
          onClick={() => signInWithMusic('spotify')}
        >
          Spotify
          {isConnectedSpotify && <span>（連携済み）</span>}
        </Button>
        <Button
          bg="#000"
          color="#fff"
          _hover={{ bg: 'rgba(0, 0, 0, 0.75)' }}
          leftIcon={<FaApple />}
          isFullWidth
          isDisabled={isConnectedApple}
          onClick={() => signInWithMusic('apple')}
        >
          Apple Music
          {isConnectedApple && <span>（連携済み）</span>}
        </Button>
        <Alert status="info" textAlign="left">
          <AlertIcon />
          一定期間が経過した場合、再連携する必要があります。
        </Alert>
      </Stack>
    </>
  )
}
