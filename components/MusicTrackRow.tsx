"use client"

import { MusicTrack, MusicAppAccount, type Playlist } from "@/lib/schema"
import { addTrackToPlaylist, removeTrackFromPlaylist } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAccount, useCoState } from "jazz-react"
import type { Loaded } from "jazz-tools"
import { MoreHorizontal, Play, Pause } from "lucide-react"
import { Fragment } from "react"
import { MusicTrackTitleInput } from "./MusicTrackTitleInput"
import { Button } from "@/components/ui/button"

interface MusicTrackRowProps {
  trackId: string
  isLoading: boolean
  isPlaying: boolean
  onClick: (track: Loaded<typeof MusicTrack>) => void
  showAddToPlaylist: boolean
}

export function MusicTrackRow({ trackId, isLoading, isPlaying, onClick, showAddToPlaylist }: MusicTrackRowProps) {
  const track = useCoState(MusicTrack, trackId)

  const { me } = useAccount(MusicAppAccount, {
    resolve: { root: { playlists: { $each: true } } },
  })

  const playlists = me?.root.playlists ?? []

  function handleTrackClick() {
    if (!track) return
    onClick(track)
  }

  function handleAddToPlaylist(playlist: Loaded<typeof Playlist>) {
    if (!track) return
    addTrackToPlaylist(playlist, track)
  }

  function handleRemoveFromPlaylist(playlist: Loaded<typeof Playlist>) {
    if (!track) return
    removeTrackFromPlaylist(playlist, track)
  }

  function deleteTrack() {
    if (!me || !track) return
    const tracks = me.root.rootPlaylist?.tracks
    if (!tracks) return
    const index = tracks.findIndex((t) => t?.id === trackId)
    if (index !== -1) {
      tracks.splice(index, 1)
    }
  }

  return (
    <li
      className={"flex gap-1 hover:bg-slate-200 group py-2 px-2 cursor-pointer rounded-md"}
      onClick={handleTrackClick}
    >
      <button
        className={cn(
          "flex items-center justify-center bg-transparent w-8 h-8 ",
          !isPlaying && "group-hover:bg-slate-300 rounded-full",
        )}
        onClick={handleTrackClick}
        aria-label={`${isPlaying ? "Pause" : "Play"} ${track?.title}`}
      >
        {isLoading ? (
          <div className="animate-spin">⏳</div>
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
      <MusicTrackTitleInput trackId={trackId} />
      <div onClick={(evt) => evt.stopPropagation()}>
        {showAddToPlaylist && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Open ${track?.title} menu`}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                key={`delete`}
                onSelect={async () => {
                  if (!track) return
                  deleteTrack()
                }}
              >
                Delete
              </DropdownMenuItem>
              {playlists.map((playlist, index) => (
                <Fragment key={index}>
                  <DropdownMenuItem key={`add-${index}`} onSelect={() => handleAddToPlaylist(playlist)}>
                    Add to {playlist.title}
                  </DropdownMenuItem>
                  <DropdownMenuItem key={`remove-${index}`} onSelect={() => handleRemoveFromPlaylist(playlist)}>
                    Remove from {playlist.title}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </li>
  )
}
