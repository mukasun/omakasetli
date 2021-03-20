import {
  Button,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogFooter,
  Flex,
} from '@chakra-ui/react'
import { Track } from '@/collections/users/tracks'
import { useRef, memo, useState, useEffect } from 'react'
import { MdSentimentVerySatisfied, MdSentimentSatisfied, MdSentimentNeutral } from 'react-icons/md'

interface TrackActionDialogProps {
  action: 'edit' | 'delete'
  track: Track | null
  onClose: () => void
  onUpdate: (track: Track) => void
  onDelete: (track: Track) => void
}

export const TrackActionDialog: React.FC<TrackActionDialogProps> = memo(
  ({ track, action, onUpdate, onDelete, onClose }) => {
    const cancelRef = useRef()
    const [priority, setPriority] = useState(2)

    useEffect(() => {
      if (!track) return
      setPriority(track.priority)
    }, [track])

    const onCliclUpdateButton = () => {
      onUpdate({ ...track, priority })
    }

    const onClickDeleteButton = () => {
      onDelete(track)
    }

    return (
      <AlertDialog
        isOpen={!!track}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size="sm"
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              「{track?.name}」
            </AlertDialogHeader>
            <AlertDialogBody>
              {action === 'edit' ? (
                <Flex justifyContent="space-around">
                  <IconButton
                    size="lg"
                    isRound
                    fontSize={24}
                    colorScheme={priority === 1 ? 'teal' : 'gray'}
                    aria-label="Neutral"
                    icon={<MdSentimentNeutral />}
                    onClick={() => setPriority(1)}
                  />
                  <IconButton
                    size="lg"
                    isRound
                    fontSize={24}
                    colorScheme={priority === 2 ? 'teal' : 'gray'}
                    aria-label="Satisfied"
                    icon={<MdSentimentSatisfied />}
                    onClick={() => setPriority(2)}
                  />
                  <IconButton
                    size="lg"
                    isRound
                    fontSize={24}
                    colorScheme={priority === 3 ? 'teal' : 'gray'}
                    aria-label="Very Satisfied"
                    icon={<MdSentimentVerySatisfied />}
                    onClick={() => setPriority(3)}
                  />
                </Flex>
              ) : (
                <>プレイリストから削除しますか？</>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              {action === 'edit' ? (
                <Button colorScheme="green" onClick={onCliclUpdateButton} ml={3}>
                  保存
                </Button>
              ) : (
                <Button colorScheme="red" onClick={onClickDeleteButton} ml={3}>
                  削除
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    )
  }
)
