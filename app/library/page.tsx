"use client"

import { useAccount, useCoState } from "jazz-react"
import { MusicAppAccount, Playlist } from "@/lib/schema"
import { useMediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { AppSidebar } from "@/components/AppSidebar"
import { MusicTrackList } from "@/components/MusicTrackList"
import { PlayerControls } from "@/components/PlayerControls"
import { AuthButton } from "@/components/AuthButton"
import { FileUploadButton } from "@/components/FileUploadButton"
import { Button } from "@/components/ui/button"
import { uploadMusicTracks, createNewPlaylist } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useUploadExampleData } from "@/lib/hooks/useUploadExampleData"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function LibraryPage() {
  const router = useRouter()
  const mediaPlayer = useMediaPlayer()

  // Load example data on first visit
  useUploadExampleData()

  const { me } = useAccount(MusicAppAccount, {
    resolve: { root: { rootPlaylist: true, playlists: true } },
  })

  const playlist = useCoState(Playlist, me?.root._refs.rootPlaylist.id, {
    resolve: { tracks: true },
  })

  async function handleFileLoad(files: FileList) {
    await uploadMusicTracks(files)
  }

  async function handleCreatePlaylist() {
    const playlist = await createNewPlaylist()
    router.push(`/playlist/${playlist.id}`)
  }

  if (!me) return <div>Loading...</div>

  return (
    <div className="flex h-screen text-gray-800 bg-blue-50">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold text-blue-800">My Library</h1>
          <div className="ml-auto flex items-center space-x-4">
            <FileUploadButton onFileLoad={handleFileLoad}>Add file</FileUploadButton>
            <Button onClick={handleCreatePlaylist}>New playlist</Button>
            <AuthButton />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <MusicTrackList playlist={playlist} mediaPlayer={mediaPlayer} isRootPlaylist={true} />
        </main>

        <PlayerControls mediaPlayer={mediaPlayer} />
      </SidebarInset>
    </div>
  )
}
