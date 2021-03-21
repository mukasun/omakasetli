import React, { useEffect, useState } from 'react'
import { Button, Stack, useToast, Alert, AlertIcon } from '@chakra-ui/react'
import { useMusic } from '@/libs/music/hook'
import { Platform } from '@/libs/music/music'
import { FaSpotify, FaApple } from 'react-icons/fa'

export const UserServiceConnection: React.FC = () => {
  const music = useMusic()
  const toast = useToast()
  const [isConnectedSpotify, setIsConnectedSpotify] = useState(false)
  const [isConnectedApple, setIsConnectedApple] = useState(false)

  useEffect(() => {
    setIsConnectedSpotify(music.isAuthorized('spotify'))
    setIsConnectedApple(music.isAuthorized('apple'))
  }, [music])

  const signInWithMusic = (platform: Platform) => {
    music
      .authorize(platform)
      .then(() => {
        if (platform === 'spotify') {
          setIsConnectedSpotify(true)
        } else {
          setIsConnectedApple(true)
        }
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
