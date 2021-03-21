import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Logo } from '@/components/svg/Logo'
import { Loader } from '@/components/Loader'
import { RoomSearchPanel } from '@/components/RoomSearchPanel'
import { RoomCreatePanel } from '@/components/RoomCreatePanel'
import { useAuth } from '@/contexts/auth'
import { useFirebase } from '@/libs/firebase/hook'
import styles from '@/styles/components/AppHeader.module.scss'
import {
  Button,
  Avatar,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  LinkBox,
  LinkOverlay,
  useToast,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'

export const AppHeader: React.FC = () => {
  const { currentUser, setCurrentUser, joiningRoomId } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const firebase = useFirebase()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleRoomAction = () => {
    if (joiningRoomId) {
      router.push(`/rooms/${joiningRoomId}`)
    } else {
      onOpen()
    }
  }

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
            <NextLink href="/">
              <a className={styles.homeLink}>
                <Logo />
              </a>
            </NextLink>
            {currentUser === undefined ? (
              <Loader />
            ) : currentUser === null ? (
              <NextLink href="/signin" passHref>
                <Button size="sm" colorScheme="teal">
                  ログイン
                </Button>
              </NextLink>
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
                  <LinkBox as={MenuItem}>
                    <NextLink href={`/${currentUser.slug}`} passHref>
                      <LinkOverlay>マイページ</LinkOverlay>
                    </NextLink>
                  </LinkBox>
                  <MenuItem onClick={handleRoomAction}>ルーム</MenuItem>
                  <LinkBox as={MenuItem}>
                    <NextLink href="/settings/playlist" passHref>
                      <LinkOverlay>プレイリスト</LinkOverlay>
                    </NextLink>
                  </LinkBox>
                  <MenuDivider />
                  <LinkBox as={MenuItem}>
                    <NextLink href="/settings/account" passHref>
                      <LinkOverlay>アカウント設定</LinkOverlay>
                    </NextLink>
                  </LinkBox>
                  <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        </div>
        <Modal isCentered size="sm" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ルーム</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs align="center" isFitted>
                <TabList mb={4}>
                  <Tab>検索</Tab>
                  <Tab>作成</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <RoomSearchPanel onClose={onClose} />
                  </TabPanel>
                  <TabPanel>
                    <RoomCreatePanel onClose={onClose} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      </header>
    </>
  )
}
