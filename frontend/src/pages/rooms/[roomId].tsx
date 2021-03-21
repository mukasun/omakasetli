import { NextPage } from 'next'
import NextLink from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { useAuth } from '@/contexts/auth'
import {
  Container,
  Heading,
  Flex,
  useToast,
  SimpleGrid,
  Avatar,
  AvatarBadge,
  Button,
  Text,
  Spacer,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { Room, roomCollection } from '@/collections/rooms'
import { Member, memberCollectionFactory } from '@/collections/rooms/members'
import { useRouter } from 'next/router'
import Firebase from '@/libs/firebase'

const RoomPage: NextPage = () => {
  useRequireUser()
  const router = useRouter()
  const { roomId } = router.query
  const [room, setRoom] = useState<Room | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  // const [isLoading, setIsLoading] = useState(false)
  const { currentUser, setJoiningRoomId } = useAuth()
  const toast = useToast()

  const isOwner = useMemo(() => {
    if (!currentUser || !room) return false
    return currentUser.id === room.owner
  }, [currentUser, room])

  useEffect(() => {
    if (typeof roomId !== 'string') return
    const memberCollection = memberCollectionFactory.create(`rooms/${roomId}/members`)

    Promise.all([
      roomCollection.fetch(roomId),
      memberCollection.orderBy('joined_at', 'asc').fetch(),
    ])
      .then(([room, members]) => {
        if (!room) {
          router.push('/')
          toast({ title: 'ルームが存在しません。', status: 'error' })
        }
        setRoom(room)
        setMembers(members)
      })
      .catch(() => {
        toast({ title: 'データ取得時にエラーが発生しました', status: 'error' })
      })

    const unsubscribe = memberCollection
      .where('joined_at', '>', Firebase.instance.timestamp.fromDate(new Date()))
      .onSnapshot((querySnapshot, toObject) => {
        querySnapshot.docChanges().forEach((change) => {
          const changedMember = toObject(change.doc)
          if (change.type === 'added') {
            toast({ title: `${changedMember.displayName}が入室しました`, status: 'info' })
            setMembers((oldMembers) => [...oldMembers, changedMember])
          } else if (change.type === 'removed') {
            toast({ title: `${changedMember.displayName}が退室しました`, status: 'info' })
            setMembers((oldMembers) => oldMembers.filter((m) => m.id !== changedMember.id))
          }
        })
      })
    return () => unsubscribe()
  }, [roomId])

  const closeRoom = () => {
    if (typeof roomId !== 'string') return
    roomCollection
      .delete(roomId)
      .then(() => {
        toast({ title: 'ルームを終了しました', status: 'success' })
        setJoiningRoomId('')
        router.push('/')
      })
      .catch(() => {
        toast({ title: 'エラーが発生しました', status: 'error' })
      })
  }

  const leaveRoom = () => {
    if (typeof roomId !== 'string') return
    memberCollectionFactory
      .create(`rooms/${roomId}/members`)
      .delete(currentUser.id)
      .then(() => {
        toast({ title: '退出しました', status: 'success' })
        setJoiningRoomId('')
        router.push('/')
      })
      .catch(() => {
        toast({ title: 'エラーが発生しました', status: 'error' })
      })
  }

  return (
    <>
      <SEOMeta title="ルーム" />
      <Container maxW="container.lg" pt={4}>
        <Flex alignItems="center">
          <Heading size="lg" isTruncated maxW="80%">
            {room?.name}
            <Text fontSize="md" color="gray.500">
              No.{room?.code}
            </Text>
          </Heading>
          <Spacer />
          {isOwner ? (
            <Button colorScheme="red" onClick={closeRoom}>
              閉じる
            </Button>
          ) : (
            <Button colorScheme="teal" onClick={leaveRoom}>
              退出する
            </Button>
          )}
        </Flex>
        <SimpleGrid columns={[2, 4, 5]} spacing={10} mt={10}>
          {members.map((member) => (
            <LinkBox as={Flex} flexDirection="column" alignItems="center" key={member.id}>
              <NextLink href={`/${member.slug}`} passHref>
                <LinkOverlay>
                  <Avatar mb={2} boxSize={24} name={member.displayName} src={member.thumbnail}>
                    {member.id === room?.owner ? (
                      <AvatarBadge boxSize="1.5em" bg="green.500" />
                    ) : null}
                  </Avatar>
                </LinkOverlay>
              </NextLink>
              <Text fontSize="sm" fontWeight={500} maxW="100%" isTruncated>
                {member.displayName}
              </Text>
              <Text fontSize="xs" color="gray.500">
                @{member.slug}
              </Text>
            </LinkBox>
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}

export default RoomPage
