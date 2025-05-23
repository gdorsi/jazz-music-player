"use client"

import { JazzProvider } from "jazz-react";
import { MusicAppAccount } from "@/lib/schema";
import { Toaster } from "@/components/ui/toaster";
import { JazzInspector } from "jazz-inspector";
import { onAnonymousAccountDiscarded } from "@/lib/actions";
import { AudioManager, AudioManagerProvider } from "@/lib/utils/AudioManager";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <JazzProvider
      sync={{
        peer: "wss://cloud.jazz.tools/?key=you@example.com",
      }}
      AccountSchema={MusicAppAccount}
      defaultProfileName="Music Lover"
      onAnonymousAccountDiscarded={onAnonymousAccountDiscarded}
    >
      <SidebarProvider>
        <AudioManagerProvider value={new AudioManager()}>
          {children}
          <Toaster />
          <JazzInspector position="right" />
      </AudioManagerProvider>
      </SidebarProvider>
    </JazzProvider>
  );
}
