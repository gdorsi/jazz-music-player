"use client"

import type { MusicTrack } from "@/lib/schema"
import type { MediaPlayer } from "@/lib/hooks/useMediaPlayer"
import { usePlayState } from "@/lib/hooks/usePlayState"
import { cn } from "@/lib/utils"
import { Play, Pause, User } from "lucide-react"
import { formatDuration } from "@/lib/utils/formatDuration"
import type { Loaded } from "jazz-tools"

interface DiscoverTrackRowProps {
  track: Loaded<typeof MusicTrack> | null
  mediaPlayer: MediaPlayer
  index: number
}

export function DiscoverTrackRow({ track, mediaPlayer, index }: DiscoverTrackRowProps) {
  const playState = usePlayState()

  if (!track) return null

  const isPlaying = playState.value === "play" && mediaPlayer.activeTrackId === track.id
  const isLoading = mediaPlayer.loading === track.id

  function handleTrackClick() {
    if (mediaPlayer.activeTrackId === track.id) {
      playState.toggle()
    } else {
      mediaPlayer.setActiveTrack(track)
    }
  }

  return (
    <li
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer group",
        isPlaying && "bg-blue-100",
      )}
      onClick={handleTrackClick}
    >
      {/* Track Number / Play Button */}
      <div className="flex items-center justify-center w-8 h-8">
        {isLoading ? (
          <div className="animate-spin text-blue-600">⟳</div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleTrackClick()
            }}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all",
              isPlaying ? "bg-blue-600 text-white" : "group-hover:bg-blue-600 group-hover:text-white text-gray-600",
            )}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
          {track.isExampleTrack && (
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Example</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-3 h-3" />
          <span>Music Lover</span>
          <span>•</span>
          <span>{formatDuration(track.duration)}</span>
        </div>
      </div>

      {/* Waveform Preview */}
      <div className="hidden md:flex items-center w-32 h-8">
        {track.waveform?.data && (
          <div className="flex items-end w-full h-full gap-0.5">
            {track.waveform.data.slice(0, 20).map((value, i) => (
              <div
                key={i}
                className={cn("flex-1 rounded-sm transition-colors", isPlaying ? "bg-blue-600" : "bg-gray-300")}
                style={{ height: `${Math.max(2, value * 100)}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </li>
  )
}
