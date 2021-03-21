/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useMemo, createRef } from 'react'
import { Playlist, Song } from '@/libs/music/types'
import { useMusic } from '@/libs/music/hook'
import { useAuth } from '@/contexts/auth'
import TinderCard from 'react-tinder-card'
import Firebase from '@/libs/firebase/firebase'
import { Track, trackCollectionFactory } from '@/collections/users/tracks'
import styles from '@/styles/components/PlaylistSongsViewer.module.scss'
import {
  Image,
  Stack,
  Text,
  Spinner,
  IconButton,
  Button,
  Icon,
  useToast,
  HStack,
} from '@chakra-ui/react'
import { MdSentimentVerySatisfied, MdSentimentSatisfied, MdSentimentNeutral } from 'react-icons/md'
import { GrPowerReset } from 'react-icons/gr'
import { AiOutlineCheckCircle } from 'react-icons/ai'
interface Props {
  playlist: Playlist
  onClose: () => void
}

type SwipeDirection = 'left' | 'right' | 'up' | 'down'

const PRIORITY_MAP: { [K in SwipeDirection]: number } = {
  down: 0,
  left: 1,
  up: 2,
  right: 3,
}

export const PlaylistSongsViewer: React.FC<Props> = ({ playlist, onClose }) => {
  const music = useMusic()
  const { currentUser, importedTrackIds, setImportedTrackIds } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [evaluatedTracks, setEvaluatedTracks] = useState<Track[]>([])
  const [alreadyRemoved, setAlreadyRemoved] = useState([])
  const toast = useToast()
  const childRefs = useMemo(
    () =>
      Array(songs.length)
        .fill(0)
        .map((_) => createRef()),
    [songs]
  )

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    const musicLib = playlist.platform === 'spotify' ? music.spotify : music.apple
    musicLib
      .getSongsForPlaylist(playlist)
      .then((songs) => {
        if (isMounted) {
          setSongs(songs.filter((s) => !importedTrackIds.includes(s.isrc)))
        }
      })
      .finally(() => setIsLoading(false))
    return () => {
      isMounted = false
    }
  }, [music])

  const swiped = (dir: SwipeDirection, song: Song) => {
    setAlreadyRemoved((prevState) => [...prevState, song.isrc])

    if (dir !== 'down') {
      setEvaluatedTracks((prevState) => {
        const nextState = [
          ...prevState,
          {
            ...song,
            id: song.isrc,
            priority: PRIORITY_MAP[dir],
          },
        ]
        return nextState
      })
    }
  }

  const swipe = (dir: SwipeDirection) => {
    const cardsLeft = songs.filter((song) => !alreadyRemoved.includes(song.isrc))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].isrc
      const index = songs.map((song) => song.isrc).indexOf(toBeRemoved)
      alreadyRemoved.push(toBeRemoved)
      // @ts-ignore
      childRefs[index].current.swipe(dir)
    }
  }

  const save = () => {
    Firebase.instance.db
      .runBatch(async (_batch) => {
        const trackCollectionFactiory = trackCollectionFactory.create(
          `users/${currentUser.id}/tracks`
        )
        for (const track of evaluatedTracks) {
          await trackCollectionFactiory.set(track)
        }
      })
      .then(() => {
        toast({ title: '楽曲をインポートしました。', status: 'success' })
        setImportedTrackIds(importedTrackIds.concat(evaluatedTracks.map((t) => t.isrc)))
        onClose()
      })
      .catch(() => {
        toast({ title: 'エラーが発生しました。', status: 'error' })
      })
  }

  return (
    <Stack align="center" spacing={4} py={4}>
      <Stack w={300} h={300} justifyContent="center" align="center">
        {isLoading ? (
          <Spinner />
        ) : songs.length === 0 ? (
          <Stack>
            <Image src="/nodata.png" alt="nodata" />
            <Text align="center">未追加の楽曲はありません</Text>
          </Stack>
        ) : (
          <>
            <Stack align="center">
              <Icon as={AiOutlineCheckCircle} boxSize={100} color="green" />
              <Text fontSize={24} fontWeight={600}>
                COMPLETE!
              </Text>
            </Stack>
            {songs.map((song, index) => (
              <TinderCard
                // @ts-ignore
                ref={childRefs[index]}
                className={styles.swipeWrapper}
                key={song.isrc}
                onSwipe={(dir) => swiped(dir, song)}
              >
                <div className={styles.card}>
                  <Image src={song.mediumImage} objectFit="cover" w={300} h={300} />
                  <Stack className={styles.cardImageOverlay} justifyContent="flex-end">
                    <Text fontSize={18}>{song.name}</Text>
                    <Text fontSize={12}>
                      {song.artist}&nbsp;({song.releaseYear})
                    </Text>
                  </Stack>
                </div>
              </TinderCard>
            ))}
          </>
        )}
      </Stack>
      <div className={styles.controller}>
        <IconButton
          size="lg"
          isRound
          fontSize={24}
          aria-label="Skip"
          icon={<GrPowerReset />}
          className={styles.controllerPositionBottom}
          onClick={() => swipe('down')}
        />
        <IconButton
          size="lg"
          isRound
          fontSize={24}
          aria-label="Neutral"
          icon={<MdSentimentNeutral />}
          className={styles.controllerPositionLeft}
          onClick={() => swipe('left')}
        />
        <IconButton
          size="lg"
          isRound
          fontSize={24}
          aria-label="Satisfied"
          icon={<MdSentimentSatisfied />}
          className={styles.controllerPositionTop}
          onClick={() => swipe('up')}
        />
        <IconButton
          size="lg"
          isRound
          fontSize={24}
          aria-label="Very Satisfied"
          icon={<MdSentimentVerySatisfied />}
          className={styles.controllerPositionRight}
          onClick={() => swipe('right')}
        />
      </div>
      <HStack spacing={4}>
        <Button onClick={onClose}>閉じる</Button>
        <Button colorScheme="green" onClick={save}>
          保存
        </Button>
      </HStack>
    </Stack>
  )
}
