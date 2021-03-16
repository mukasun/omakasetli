import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Logo } from '@/components/svg/Logo'
import { Loader } from '@/components/Loader'
import { useAuth } from '@/contexts/auth'
import styles from '@/styles/components/AppHeader.module.scss'
import { Button, Avatar, Menu, MenuList, MenuButton, MenuItem, useToast } from '@chakra-ui/react'
import { useFirebase } from '@/libs/firebase/hook'

export const AppHeader: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const firebase = useFirebase()

  const handleSignOut = () => {
    firebase.auth.signOut().then(() => {
      setCurrentUser(null)
      toast({ title: 'ログアウトしました。', status: 'info' })
      router.push('/')
    })
  }

  return (
    <>
      <header id="header">
        <div className="wrapper">
          <div className={styles.inner}>
            <Link href="/">
              <a className={styles.homeLink}>
                <Logo />
              </a>
            </Link>
            {currentUser === undefined ? (
              <Loader />
            ) : currentUser === null ? (
              <Link href="/signin" passHref>
                <Button size="sm" colorScheme="teal">
                  ログイン
                </Button>
              </Link>
            ) : (
              <Menu>
                <MenuButton>
                  <Avatar
                    src={currentUser.thumbnail}
                    showBorder
                    borderColor="#eee"
                    loading="eager"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Link href={`/${currentUser.slug}`}>
                      <a>マイページ</a>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href="/settings/playlist">
                      <a>プレイリスト編集</a>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href="/settings/account">
                      <a>アカウント設定</a>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
