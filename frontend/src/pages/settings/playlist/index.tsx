import { NextPage } from 'next'
import { useEffect, useState, useMemo, useCallback } from 'react'
import NextLink from 'next/link'
import { SEOMeta } from '@/components/SEOMeta'
import { TracksTable } from '@/components/TracksTable'
import { TrackActionDialog } from '@/components/TrackActionDialog'
import { useRequireUser } from '@/hooks/useRequireUser'
import { useAuth } from '@/contexts/auth'
import { Container, Heading, Flex, Spacer, Box, useToast, IconButton } from '@chakra-ui/react'
import { Track, trackCollectionFactory } from '@/collections/users/tracks'
import { MdAdd } from 'react-icons/md'

const PlayListPage: NextPage = () => {
  useRequireUser()

  const { currentUser } = useAuth()
  const toast = useToast()
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [trackAction, setTrackAction] = useState<'edit' | 'delete'>('edit')
  const [actionTargetTrack, setActionTargetTrack] = useState<Track | null>(null)

  const trackCollection = useMemo(() => {
    if (currentUser) {
      return trackCollectionFactory.create(`users/${currentUser.id}/tracks`)
    } else {
      return null
    }
  }, [currentUser])

  useEffect(() => {
    if (!trackCollection) return
    trackCollection
      .fetchAll()
      .then((tracks) => setTracks(tracks))
      .catch((e) => {
        console.log(e)
        toast({ title: '楽曲データの取得時にエラーが発生しました。', status: 'error' })
      })
      .finally(() => setIsLoading(false))
  }, [trackCollection])

  const onClickEditButton = useCallback(
    (track: Track) => {
      setTrackAction('edit')
      setActionTargetTrack(track)
    },
    [setTrackAction, setActionTargetTrack]
  )

  const onClickDeleteButton = useCallback(
    (track: Track) => {
      setTrackAction('delete')
      setActionTargetTrack(track)
    },
    [setTrackAction, setActionTargetTrack]
  )

  const closeDialog = useCallback(() => {
    setActionTargetTrack(null)
  }, [setActionTargetTrack])

  const updateTrack = (track: Track) => {
    trackCollection
      .set(track)
      .then(() => {
        toast({ title: '更新しました。', status: 'success' })
        const newTracks = [...tracks]
        const index = tracks.findIndex((t) => t.id === track.id)
        newTracks.splice(index, 1, track)
        setTracks(newTracks)
      })
      .catch(() => toast({ title: '更新時にエラーが発生しました。', status: 'error' }))
      .finally(() => setActionTargetTrack(null))
  }

  const deleteTrack = (track: Track) => {
    trackCollection
      .delete(track.id)
      .then(() => {
        toast({ title: '削除しました。', status: 'success' })
        setTracks(tracks.filter((t) => t.id !== track.id))
      })
      .catch(() => toast({ title: '削除時にエラーが発生しました。', status: 'error' }))
      .finally(() => setActionTargetTrack(null))
  }

  return (
    <>
      <SEOMeta title="マイプレイリスト" />
      <Container maxW="container.lg" pt={4}>
        <Flex alignItems="center">
          <Heading size="lg">マイプレイリスト</Heading>
          <Spacer />
          <NextLink href="/settings/playlist/import" passHref>
            <a>
              <IconButton
                aria-label="楽曲を追加"
                fontSize={24}
                colorScheme="teal"
                icon={<MdAdd />}
              />
            </a>
          </NextLink>
        </Flex>
        <Box mt={8}>
          <TracksTable
            tracks={tracks}
            isLoading={isLoading}
            onEditTrack={onClickEditButton}
            onDeleteTrack={onClickDeleteButton}
          />
        </Box>
      </Container>
      <TrackActionDialog
        track={actionTargetTrack}
        action={trackAction}
        onClose={closeDialog}
        onUpdate={updateTrack}
        onDelete={deleteTrack}
      />
    </>
  )
}

export default PlayListPage
