import { NextPage } from 'next'
import { useEffect } from 'react'
import styles from '@/styles/pages/register.module.scss'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { useAuth } from '@/contexts/auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AvatarUploader } from '@/components/AvatarUploader'
import { userCollection } from '@/collections/user'
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

const AccountSettingPage: NextPage = () => {
  const { currentUser, setCurrentUser } = useAuth()
  const toast = useToast()

  useRequireUser()

  const formik = useFormik({
    initialValues: {
      id: '',
      slug: '',
      bio: '',
      displayName: '',
      thumbnail: '',
      created: new Date(),
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

  useEffect(() => {
    formik.setValues({
      slug: currentUser.slug,
      thumbnail: currentUser.thumbnail,
      displayName: currentUser.displayName,
      bio: currentUser.bio,
      id: currentUser.id,
      created: currentUser.created,
    })
  }, [currentUser])

  return (
    <>
      <SEOMeta title="アカウント設定" path="/register" />
      <section className="wrapper">
        <div className={styles.signinForm}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>アカウント設定</p>
          </div>
          <div className={styles.textContainer}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <AvatarUploader
                  src={formik.values.thumbnail}
                  uid={currentUser.id}
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
          </div>
        </div>
      </section>
    </>
  )
}

export default AccountSettingPage
