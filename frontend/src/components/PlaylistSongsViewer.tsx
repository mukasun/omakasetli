/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useMemo, createRef } from 'react'
import { Playlist, Song } from '@/libs/music/types'
import { Image, Box, Text, Flex } from '@chakra-ui/react'
import { useMusic } from '@/libs/music/hook'
import TinderCard from 'react-tinder-card'
interface Props {
  playlist: Playlist
}

export const PlaylistSongsViewer: React.FC<Props> = ({ playlist }) => {
  const music = useMusic()
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastDirection, setLastDirection] = useState()
  const [alreadyRemoved, setAlreadyRemoved] = useState([])
  const [leftSongs, setleftSongs] = useState([])
  const childRefs = useMemo(
    () =>
      Array(songs.length)
        .fill(0)
        .map((_) => createRef()),
    []
  )

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const musicLib = playlist.platform === 'spotify' ? music.spotify : music.apple
    musicLib
      .getSongsForPlaylist(playlist)
      .then((songs) => {
        if (isMounted) {
          setSongs(songs)
        }
      })
      .finally(() => setIsLoading(false))

    return () => {
      isMounted = false
    }
  }, [music])

  const swiped = (direction, isrcToDelete) => {
    console.log(`removing to ${direction}: ${isrcToDelete}`)
    setLastDirection(direction)
    setAlreadyRemoved([...alreadyRemoved, isrcToDelete])
  }

  // const outOfFrame = (isrc: string) => {
  //   console.log(isrc + ' left the screen!')
  //   const newSongs = songs.filter((song) => song.isrc !== isrc)
  //   setSongs(newSongs)
  // }

  const swipe = (dir) => {
    const cardsLeft = songs.filter((song) => !alreadyRemoved.includes(song.isrc))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].isrc // Find the card object to be removed
      const index = songs.map((song) => song.isrc).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      // @ts-ignore
      childRefs[index].current.swipe(dir) // Swipe the card!
    }
  }

  return (
    <>
      <Flex height={300} align="center" justifyContent="center">
        {songs.map((song, index) => (
          <TinderCard className="swipe" key={song.isrc} onSwipe={(dir) => swiped(dir, song.isrc)}>
            <div className="card">
              <Image src={song.mediumImage} />
              <Flex className="card-meta-box" direction="column" justifyContent="flex-end">
                <Text fontSize={18}>{song.name}</Text>
                <Text fontSize={12}>
                  {song.artist}&nbsp;({song.releaseYear})
                </Text>
              </Flex>
            </div>
          </TinderCard>
        ))}
      </Flex>
    </>
  )
}
