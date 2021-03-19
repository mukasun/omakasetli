import { NextPage } from 'next'
import { useEffect } from 'react'
import styles from '@/styles/pages/register.module.scss'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireNoUser } from '@/hooks/useRequireNoUser'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AvatarUploader } from '@/components/AvatarUploader'
import { userCollection, isUniqueSlug } from '@/collections/users'
import { useFirebase } from '@/libs/firebase/hook'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  useToast,
} from '@chakra-ui/react'

const RegisterPage: NextPage = () => {
  const { providerMetadata, setCurrentUser } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const firebase = useFirebase()

  useRequireNoUser()

  const formik = useFormik({
    initialValues: {
      id: '',
      slug: '',
      displayName: '',
      thumbnail: '',
      bio: '',
    },
    onSubmit: async (values) => {
      const isUnique = await isUniqueSlug(values.slug)

      if (!isUnique) {
        return toast({
          status: 'warning',
          title: `ユーザーID「${values.slug}」は既に使用されています。`,
        })
      }

      return userCollection
        .set({ ...values, createdAt: firebase.serverTimestamp })
        .then((id) => {
          userCollection.fetch(id).then((user) => {
            setCurrentUser(user)
            toast({ status: 'success', title: 'ユーザー登録が完了しました。' })
            router.push('/')
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
      slug: '',
      bio: '',
      thumbnail: providerMetadata?.photoUrl || '',
      displayName: providerMetadata?.displayName || '',
      id: providerMetadata?.uid || '',
    })
  }, [providerMetadata])

  return (
    <>
      <SEOMeta title="ユーザー登録" path="/register" />
      <section className="wrapper">
        <div className={styles.signinForm}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>ユーザー登録</p>
          </div>
          <div className={styles.textContainer}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <AvatarUploader
                  src={formik.values.thumbnail}
                  uid={providerMetadata?.uid}
                  onUpload={(url) => formik.setFieldValue('thumbnail', url)}
                />
                <FormControl isInvalid={formik.errors.slug && formik.touched.slug}>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>
                    <Input
                      id="slug"
                      value={formik.values.slug}
                      placeholder="ユーザーID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                  <FormHelperText>
                    <InfoOutlineIcon />
                    &nbsp; 登録後にユーザーIDは変更できません。
                  </FormHelperText>
                  <FormErrorMessage>{formik.errors.slug}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.errors.displayName && formik.touched.displayName}>
                  <Input
                    id="displayName"
                    value={formik.values.displayName}
                    placeholder="ユーザー名"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormErrorMessage>{formik.errors.displayName}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  isLoading={formik.isSubmitting}
                  colorScheme="teal"
                >
                  登録
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default RegisterPage
