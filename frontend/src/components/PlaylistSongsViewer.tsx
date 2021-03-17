import { Platform } from '@/libs/music/music'
import { Playlist } from '@/libs/music/types'
import { Image, Box, Text } from '@chakra-ui/react'

interface Props {
  playlistId: string
  platform: Platform
}

export const PlaylistPreviewCard: React.FC<Props> = ({ playlistId, platform }) => {
  return (
    <>
      <Box>a</Box>
    </>
  )
}
