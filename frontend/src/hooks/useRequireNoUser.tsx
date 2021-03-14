import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/auth'

export function useRequireNoUser() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) router.push('/')
  }, [currentUser])
}
