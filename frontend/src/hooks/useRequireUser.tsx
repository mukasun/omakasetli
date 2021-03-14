import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/auth'

export function useRequireUser() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (currentUser === null) router.push('/signin')
  }, [currentUser])
}
