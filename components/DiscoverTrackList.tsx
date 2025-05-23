"use client"
import type { GlobalTracksFeed } from "@/lib/schema"
import type { MediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { DiscoverTrackRow } from "./DiscoverTrackRow"
import type { Loaded } from "jazz-tools"
import { useMemo } from "react"

interface DiscoverTrackListProps {
  globalFeed: Loaded<typeof GlobalTracksFeed> | null | undefined
  mediaPlayer: MediaPlayer
  searchQuery: string
}

export function DiscoverTrackList({ globalFeed, mediaPlayer, searchQuery }: DiscoverTrackListProps) {
  // Get all tracks from the global feed
  const allTracks = useMemo(() => {
    if (!globalFeed) return []
    return globalFeed.filter((track) => track !== null)
  }, [globalFeed])

  // Filter tracks based on search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks

    const query = searchQuery.toLowerCase()
    return allTracks.filter((track) => track?.title.toLowerCase().includes(query))
  }, [allTracks, searchQuery])

  if (!globalFeed) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (filteredTracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v6a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {searchQuery ? (
          <div>
            <p className="text-gray-600 text-lg mb-2">No tracks found</p>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-lg mb-2">No tracks available yet</p>
            <p className="text-gray-500">Upload some music to get started!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{searchQuery ? `Search Results` : `All Tracks`}</h2>
        <span className="text-sm text-gray-500">{filteredTracks.length} tracks</span>
      </div>
      <ul className="space-y-2">
        {filteredTracks.map((track, index) => (
          <DiscoverTrackRow key={track?.id || index} track={track} mediaPlayer={mediaPlayer} index={index} />
        ))}
      </ul>
    </div>
  )
}
