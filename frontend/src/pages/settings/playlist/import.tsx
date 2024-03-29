import { NextPage } from 'next'
import NextLink from 'next/link'
import { useState, useEffect } from 'react'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { FaSpotify, FaApple } from 'react-icons/fa'
import {
  Container,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Text,
  Heading,
  SimpleGrid,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Link,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react'
import { Playlist } from '@/libs/music/types'
import { useMusic } from '@/libs/music/hook'
import { PlaylistPreviewCard } from '@/components/PlaylistPreviewCard'
import { RiPlayListFill } from 'react-icons/ri'

const PlayListImportPage: NextPage = () => {
  useRequireUser()

  const music = useMusic()
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false)
  const [isLoadingApple, setIsLoadingApple] = useState(false)
  const [isAuthorizedSpotify, setIsAuthorizedSpotify] = useState(false)
  const [isAuthorizedApple, setIsAuthorizedApple] = useState(false)
  // const [isSearching, setIsSearching] = useState(false)
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<Playlist[]>([])
  const [applePlaylists, setApplePlaylists] = useState<Playlist[]>([])
  // const [searchResult, setSearchResult] = useState<Playlist[]>([])
  // const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    if (music.isAuthorized('spotify')) {
      setIsAuthorizedSpotify(true)
      setIsLoadingSpotify(true)
      music.spotify
        .getPlaylists()
        .then((playlists) => {
          setSpotifyPlaylists(playlists)
        })
        .finally(() => setIsLoadingSpotify(false))
    }

    if (music.isAuthorized('apple')) {
      setIsAuthorizedApple(true)
      setIsLoadingApple(true)
      music.apple
        .getPlaylists()
        .then((playlists) => {
          setApplePlaylists(playlists)
        })
        .finally(() => setIsLoadingApple(false))
    }
  }, [music])

  // const searchPlaylist = () => {
  //   setIsSearching(true)
  //   music.spotify
  //     .search(keyword, ['playlist'])
  //     .then((result) => {
  //       setSearchResult(result)
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //       toast({ title: '検索時にエラーが発生しました。', status: 'error' })
  //     })
  //     .finally(() => {
  //       setIsSearching(false)
  //     })
  // }

  return (
    <>
      <SEOMeta title="マイプレイリスト" />
      <Container maxW="container.lg" pt={4}>
        <Flex alignItems="center">
          <Heading size="lg">楽曲インポート</Heading>
          <Spacer />
          <NextLink href="/settings/playlist" passHref>
            <a>
              <IconButton
                aria-label="プレイリスト"
                fontSize={24}
                colorScheme="teal"
                icon={<RiPlayListFill />}
              />
            </a>
          </NextLink>
        </Flex>
        <Tabs align="center" mt={8} isFitted>
          <TabList>
            {/* <Tab>
              <MdSearch size={24} />
              <Text ml={1} fontWeight={600} display={['none', 'block']}>
                検索
              </Text>
            </Tab> */}
            <Tab _selected={{ color: '#84BD00', borderColor: '#84BD00' }}>
              <FaSpotify size={24} />
              <Text ml={1} fontWeight={600} display={['none', 'block']}>
                Spotify
              </Text>
            </Tab>
            <Tab _selected={{ color: '#fb453f', borderColor: '#fb453f' }}>
              <FaApple size={24} />
              <Text ml={1} fontWeight={600} display={['none', 'block']}>
                Apple Music
              </Text>
            </Tab>
          </TabList>
          <TabPanels>
            {/* <TabPanel>
              <Heading size="lg" my={8}>
                楽曲検索
              </Heading>
              <HStack mb={8}>
                <InputGroup size="lg">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300" />}
                  />
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="キーワード"
                  />
                </InputGroup>
                <Button
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSearching}
                  onClick={searchPlaylist}
                >
                  検索
                </Button>
              </HStack>
              {!isSearching && searchResult.length > 0 ? (
                <SimpleGrid columns={[2, 3, 4]} spacing={10}>
                  {searchResult.map((playlist) => (
                    <PlaylistPreviewCard key={playlist.id} playlist={playlist} />
                  ))}
                </SimpleGrid>
              ) : null}
            </TabPanel> */}
            <TabPanel>
              <Heading size="lg" my={8}>
                プレイリスト(Spotify)
              </Heading>
              {isAuthorizedSpotify ? (
                !isLoadingSpotify && spotifyPlaylists.length > 0 ? (
                  <SimpleGrid columns={[2, 3, 4]} spacing={10}>
                    {spotifyPlaylists.map((playlist) => (
                      <PlaylistPreviewCard key={playlist.id} playlist={playlist} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>Spotifyのプレイリストがありません。</Text>
                )
              ) : (
                <Alert
                  status="warning"
                  flexDirection="column"
                  justifyContent="center"
                  py={8}
                  px={[4, 8]}
                >
                  <Stack direction="row" mb={4}>
                    <AlertIcon m={0} />
                    <AlertTitle>Spotify未連携</AlertTitle>
                  </Stack>
                  <AlertDescription textAlign="left">
                    連携する場合は、
                    <NextLink href="/settings/account">
                      <Link color="teal.500">アカウント設定</Link>
                    </NextLink>
                    ページのサービス連携で設定してください。
                  </AlertDescription>
                </Alert>
              )}
            </TabPanel>
            <TabPanel>
              <Heading size="lg" my={8}>
                プレイリスト(Apple Music)
              </Heading>
              {isAuthorizedApple ? (
                !isLoadingApple && applePlaylists.length > 0 ? (
                  <SimpleGrid columns={[2, 3, 4]} spacing={10}>
                    {applePlaylists.map((playlist) => (
                      <PlaylistPreviewCard key={playlist.id} playlist={playlist} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>Apple Musicのプレイリストがありません。</Text>
                )
              ) : (
                <Alert
                  status="warning"
                  flexDirection="column"
                  justifyContent="center"
                  py={8}
                  px={[4, 8]}
                >
                  <Stack direction="row" mb={4}>
                    <AlertIcon m={0} />
                    <AlertTitle>Apple Music未連携</AlertTitle>
                  </Stack>
                  <AlertDescription textAlign="left">
                    連携する場合は、
                    <NextLink href="/settings/account">
                      <Link color="teal.500">アカウント設定</Link>
                    </NextLink>
                    ページのサービス連携で設定してください。
                  </AlertDescription>
                </Alert>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

export default PlayListImportPage
