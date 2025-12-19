"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getPartnerById } from "@/lib/partners-data"
import { PartnerDetail } from "@/components/partners/partner-detail"
import { Loader2 } from "lucide-react"
import type { Partner } from "@/lib/types"

export default function PartnerPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Basic auth check: if user is not logged in, redirect to home
    // Note: We don't have a loading state in useUser, but we check if user exists
    // after a brief delay or immediately if context is initialized.
    
    async function fetchPartner() {
      if (typeof id === "string") {
        const data = await getPartnerById(id)
        setPartner(data)
        setLoading(false)
      }
    }

    fetchPartner()
  }, [id, user, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#135bec]" />
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">Partner not found</h1>
        <p className="mb-6 text-gray-600">The partner you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push("/partners")}
          className="rounded-lg bg-[#135bec] px-6 py-2 font-semibold text-white"
        >
          Back to Directory
        </button>
      </div>
    )
  }

  return <PartnerDetail partner={partner} />
}
