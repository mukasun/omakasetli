import { NextPage } from 'next'

import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { FaSpotify, FaApple } from 'react-icons/fa'
import { MdSearch } from 'react-icons/md'
import { Container, Tabs, TabList, Tab, TabPanel, TabPanels, Text } from '@chakra-ui/react'

const PlayListImportPage: NextPage = () => {
  useRequireUser()

  return (
    <>
      <SEOMeta title="マイプレイリスト" />
      <Container maxW="container.lg">
        <Tabs align="center" isFitted>
          <TabList>
            <Tab>
              <MdSearch size={24} />
              <Text ml={1} fontWeight={600} display={['none', 'block']}>
                検索
              </Text>
            </Tab>
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
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

export default PlayListImportPage
