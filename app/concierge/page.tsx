"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { ConciergeChat } from "@/components/concierge/concierge-chat"

export default function ConciergePage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-white pb-20">
      <ConciergeChat />
    </div>
  )
}
