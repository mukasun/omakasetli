import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/auth'
import { useToast } from '@chakra-ui/toast'

export function useRequireUser() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (currentUser === null) {
      router.push('/signin')
      toast({ title: 'ログインしてください。', status: 'info' })
    }
  }, [currentUser])
}
