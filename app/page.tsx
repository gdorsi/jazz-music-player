"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/discover")
  }, [router])

  return <div className="flex items-center justify-center h-screen">Redirecting to discover page...</div>
}
