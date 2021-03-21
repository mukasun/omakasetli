import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SEOMeta } from '@/components/SEOMeta'
import styles from '@/styles/pages/signin.module.scss'
import { useAuth } from '@/contexts/auth'
import { useFirebase } from '@/libs/firebase/hook'
import { useToast, Button, Stack } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'

const SignInPage: NextPage = () => {
  const router = useRouter()
  const { currentUser } = useAuth()
  const firebase = useFirebase()
  const toast = useToast()

  useEffect(() => {
    if (currentUser) {
      toast({ title: 'ログインしました。', status: 'success' })
      router.push('/')
    }
  }, [currentUser])

  const signInWithGoogle = () => {
    firebase.auth.signInWithPopup(firebase.authProviders.google)
  }

  return (
    <>
      <SEOMeta title="ログイン" path="/signin" />
      <section className="wrapper">
        <div className={styles.signinForm}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>ログイン</p>
          </div>
          <div className={styles.textContainer}>
            <Stack align="center" spacing={4}>
              <Button
                colorScheme="gray"
                leftIcon={<FcGoogle />}
                isFullWidth
                onClick={signInWithGoogle}
              >
                Googleでログイン
              </Button>
            </Stack>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignInPage
