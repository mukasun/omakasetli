import { SpotifyPlaylist } from '@/models/Spotify'
import { Image } from '@chakra-ui/react'

interface Props {
  playlist?: SpotifyPlaylist
}

const PlaylistPreviewCard: React.FC<Props> = ({ playlist }) => {
  return (
    <div className="text-center">
      {playlist.images.length > 0 && <Image src={playlist.images[0]?.url} />}
      {playlist.name}
      <div className="text-gray-500 text-xs">{playlist.tracks.total} TRACKS</div>
    </div>
  )
}

export default PlaylistPreviewCard
