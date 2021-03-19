import React, { useEffect } from 'react'
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
  Stack,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { useAuth } from '@/contexts/auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { userCollection } from '@/collections/user'
import { AvatarUploader } from '@/components/AvatarUploader'

export const UserProfileForm: React.FC = () => {
  const toast = useToast()
  const { currentUser, setCurrentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return
    formik.setValues({
      slug: currentUser.slug,
      thumbnail: currentUser.thumbnail,
      displayName: currentUser.displayName,
      bio: currentUser.bio,
      id: currentUser.id,
      createdAt: currentUser.createdAt,
    })
  }, [currentUser])

  const formik = useFormik({
    initialValues: {
      id: '',
      slug: '',
      bio: '',
      displayName: '',
      thumbnail: '',
      createdAt: new Date(),
    },
    onSubmit: async (values) => {
      return userCollection
        .set(values)
        .then((id) => {
          userCollection.fetch(id).then((user) => {
            setCurrentUser(user)
            toast({ status: 'success', title: '更新しました。' })
          })
        })
        .catch((e) => {
          console.log(e)
          toast({ status: 'error', title: 'エラーが発生しました。' })
        })
    },
    validationSchema: Yup.object().shape({
      slug: Yup.string()
        .required('必須項目です。')
        .matches(/^[0-9a-zA-Z_]+$/, '半角英数字と「_」のみが使用可能です。'),
      displayName: Yup.string().required('必須項目です。'),
    }),
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4}>
        <AvatarUploader
          src={formik.values.thumbnail}
          uid={currentUser?.id || ''}
          onUpload={(url) => formik.setFieldValue('thumbnail', url)}
        />
        <FormControl>
          <InputGroup>
            <InputLeftAddon>@</InputLeftAddon>
            <Input id="slug" value={formik.values.slug} readOnly />
          </InputGroup>
        </FormControl>
        <FormControl isInvalid={formik.errors.displayName && formik.touched.displayName}>
          <FormLabel>ユーザー名</FormLabel>
          <Input
            id="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FormErrorMessage>{formik.errors.displayName}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>プロフィール</FormLabel>
          <Textarea
            id="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </FormControl>
        <Button
          type="submit"
          disabled={!formik.isValid}
          isLoading={formik.isSubmitting}
          colorScheme="teal"
        >
          更新する
        </Button>
      </Stack>
    </form>
  )
}
