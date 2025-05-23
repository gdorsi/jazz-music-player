import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import JazzProvider from "./JazzProvider"
export const metadata: Metadata = {
  title: "Jazz Music Player",
  description: "A mobile-first music player with offline support",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <JazzProvider>
          {children}
        </JazzProvider>
      </body>
    </html>
  )
}
