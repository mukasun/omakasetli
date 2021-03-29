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
  Stack,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { Room, roomCollection } from '@/collections/rooms'
import { Member, memberCollectionFactory } from '@/collections/rooms/members'
import { Setlist, setlistCollectionFactory } from '@/collections/rooms/setlists'
import { useRouter } from 'next/router'
import { millisToMinutesAndSeconds } from '@/libs/utils'
import Firebase from '@/libs/firebase'
import { SetlistViewer } from '@/components/SetlistViewer'
import api from '@@/api/$api'
import aspida from '@aspida/axios'

const RoomPage: NextPage = () => {
  useRequireUser()
  const router = useRouter()
  const { roomId } = router.query
  const [room, setRoom] = useState<Room | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [selectedSetlistIndex, setSelectedSetlistIndex] = useState(-1)
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckedOwner, setIsCheckedOwner] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentUser, setJoiningRoomId } = useAuth()
  const toast = useToast()

  const isOwner = useMemo(() => {
    if (!currentUser || !room) return false
    setIsCheckedOwner(true)
    return currentUser.id === room.owner
  }, [currentUser, room])

  useEffect(() => {
    if (typeof roomId !== 'string' || !currentUser) return
    const memberCollection = memberCollectionFactory.create(`rooms/${roomId}/members`)
    const setlistCollection = setlistCollectionFactory.create(`rooms/${roomId}/setlists`)

    Promise.all([
      roomCollection.fetch(roomId),
      memberCollection.orderBy('joined_at', 'asc').fetch(),
      setlistCollection.fetchAll(),
    ])
      .then(([room, members, setlists]) => {
        if (!room || !members.map((m) => m.id).includes(currentUser.id)) {
          router.push('/')
          toast({ title: 'ルームが存在しません。', status: 'error' })
        } else {
          setRoom(room)
          setMembers(members)
          setSetlists(setlists)
        }
      })
      .catch(() => {
        toast({ title: 'データ取得時にエラーが発生しました', status: 'error' })
      })

    const unsubscribeMembers = memberCollection
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

    return () => unsubscribeMembers()
  }, [roomId, currentUser])

  useEffect(() => {
    if (!isCheckedOwner) return
    const setlistCollection = setlistCollectionFactory.create(`rooms/${roomId}/setlists`)
    let unsubscribeSetlists = () => null
    if (!isOwner) {
      unsubscribeSetlists = setlistCollection
        .where('created_at', '>', Firebase.instance.timestamp.fromDate(new Date()))
        .onSnapshot((querySnapshot, toObject) => {
          querySnapshot.docChanges().forEach((change) => {
            const changedSetlist = toObject(change.doc)
            if (change.type === 'added') {
              toast({ title: '新しいセットリストが作成されました。', status: 'info' })
              setSetlists((oldSetlists) => [...oldSetlists, changedSetlist])
            }
          })
        })
    }
    return () => unsubscribeSetlists()
  }, [isCheckedOwner])

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

  const requestSetlist = () => {
    if (typeof roomId !== 'string') return
    setIsLoading(true)
    const client = api(aspida())
    client.setlist_solver
      .post({
        body: {
          room_id: roomId,
          time_limit: timeLimit * 60,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setSetlists([
          ...setlists,
          {
            id: '',
            scoreAvg: res.body.score_avg,
            scoreVar: res.body.score_var,
            scoreSum: res.body.score_sum,
            scores: res.body.scores,
            totalTime: res.body.total_time,
            tracks: res.body.tracks,
            createdAt: new Date(),
          },
        ])
        toast({ title: 'セットリストが生成されました', status: 'success' })
      })
      .catch((e) => {
        console.log(e)
        toast({ title: 'エラーが発生しました', status: 'error' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const showSetlist = (index: number) => {
    setSelectedSetlistIndex(index)
    onOpen()
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
        <SimpleGrid columns={[2, 4, 5]} spacing={10} my={10}>
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
        <Flex alignItems="center">
          <Heading size="md">セットリスト</Heading>
          <Spacer />
          {isOwner ? (
            <Stack spacing={4} direction="row" align="center">
              <InputGroup size="sm" w={32}>
                <NumberInput size="sm">
                  <NumberInputField
                    placeholder="予定時間"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    onBlur={(e) => setTimeLimit(Number(e.target.value))}
                  />
                </NumberInput>
                <InputRightAddon children="分" />
              </InputGroup>
              <Button colorScheme="teal" size="sm" onClick={requestSetlist} isLoading={isLoading}>
                作成する
              </Button>
            </Stack>
          ) : null}
        </Flex>
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th textAlign="center">満足度</Th>
              <Th textAlign="center">時間</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {setlists.map((setlist, index) => (
              <Tr key={index}>
                <Td w={4}>{index + 1}</Td>
                <Td w={24} textAlign="center">
                  {setlist.scoreSum}
                </Td>
                <Td w={24} textAlign="center">
                  {millisToMinutesAndSeconds(setlist.totalTime)}
                </Td>
                <Td textAlign="right">
                  <Button size="sm" onClick={() => showSetlist(index)}>
                    詳細
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
      <Modal isCentered size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>セットリスト{selectedSetlistIndex + 1}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SetlistViewer
              members={members}
              setlist={selectedSetlistIndex >= 0 && setlists[selectedSetlistIndex]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RoomPage
