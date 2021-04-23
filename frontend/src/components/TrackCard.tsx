import { Track } from '@/collections/users/tracks'
import { Image, Box, Text, Icon } from '@chakra-ui/react'
import { MdSentimentVerySatisfied, MdSentimentSatisfied, MdSentimentNeutral } from 'react-icons/md'
import styles from '@/styles/components/TrackCard.module.scss'

interface Props {
  track: Track
}

const priorityMap = {
  1: MdSentimentNeutral,
  2: MdSentimentSatisfied,
  3: MdSentimentVerySatisfied,
}

export const TrackCard: React.FC<Props> = ({ track }) => {
  return (
    <>
      <Box>
        <Box className={styles.ribon}>
          <Image
            src={track.mediumImage}
            boxShadow={'0 4px 14px rgb(0 0 0 / 10%)'}
            borderRadius={6}
          />
          <div className={styles.caption}>
            <Icon
              as={priorityMap[track.priority]}
              color="white"
              position="absolute"
              top={1}
              right={1}
              w={5}
              h={5}
            />
          </div>
        </Box>
        <Text mt={2} fontSize="sm" fontWeight={600} isTruncated>
          {track.name}
        </Text>
        <Text fontSize="xs" color="gray.500" isTruncated>
          {track.artist}
        </Text>
      </Box>
    </>
  )
}
