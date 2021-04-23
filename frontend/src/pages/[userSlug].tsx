import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SEOMeta } from '@/components/SEOMeta'
import { TrackCard } from '@/components/TrackCard'
import { User, userCollection } from '@/collections/users'
import { Track, trackCollectionFactory } from '@/collections/users/tracks'
import { Avatar, HStack, useToast, VStack, Text, Box, Button } from '@chakra-ui/react'
import { Container, SimpleGrid } from '@chakra-ui/react'

const TRACK_LIMIT = 24

const UserPage: NextPage = () => {
  const router = useRouter()
  const { userSlug } = router.query
  const [user, setUser] = useState<User | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [isEndTrack, setIsEndTrack] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!userSlug) return
    userCollection
      .where('slug', '==', userSlug)
      .fetch()
      .then((users) => {
        if (users.length !== 1) throw Error()
        setUser(users[0])
      })
      .catch((_) => {
        toast({ title: '対象のユーザーが見つかりません', status: 'error' })
        router.back()
      })
  }, [userSlug])

  useEffect(() => {
    if (!user) return
    const trackCollection = trackCollectionFactory.create(`users/${user.id}/tracks`)
    trackCollection
      .orderBy('name')
      .limit(TRACK_LIMIT)
      .fetch()
      .then((_tracks) => {
        setTracks(_tracks)
        if (_tracks.length < TRACK_LIMIT) {
          setIsEndTrack(true)
        }
      })
      .catch((e) => {
        console.log(e)
        toast({ title: '楽曲データの取得時にエラーが発生しました。', status: 'error' })
      })
  }, [user])

  const loadMoreTracks = () => {
    if (!user) return
    setIsLoading(true)
    const trackCollection = trackCollectionFactory.create(`users/${user.id}/tracks`)
    trackCollection
      .orderBy('name')
      .startAfter(tracks[tracks.length - 1].name)
      .limit(TRACK_LIMIT)
      .fetch()
      .then((_tracks) => {
        setTracks([...tracks, ..._tracks])
        if (_tracks.length < TRACK_LIMIT) {
          setIsEndTrack(true)
        }
      })
      .catch((e) => {
        console.log(e)
        toast({ title: '楽曲データの取得時にエラーが発生しました。', status: 'error' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <SEOMeta title={user?.displayName} path={`/${user?.slug}`} />
      <Container maxW="container.lg" p={4}>
        <HStack maxW="container.lg" mx="auto" mb={12} p={4} spacing={8}>
          <Avatar size="xl" name={user?.displayName} src={user?.thumbnail} />
          <VStack align="flex-start">
            <Box>
              <Text fontSize="lg" fontWeight={700}>
                {user?.displayName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                @{user?.slug}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm">{user?.bio}</Text>
            </Box>
          </VStack>
        </HStack>
        <SimpleGrid columns={[2, 4, 6]} spacing={10} mb={12}>
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </SimpleGrid>
        {!isEndTrack && (
          <HStack align="center" justifyContent="center" mb={12}>
            <Button size="lg" isLoading={isLoading} onClick={loadMoreTracks}>
              もっとみる
            </Button>
          </HStack>
        )}
      </Container>
    </>
  )
}

export default UserPage
