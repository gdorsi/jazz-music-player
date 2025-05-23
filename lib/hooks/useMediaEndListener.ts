"use client"

import { useEffect } from "react"
import { useAudioManager } from "@/lib/utils/AudioManager"

export function useMediaEndListener(callback: () => void) {
  const audioManager = useAudioManager()

  useEffect(() => {
    audioManager.mediaElement.addEventListener("ended", callback)

    return () => {
      audioManager.mediaElement.removeEventListener("ended", callback)
    }
  }, [audioManager, callback])
}
