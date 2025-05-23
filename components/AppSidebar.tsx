"use client"

import { MusicAppAccount } from "@/lib/schema"
import { deletePlaylist } from "@/lib/actions"
import { useAccount } from "jazz-react"
import { Trash2, Compass, Music, Plus } from "lucide-react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarRail,
} from "@/components/ui/sidebar"
import { createNewPlaylist } from "@/lib/actions"

export function AppSidebar() {
  const { playlistId } = useParams<{ playlistId?: string }>()
  const router = useRouter()
  const pathname = usePathname()

  const { me } = useAccount(MusicAppAccount, {
    resolve: { root: { playlists: { $each: true } } },
  })

  async function handleDeletePlaylist(playlistId: string) {
    if (confirm("Are you sure you want to delete this playlist?")) {
      await deletePlaylist(playlistId)
      router.push(`/`)
    }
  }

  async function handleCreatePlaylist() {
    const playlist = await createNewPlaylist()
    router.push(`/playlist/${playlist.id}`)
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="bg-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 18V5l12-2v13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 15H3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM18 13h-3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Music Player</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/discover"}>
                  <Link href="/discover">
                    <Compass className="size-4" />
                    <span>Discover</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/library"}>
                  <Link href="/library">
                    <Music className="size-4" />
                    <span>My Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Playlists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleCreatePlaylist}>
                  <Plus className="size-4" />
                  <span>New Playlist</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {me?.root.playlists.map((playlist, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={playlist.id === playlistId}>
                    <Link href={`/playlist/${playlist.id}`}>
                      <Music className="size-4" />
                      <span>{playlist.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {playlist.id === playlistId && (
                    <SidebarMenuAction
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete {playlist.title}</span>
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
