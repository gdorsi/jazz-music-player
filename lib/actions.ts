import { getAudioFileData } from "@/lib/utils/getAudioFileData"
import { FileStream, Group, co } from "jazz-tools"
import { MusicTrack, MusicTrackWaveform, MusicAppAccount, Playlist } from "@/lib/schema"

export async function uploadMusicTracks(files: Iterable<File>, isExampleTrack = false) {
  const { root } = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        rootPlaylist: {
          tracks: true,
        },
        globalTracksFeed: true,
      },
    },
  })

  for (const file of files) {
    // Create a group for each track to enable sharing
    const group = Group.create()

    const data = await getAudioFileData(file)

    // Create a FileStream for the audio file
    const fileStream = await FileStream.createFromBlob(file, { owner: group })

    const musicTrack = MusicTrack.create(
      {
        file: fileStream,
        duration: data.duration,
        waveform: MusicTrackWaveform.create({ data: data.waveform }, { owner: group }),
        title: file.name,
        isExampleTrack,
      },
      { owner: group },
    )

    // Add the track to the user's root playlist
    root.rootPlaylist.tracks.push(musicTrack)

    // Add to global feed for discovery (only non-example tracks)
    if (!isExampleTrack && root.globalTracksFeed) {
      root.globalTracksFeed.push(musicTrack)
    }
  }
}

export async function createNewPlaylist() {
  const { root } = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        playlists: true,
      },
    },
  })

  // Create a group for the playlist to enable sharing
  const playlistGroup = Group.create()

  const playlist = Playlist.create(
    {
      title: "New Playlist",
      tracks: co.list(MusicTrack).create([], { owner: playlistGroup }),
    },
    { owner: playlistGroup },
  )

  // Add the playlist to the user's playlists
  root.playlists.push(playlist)

  return playlist
}

export async function addTrackToPlaylist(playlist: Playlist, track: MusicTrack) {
  const alreadyAdded = playlist.tracks?.some((t) => t?.id === track.id || t?._refs.sourceTrack?.id === track.id)

  if (alreadyAdded) return

  // Check if the track has been created after the Group inheritance was introduced
  if (track._owner._type === "Group" && playlist._owner._type === "Group") {
    // Extend the track with the Playlist group to make the music track
    // visible to the Playlist user
    const trackGroup = track._owner.castAs(Group)
    trackGroup.extend(playlist._owner.castAs(Group))

    playlist.tracks?.push(track)
    return
  }
}

export async function removeTrackFromPlaylist(playlist: Playlist, track: MusicTrack) {
  const notAdded = !playlist.tracks?.some((t) => t?.id === track.id || t?._refs.sourceTrack?.id === track.id)

  if (notAdded) return

  if (track._owner._type === "Group" && playlist._owner._type === "Group") {
    const trackGroup = track._owner.castAs(Group)
    await trackGroup.revokeExtend(playlist._owner.castAs(Group))

    const index = playlist.tracks?.findIndex((t) => t?.id === track.id || t?._refs.sourceTrack?.id === track.id) ?? -1
    if (index > -1) {
      playlist.tracks?.splice(index, 1)
    }
    return
  }
}

export async function updatePlaylistTitle(playlist: Playlist, title: string) {
  playlist.title = title
}

export async function updateMusicTrackTitle(track: MusicTrack, title: string) {
  track.title = title
}

export async function updateActivePlaylist(playlist?: Playlist) {
  const { root } = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        activePlaylist: true,
        rootPlaylist: true,
      },
    },
  })

  root.activePlaylist = playlist ?? root.rootPlaylist
}

export async function updateActiveTrack(track: MusicTrack) {
  const { root } = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {},
    },
  })

  root.activeTrack = track
}

export async function onAnonymousAccountDiscarded(anonymousAccount: MusicAppAccount) {
  const { root: anonymousAccountRoot } = await anonymousAccount.ensureLoaded({
    resolve: {
      root: {
        rootPlaylist: {
          tracks: {
            $each: true,
          },
        },
      },
    },
  })

  const me = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        rootPlaylist: {
          tracks: true,
        },
      },
    },
  })

  for (const track of anonymousAccountRoot.rootPlaylist.tracks) {
    if (track.isExampleTrack) continue

    const trackGroup = track._owner.castAs(Group)
    trackGroup.addMember(me, "admin")

    me.root.rootPlaylist.tracks.push(track)
  }
}

export async function deletePlaylist(playlistId: string) {
  const { root } = await MusicAppAccount.getMe().ensureLoaded({
    resolve: {
      root: {
        playlists: true,
      },
    },
  })

  const index = root.playlists.findIndex((p) => p?.id === playlistId)
  if (index > -1) {
    root.playlists.splice(index, 1)
  }
}
