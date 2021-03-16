import React from 'react'
import { Button, Stack, useToast } from '@chakra-ui/react'
// import { useAuth } from '@/contexts/auth'
// import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
// import { useFirebase } from '@/libs/firebase/hook'
import { useMusic } from '@/libs/music/hook'
import { Platform } from '@/libs/music/music'
import { updateMusicPlatform } from '@/store/actions'
import { FaSpotify, FaApple } from 'react-icons/fa'

export const UserServiceConnection: React.FC = () => {
  // const router = useRouter()
  const music = useMusic()
  // const firebase = useFirebase()
  const dispatch = useDispatch()
  const toast = useToast()
  // const { currentUser, setCurrentUser } = useAuth()

  const onAuthorize = (platform: Platform) => async () => {
    dispatch(updateMusicPlatform(platform))
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
        onAuthorize(platform)
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
          isFullWidth
          _hover={{ bg: 'rgba(132, 189, 0, 0.75)' }}
          leftIcon={<FaSpotify />}
          onClick={() => signInWithMusic('spotify')}
        >
          Spotify
        </Button>
        <Button
          bg="#000"
          isFullWidth
          _hover={{ bg: 'rgba(0, 0, 0, 0.75)' }}
          color="#fff"
          leftIcon={<FaApple />}
          onClick={() => signInWithMusic('apple')}
        >
          Apple Music
        </Button>
      </Stack>
    </>
  )
}
