"use client"

import { useAcceptInvite, useIsAuthenticated } from "jazz-react"
import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { MusicAppAccount, Playlist } from "@/lib/schema"

export default function InvitePage() {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()

  useAcceptInvite({
    invitedObjectSchema: Playlist,
    onAccept: useCallback(
      async (playlistId: string) => {
        const playlist = await Playlist.load(playlistId, {})

        const me = await MusicAppAccount.getMe().ensureLoaded({
          resolve: {
            root: {
              playlists: true,
            },
          },
        })

        if (playlist && !me.root.playlists.some((item) => playlist.id === item?.id)) {
          me.root.playlists.push(playlist)
        }

        router.push("/playlist/" + playlistId)
      },
      [router],
    ),
  })

  return isAuthenticated ? (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Accepting invite...</p>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Please sign in to accept the invite.</p>
    </div>
  )
}
