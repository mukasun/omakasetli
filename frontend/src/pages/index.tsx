import { SEOMeta } from '@/components/SEOMeta'
import { NextPage } from 'next'
import { Logo } from '@/components/svg/Logo'
import { Box, Image, Heading, Text, HStack, VStack, Flex, Button } from '@chakra-ui/react'
import { FaSpotify, FaApple } from 'react-icons/fa'
import { config } from '@@/site.config'

const Page: NextPage = () => {
  return (
    <>
      <SEOMeta
        title={`${config.siteMeta.title} | ${config.siteMeta.catchcopy}`}
        path="/"
        removeSiteNameFromTitle={true}
      />
      <Box background="#FFF5E3">
        <Flex justify="center" align="center" flexDirection={['column', 'row']} py={12}>
          <VStack align="center" spacing={8} mr={12}>
            <Heading size="xl">
              グループで最適な
              <br />
              楽曲リストを自動作成
            </Heading>
            <Logo />
          </VStack>
          <Image width={240} src="/images/lp_mv.png" alt="セットリスト" />
        </Flex>
        {/* <Heading textAlign="center">FEATURES</Heading> */}
        <Heading textAlign="center">HOW TO USE</Heading>
        <Box maxW={960} mx="auto">
          <Flex justify="center" align="center" flexDirection={['column', 'row']} p={4}>
            <VStack align="start" px={2}>
              <HStack align="center">
                <div className="circle-number">1</div>
                <Heading size="md">ユーザー登録&amp;サービス連携</Heading>
              </HStack>
              <Text mb={4}>
                Googleアカウントでユーザー登録をします。
                <br />
                また、楽曲データ取得のために以下の音楽配信サービスと連携することができます。
              </Text>
              <HStack align="center" my={4} spacing={8}>
                <Button
                  bg="#84BD00"
                  as="div"
                  color="#fff"
                  _hover={{ bg: '#84BD00' }}
                  leftIcon={<FaSpotify />}
                  isFullWidth
                >
                  Spotify
                </Button>
                <Button
                  bg="#000"
                  as="div"
                  px={8}
                  color="#fff"
                  _hover={{ bg: '#000' }}
                  leftIcon={<FaApple />}
                  isFullWidth
                >
                  Apple Music
                </Button>
              </HStack>
            </VStack>
            <Image width={[240, 220]} src="/images/step1.png" alt="ユーザー登録" px={2} />
          </Flex>
          <Flex justify="center" align="center" flexDirection={['column', 'row']} p={4}>
            <Image
              width={[240, 220]}
              src="/images/step2.png"
              alt="楽曲インポート"
              order={[2, 1]}
              px={2}
            />
            <VStack align="start" order={[1, 2]} px={2}>
              <HStack align="center">
                <div className="circle-number">2</div>
                <Heading size="md">楽曲インポート</Heading>
              </HStack>
              <Text mb={4}>連携したサービスのプレイリストから楽曲をインポートします。</Text>
            </VStack>
          </Flex>
          <Flex justify="center" align="center" flexDirection={['column', 'row']} p={4}>
            <VStack align="start" px={2}>
              <HStack align="center">
                <div className="circle-number">3</div>
                <Heading size="md">ルーム作成/入室</Heading>
              </HStack>
              <Text mb={4}>
                オーナーはルーム名を入力してルームを作成することができます。
                <br />
                参加者はルームNo.で検索して入室することができます。
              </Text>
            </VStack>
            <Image width={[240, 220]} src="/images/step3.png" alt="ルーム作成/入室" px={2} />
          </Flex>
          <Flex justify="center" align="center" flexDirection={['column', 'row']} p={4}>
            <Image
              width={[240, 220]}
              src="/images/step4.png"
              alt="セットリスト生成"
              order={[2, 1]}
              px={2}
            />
            <VStack align="start" px={2} order={[1, 2]}>
              <HStack align="center">
                <div className="circle-number">4</div>
                <Heading size="md">セットリスト生成</Heading>
              </HStack>
              <Text mb={4}>
                ルームの参加者が揃ったら予定時間を入力してセットリストを作成します。
                <br />
                アニーリングマシンによって最適なセットリストが生成されます。
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

export default Page
