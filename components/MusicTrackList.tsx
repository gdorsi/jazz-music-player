"use client"

import type { Playlist } from "@/lib/schema"
import type { MediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { MusicTrackRow } from "./MusicTrackRow"
import type { Loaded } from "jazz-tools"

interface MusicTrackListProps {
  playlist: Loaded<typeof Playlist> | null | undefined
  mediaPlayer: MediaPlayer
  isRootPlaylist: boolean
}

export function MusicTrackList({ playlist, mediaPlayer, isRootPlaylist }: MusicTrackListProps) {
  if (!playlist) return <div>Loading playlist...</div>

  if (playlist.tracks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No tracks in this playlist</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {playlist.tracks.map(
        (track) =>
          track && (
            <MusicTrackRow
              trackId={track.id}
              key={track.id}
              isLoading={mediaPlayer.loading === track.id}
              isPlaying={mediaPlayer.activeTrackId === track.id}
              onClick={() => {
                mediaPlayer.setActiveTrack(track, playlist)
              }}
              showAddToPlaylist={isRootPlaylist}
            />
          ),
      )}
    </ul>
  )
}
