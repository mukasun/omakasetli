import { NextPage } from 'next'
import Link from 'next/link'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { Container, Heading, Flex, Spacer, Button } from '@chakra-ui/react'

const PlayListPage: NextPage = () => {
  useRequireUser()

  return (
    <>
      <SEOMeta title="マイプレイリスト" />
      <Container maxW="container.lg" pt={4}>
        <Flex>
          <Heading size="lg">マイプレイリスト</Heading>
          <Spacer />
          <Link href="/settings/playlist/import" passHref>
            <Button size="sm" colorScheme="teal">
              楽曲を追加する
            </Button>
          </Link>
        </Flex>
      </Container>
    </>
  )
}

export default PlayListPage
