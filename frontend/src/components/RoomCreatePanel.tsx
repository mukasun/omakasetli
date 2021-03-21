import { useAuth } from '@/contexts/auth'
import {
  useToast,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Button,
} from '@chakra-ui/react'
import { roomCollection } from '@/collections/rooms'
import Firebase from '@/libs/firebase'
import { memberCollectionFactory } from '@/collections/rooms/members'
import { useRouter } from 'next/router'
import { genRamdomNumberCode } from '@/libs/utils'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface Props {
  onClose: () => void
}

export const RoomCreatePanel: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const { currentUser, setJoiningRoomId } = useAuth()
  const toast = useToast()

  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: async ({ name }) => {
      if (!currentUser) return
      let roomId = ''
      Firebase.instance.db
        .runTransaction(async (_tx) => {
          roomId = await roomCollection.add({
            name,
            owner: currentUser.id,
            code: genRamdomNumberCode(6),
            createdAt: Firebase.instance.serverTimestamp,
          })
          const memberCollection = memberCollectionFactory.create(`rooms/${roomId}/members`)
          await memberCollection.set({
            ...currentUser,
            roomId,
            joinedAt: Firebase.instance.serverTimestamp,
          })
        })
        .then(() => {
          toast({ title: 'ルームを作成しました。', status: 'success' })
          setJoiningRoomId(roomId)
          onClose()
          router.push(`/rooms/${roomId}`)
        })
        .catch(() => {
          toast({ title: 'エラーが発生しました。', status: 'error' })
        })
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('必須項目です。'),
    }),
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4}>
        <FormControl isInvalid={formik.errors.name && formik.touched.name}>
          <FormLabel>ルーム名</FormLabel>
          <Input
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          disabled={!formik.isValid}
          isLoading={formik.isSubmitting}
          colorScheme="teal"
        >
          作成
        </Button>
      </Stack>
    </form>
  )
}
