import { co, z } from "jazz-tools"

// Define the waveform data structure for visualizing audio
export const MusicTrackWaveform = co.map({
  data: z.array(z.number()),
})

// Define the music track structure
export const MusicTrack = co.map({
  title: z.string(),
  duration: z.number(),
  waveform: MusicTrackWaveform,
  file: co.fileStream(),
  isExampleTrack: z.optional(z.boolean()),

  // Self-reference for source tracks
  get sourceTrack(): z.ZodOptional<typeof MusicTrack> {
    return z.optional(MusicTrack)
  },
})

// Define a playlist structure
export const Playlist = co.map({
  title: z.string(),
  tracks: co.list(MusicTrack),
})

// Define a global tracks feed for discovery
export const GlobalTracksFeed = co.list(MusicTrack)

// Define the account root structure to store user-specific data
export const MusicAppRoot = co.map({
  rootPlaylist: Playlist,
  playlists: co.list(Playlist),
  activeTrack: z.optional(MusicTrack),
  activePlaylist: Playlist,
  exampleDataLoaded: z.optional(z.boolean()),
  globalTracksFeed: GlobalTracksFeed,
})

// Define the account schema with migration logic
export const MusicAppAccount = co
  .account({
    profile: co.profile(),
    root: MusicAppRoot,
  })
  .withMigration((account) => {
    if (account.root === undefined) {
      const tracks = co.list(MusicTrack).create([])
      const rootPlaylist = Playlist.create({
        tracks,
        title: "",
      })

      // Create a global tracks feed
      const globalTracksFeed = GlobalTracksFeed.create([])

      account.root = MusicAppRoot.create({
        rootPlaylist,
        playlists: co.list(Playlist).create([]),
        activeTrack: undefined,
        activePlaylist: rootPlaylist,
        exampleDataLoaded: false,
        globalTracksFeed,
      })
    }
  })
