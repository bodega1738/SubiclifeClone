"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { PartnersDirectory } from "@/components/partners/partners-directory"

export default function PartnersPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const defaultCategory = user?.preferences?.interests?.[0] || 'all'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PartnersDirectory defaultCategory={defaultCategory} />
    </div>
  )
}
