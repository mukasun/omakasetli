// import { useEffect } from 'react'
import { NextPage } from 'next'
// import { useRouter } from 'next/router'
import { SEOMeta } from '@/components/SEOMeta'
// import { useFirebase } from '@/libs/firebase/hook'
// import { useAuth } from '@/contexts/auth'
// import { useToast } from '@chakra-ui/react'

const UserPage: NextPage = () => {
  // const router = useRouter()
  // const { currentUser } = useAuth()
  // const toast = useToast()
  // const firebase = useFirebase()

  return (
    <>
      <SEOMeta title="test" path="/" />
    </>
  )
}

export default UserPage
