"use client"

import { useAccount, useCoState } from "jazz-react"
import { MusicAppAccount, GlobalTracksFeed } from "@/lib/schema"
import { useMediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { AppSidebar } from "@/components/AppSidebar"
import { PlayerControls } from "@/components/PlayerControls"
import { AuthButton } from "@/components/AuthButton"
import { DiscoverTrackList } from "@/components/DiscoverTrackList"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DiscoverPage() {
  const mediaPlayer = useMediaPlayer()
  const [searchQuery, setSearchQuery] = useState("")

  const { me } = useAccount(MusicAppAccount, {
    resolve: { root: { globalTracksFeed: true } },
  })

  const globalFeed = useCoState(GlobalTracksFeed, me?.root._refs.globalTracksFeed?.id, {
    resolve: true,
  })

  if (!me) return <div>Loading...</div>

  return (
    <div className="flex h-screen text-gray-800 bg-blue-50">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-2xl font-bold text-blue-800">Discover Music</h1>
          <div className="ml-auto">
            <AuthButton />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DiscoverTrackList globalFeed={globalFeed} mediaPlayer={mediaPlayer} searchQuery={searchQuery} />
        </main>

        <PlayerControls mediaPlayer={mediaPlayer} />
      </SidebarInset>
    </div>
  )
}
