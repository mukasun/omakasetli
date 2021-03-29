import { useMemo } from 'react'
import { Member } from '@/collections/rooms/members'
import { Setlist } from '@/collections/rooms/setlists'
import {
  Image,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts'
import { millisToMinutesAndSeconds, orgRound } from '@/libs/utils'

interface Props {
  setlist: Setlist
  members: Member[]
}

export const SetlistViewer: React.FC<Props> = ({ members, setlist }) => {
  const chartData = useMemo(() => {
    if (setlist.scores.length !== members.length) return null
    return setlist.scores.map((s, i) => ({
      member: members[i].displayName,
      value: s,
    }))
  }, [setlist, members])

  return (
    <Tabs align="center" isFitted>
      <TabList mb={4}>
        <Tab>構成曲</Tab>
        <Tab>満足度</Tab>
      </TabList>
      <TabPanels H={405} maxH={405} overflow="scroll">
        <TabPanel px={0}>
          <Table variant="simple" style={{ tableLayout: 'fixed' }}>
            <Thead>
              <Tr>
                <Th px={2}>楽曲</Th>
                <Th w={20} textAlign="center">
                  時間
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {setlist.tracks.map((track, index) => (
                <Tr key={index}>
                  <Td px={2}>
                    <Flex align="center" maxW="100%">
                      <Image
                        mr={4}
                        boxSize="40px"
                        borderRadius={4}
                        src={track.small_image}
                        alt={track.name}
                        border="solid 1px #eee"
                      />
                      <Box minWidth={0}>
                        <Text fontSize="sm" isTruncated>
                          {track.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" isTruncated>
                          {track.artist}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td px={2} textAlign="center">
                    <Text fontSize="sm">{millisToMinutesAndSeconds(track.duration_ms)}</Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TabPanel>
        <TabPanel px={0}>
          <StatGroup mb={4}>
            <Stat>
              <StatLabel>合計</StatLabel>
              <StatNumber>{setlist.scoreSum}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>平均</StatLabel>
              <StatNumber>{orgRound(setlist.scoreAvg, 10)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>分散</StatLabel>
              <StatNumber>{orgRound(setlist.scoreVar, 10)}</StatNumber>
            </Stat>
          </StatGroup>
          {chartData ? (
            <RadarChart width={300} height={300} data={chartData}>
              <defs>
                <linearGradient id="gradationColor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff0000" />
                  <stop offset="100%" stopColor="#ffa500" />
                </linearGradient>
              </defs>
              <PolarGrid />
              <PolarAngleAxis dataKey="member" fontSize={13} />
              <Radar
                name="満足度"
                dataKey="value"
                stroke="#ffa500"
                fill="url(#gradationColor)"
                fillOpacity={0.6}
              />
            </RadarChart>
          ) : null}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
