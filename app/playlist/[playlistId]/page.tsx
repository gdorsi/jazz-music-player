"use client"

import { useParams } from "next/navigation"
import { useAccount, useCoState } from "jazz-react"
import { MusicAppAccount, Playlist } from "@/lib/schema"
import { useMediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { AppSidebar } from "@/components/AppSidebar"
import { MusicTrackList } from "@/components/MusicTrackList"
import { PlayerControls } from "@/components/PlayerControls"
import { AuthButton } from "@/components/AuthButton"
import { updatePlaylistTitle } from "@/lib/actions"
import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function PlaylistPage() {
  const params = useParams()
  const playlistId = params.playlistId as string
  const mediaPlayer = useMediaPlayer()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [localTitle, setLocalTitle] = useState("")

  const { me } = useAccount(MusicAppAccount, {
    resolve: { root: { playlists: true } },
  })

  const playlist = useCoState(Playlist, playlistId, {
    resolve: { tracks: true },
  })

  function handleTitleEdit() {
    if (!playlist) return
    setIsEditingTitle(true)
    setLocalTitle(playlist.title)
  }

  function handleTitleSave() {
    if (!playlist) return
    setIsEditingTitle(false)
    updatePlaylistTitle(playlist, localTitle)
  }

  if (!me) return <div>Loading...</div>
  if (!playlist) return <div>Playlist not found</div>

  return (
    <div className="flex h-screen text-gray-800 bg-blue-50">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {isEditingTitle ? (
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
              className="text-2xl font-bold text-blue-800 bg-transparent border-none outline-none"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold text-blue-800 cursor-pointer hover:text-blue-600"
              onClick={handleTitleEdit}
            >
              {playlist.title}
            </h1>
          )}
          <div className="ml-auto">
            <AuthButton />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <MusicTrackList playlist={playlist} mediaPlayer={mediaPlayer} isRootPlaylist={false} />
        </main>

        <PlayerControls mediaPlayer={mediaPlayer} />
      </SidebarInset>
    </div>
  )
}
