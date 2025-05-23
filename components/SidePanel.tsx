"use client"

import { MusicAppAccount } from "@/lib/schema"
import { deletePlaylist } from "@/lib/actions"
import { useAccount } from "jazz-react"
import { Trash2, Compass, Music } from "lucide-react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export function SidePanel() {
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

  return (
    <aside className="w-64 p-6 bg-white overflow-y-auto">
      <div className="flex items-center mb-1">
        <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5l12-2v13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M6 15H3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM18 13h-3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"
            fill="#3b82f6"
          />
        </svg>
        <span className="text-xl font-bold text-blue-600">Music Player</span>
      </div>
      <nav>
        <h2 className="mb-2 text-sm font-semibold text-gray-600">Browse</h2>
        <ul className="space-y-1 mb-4">
          <li>
            <Link
              href="/discover"
              className={`flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-blue-100 ${
                pathname === "/discover" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <Compass className="w-4 h-4" />
              Discover
            </Link>
          </li>
          <li>
            <Link
              href="/library"
              className={`flex items-center gap-2 px-2 py-1 text-sm rounded hover:bg-blue-100 ${
                pathname === "/library" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              <Music className="w-4 h-4" />
              My Library
            </Link>
          </li>
        </ul>

        <h2 className="mb-2 text-sm font-semibold text-gray-600">Playlists</h2>
        <ul className="space-y-1">
          {me?.root.playlists.map((playlist, index) => (
            <li
              key={index}
              className={`px-2 py-1 flex transition-all duration-300 rounded items-center justify-between ${
                playlist.id === playlistId ? "bg-blue-100" : ""
              }`}
            >
              <Link href={`/playlist/${playlist.id}`} className={`w-full text-sm`}>
                {playlist.title}
              </Link>
              {playlist.id === playlistId && (
                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="ml-2 text-red-600 hover:text-red-800 animate-in fade-in scale-in duration-200"
                  aria-label={`Delete ${playlist.title}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
