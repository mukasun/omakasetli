import { memo } from 'react'
import { Track } from '@/collections/users/tracks'
import DataTable, { IDataTableColumn, IDataTableStyles } from 'react-data-table-component'
import { millisToMinutesAndSeconds } from '@/libs/utils'
import {
  Flex,
  Text,
  Image,
  Box,
  IconButton,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
} from '@chakra-ui/react'
import { MdAccessTime, MdStar } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface TracksTableProps {
  tracks: Track[]
  isLoading: boolean
  onEditTrack: (track: Track) => void
  onDeleteTrack: (track: Track) => void
}

interface TracksTableMainCellProps {
  track: Track
}

interface TracksTableActionButtonProps {
  track: Track
  onEdit: (track: Track) => void
  onDelete: (track: Track) => void
}

const TracksTableMainCell: React.FC<TracksTableMainCellProps> = memo(({ track }) => {
  return (
    <Flex align="center" maxW="100%">
      <Image
        mr={4}
        boxSize="40px"
        borderRadius={4}
        src={track.smallImage}
        alt={track.name}
        border="solid 1px #eee"
      />
      <Box minWidth={0}>
        <Text fontSize="sm" isTruncated>
          {track.name}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {track.artist}
        </Text>
      </Box>
    </Flex>
  )
})

const TracksTableActionButton: React.FC<TracksTableActionButtonProps> = memo(
  ({ track, onEdit, onDelete }) => {
    return (
      <Menu placement="top">
        <MenuButton
          as={IconButton}
          aria-label="アクション"
          variant="ghost"
          icon={<BsThreeDotsVertical />}
        />
        <MenuList>
          <MenuItem onClick={() => onEdit(track)}>好みを変更する</MenuItem>
          <MenuItem onClick={() => onDelete(track)}>プレイリストから削除する</MenuItem>
          <LinkBox as={MenuItem}>
            <LinkOverlay href={track.url} isExternal>
              {track.platform === 'spotify' ? <>Spotifyで開く</> : <>Apple Musicで開く</>}
            </LinkOverlay>
          </LinkBox>
        </MenuList>
      </Menu>
    )
  }
)

export const TracksTable: React.FC<TracksTableProps> = memo(
  ({ tracks, isLoading, onEditTrack, onDeleteTrack }) => {
    const columns: IDataTableColumn<Track>[] = [
      {
        name: '楽曲',
        selector: 'name',
        cell: (row, _) => <TracksTableMainCell track={row} />,
      },
      {
        name: '好み',
        selector: 'priority',
        width: '80px',
        sortable: true,
        center: true,
        cell: (row, _) => (
          <>
            {[...Array(row.priority)].map((_, i) => (
              <MdStar key={i} color="orange" />
            ))}
          </>
        ),
      },
      {
        name: <MdAccessTime size={16} />,
        selector: 'durationMs',
        width: '48px',
        hide: 'sm',
        sortable: true,
        format: (row, _) => millisToMinutesAndSeconds(row.durationMs),
      },

      {
        name: '',
        width: '48px',
        cell: (row, _) => (
          <TracksTableActionButton track={row} onEdit={onEditTrack} onDelete={onDeleteTrack} />
        ),
      },
    ]

    const customStyles: IDataTableStyles = {
      table: {
        style: {
          overflow: 'hidden',
        },
      },
      rows: {
        style: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
      cells: {
        style: {
          paddingLeft: 4,
          paddingRight: 4,
        },
      },
      tableWrapper: {
        style: {
          tableLayout: 'fixed',
        },
      },
    }

    return (
      <DataTable
        columns={columns}
        data={tracks}
        customStyles={customStyles}
        noHeader
        persistTableHead
        pagination
        paginationPerPage={50}
        paginationComponentOptions={{ noRowsPerPage: true }}
        paginationRowsPerPageOptions={[]}
        noDataComponent="楽曲がありません。"
        progressPending={isLoading}
        progressComponent={
          <Stack mt={4} w="100%" spacing={4}>
            {[...Array(10)].map((_, i) => (
              <Flex align="center" key={i}>
                <Skeleton w="40px" h="40px" mr={4} />
                <Skeleton flexGrow={1} h="40px" />
              </Flex>
            ))}
          </Stack>
        }
      />
    )
  }
)
