"use client"

import { useRef } from "react"
import { useAudioManager } from "@/lib/utils/AudioManager"

export function usePlayMedia() {
  const audioManager = useAudioManager()

  const previousMediaLoad = useRef<Promise<unknown> | undefined>(undefined)

  async function playMedia(file: Blob) {
    // Wait for the previous load to finish
    // to avoid to incur into concurrency issues
    await previousMediaLoad.current

    const promise = audioManager.loadAudio(file)

    previousMediaLoad.current = promise

    await promise

    audioManager.play()
  }

  return playMedia
}
