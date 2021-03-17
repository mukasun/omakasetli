import { Playlist } from '@/libs/music/types'
import {
  Image,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react'

interface Props {
  playlist: Playlist
}

export const PlaylistPreviewCard: React.FC<Props> = ({ playlist }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box onClick={onOpen}>
        <Image src={playlist.image} boxShadow={'0 4px 14px rgb(0 0 0 / 10%)'} borderRadius={6} />
        <Text mt={2} fontWeight={600} isTruncated>
          {playlist.name}
        </Text>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{playlist.name}の楽曲</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{playlist.platform}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
