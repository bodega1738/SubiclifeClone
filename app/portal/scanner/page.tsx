"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import QRScanner from "@/components/portal/qr-scanner"
import { ChevronLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MerchantSession } from "@/lib/types"

export default function ScannerPage() {
  const router = useRouter()
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState<string>("")

  useEffect(() => {
    // Load merchant session
    const sessionStr = localStorage.getItem("merchant_session")
    if (sessionStr) {
      const session: MerchantSession = JSON.parse(sessionStr)
      // For demo accounts or multiple partners, we use the first one or 'all'
      // In a real scenario, this would be more robust
      const pid = session.partner_ids[0]
      setPartnerId(pid === 'all' ? 'demo-partner-id' : pid)
      setPartnerName(session.name)
    } else {
      router.push("/portal")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("merchant_session")
    router.push("/portal")
  }

  if (!partnerId) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Merchant Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="font-bold text-gray-900 leading-none">QR Scanner</h1>
            <p className="text-xs text-gray-500 mt-1">{partnerName}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-600 rounded-full"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Scanner Component */}
      <div className="flex-1 relative">
        <QRScanner 
          partnerId={partnerId} 
          onClose={() => router.back()} 
        />
      </div>
    </div>
  )
}
