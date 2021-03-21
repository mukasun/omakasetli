import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import {
  useToast,
  PinInput,
  PinInputField,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react'
import { Room, roomCollection } from '@/collections/rooms'
import { memberCollectionFactory } from '@/collections/rooms/members'
import { CgEnter } from 'react-icons/cg'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Firebase from '@/libs/firebase'

interface Props {
  onClose: () => void
}

export const RoomSearchPanel: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const { currentUser, setJoiningRoomId } = useAuth()
  const toast = useToast()
  const [rooms, setRooms] = useState<Room[]>([])

  const formik = useFormik({
    initialValues: { code: '' },
    onSubmit: async (values) => {
      console.log(values)
      return roomCollection
        .where('code', '==', values.code)
        .fetch()
        .then((rooms) => {
          console.log(rooms)
          setRooms(rooms)
        })
        .catch(() => {
          toast({ status: 'error', title: 'エラーが発生しました。' })
        })
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required('必須項目です。'),
    }),
  })

  const enterRoom = (roomId: string) => {
    if (!currentUser) return
    memberCollectionFactory
      .create(`rooms/${roomId}/members`)
      .set({ ...currentUser, roomId, joinedAt: Firebase.instance.serverTimestamp })
      .then(() => {
        toast({ title: '入室しました。', status: 'success' })
        setJoiningRoomId(roomId)
        onClose()
        router.push(`/rooms/${roomId}`)
      })
      .catch(() => {
        toast({ title: 'エラーが発生しました。', status: 'error' })
      })
  }

  return (
    <Stack spacing={4}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!formik.errors.code}>
            <FormLabel>ルームNo.</FormLabel>
            <Stack direction="row" justifyContent="space-between">
              <PinInput
                id="code"
                placeholder="0"
                isInvalid={!!formik.errors.code}
                onComplete={(code) => formik.setFieldValue('code', code)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </Stack>
            <FormErrorMessage>{formik.errors.code}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            disabled={!formik.isValid}
            isLoading={formik.isSubmitting}
            colorScheme="teal"
          >
            検索
          </Button>
        </Stack>
      </form>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ルーム</Th>
            <Th w={24} textAlign="center">
              入室
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms.map((room) => (
            <Tr key={room.id}>
              <Td>{room.name}</Td>
              <Td w={24} textAlign="center">
                <IconButton
                  aria-label="入室"
                  fontSize={18}
                  variant="ghost"
                  icon={<CgEnter />}
                  onClick={() => enterRoom(room.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Stack>
  )
}
