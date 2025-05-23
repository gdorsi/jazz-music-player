"use client"

import { createContext, useContext } from "react"

export class AudioManager {
  mediaElement: HTMLAudioElement | null = null
  audioObjectURL: string | null = null

  constructor() {
    if (typeof window === 'undefined') {
      return
    }
    const mediaElement = new Audio()
    this.mediaElement = mediaElement
  }

  async unloadCurrentAudio() {
    if (this.audioObjectURL) {
      URL.revokeObjectURL(this.audioObjectURL)
      this.audioObjectURL = null
    }
  }

  async loadAudio(file: Blob) {
    if (!this.mediaElement) {
      return
    }
    await this.unloadCurrentAudio()

    const { mediaElement } = this
    const audioObjectURL = URL.createObjectURL(file)

    this.audioObjectURL = audioObjectURL
    mediaElement.src = audioObjectURL
  }

  play() {
    if (this.mediaElement?.ended) {
      this.mediaElement.currentTime = 0
    }
    this.mediaElement?.play()
  }

  pause() {
    this.mediaElement?.pause()
  }

  destroy() {
    this.unloadCurrentAudio()
    this.mediaElement?.pause()
  }
}

const context = createContext<AudioManager>(new AudioManager())

export function useAudioManager() {
  return useContext(context)
}

export const AudioManagerProvider = context.Provider
