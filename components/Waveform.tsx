"use client"

import { type MusicTrack, MusicTrackWaveform } from "@/lib/schema"
import { usePlayerCurrentTime } from "@/lib/hooks/usePlayerCurrentTime"
import { cn } from "@/lib/utils"
import { useCoState } from "jazz-react"
import type { Loaded } from "jazz-tools"

export function Waveform(props: {
  track: Loaded<typeof MusicTrack>
  height: number
}) {
  const { track, height } = props
  const waveformData = useCoState(MusicTrackWaveform, track._refs.waveform?.id)?.data
  const duration = track.duration

  const currentTime = usePlayerCurrentTime()

  if (!waveformData) {
    return (
      <div
        style={{
          height,
        }}
      />
    )
  }

  const barCount = waveformData.length
  const activeBar = Math.ceil(barCount * (currentTime.value / duration))

  function seek(i: number) {
    currentTime.setValue((i / barCount) * duration)
  }

  return (
    <div
      className="flex justify-center items-end w-full"
      style={{
        height,
        gap: 1,
      }}
    >
      {waveformData.map((value, i) => (
        <button
          type="button"
          key={i}
          onClick={() => seek(i)}
          className={cn(
            "w-1 transition-colors rounded-none rounded-t-lg min-h-1",
            activeBar >= i ? "bg-gray-500" : "bg-gray-300",
            "hover:bg-black hover:border-1 hover:border-solid hover:border-black",
            "focus-visible:outline-black focus:outline-none",
          )}
          style={{
            height: height * value,
          }}
          aria-label={`Seek to ${(i / barCount) * duration} seconds`}
        />
      ))}
    </div>
  )
}
