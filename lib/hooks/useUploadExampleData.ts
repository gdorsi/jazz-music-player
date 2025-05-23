"use client"

import { MusicAppAccount } from "@/lib/schema"
import { useAccount } from "jazz-react"
import { useEffect } from "react"
import { uploadMusicTracks } from "@/lib/actions"

export function useUploadExampleData() {
  const { me } = useAccount()

  useEffect(() => {
    uploadOnboardingData()
  }, [me?.id])
}

async function uploadOnboardingData() {
  const me = await MusicAppAccount.getMe().ensureLoaded({
    resolve: { root: true },
  })

  if (me.root.exampleDataLoaded) return

  me.root.exampleDataLoaded = true

  try {
    // This would normally fetch an example MP3, but we'll use a placeholder
    const trackFile = new File(
      [new Uint8Array(1000)], // Dummy data
      "Example song.mp3",
      { type: "audio/mpeg" },
    )

    await uploadMusicTracks([trackFile], true)
  } catch (error) {
    me.root.exampleDataLoaded = false
    console.error("Failed to load example data:", error)
  }
}
