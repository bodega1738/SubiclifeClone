"use client"

import { useState, useEffect } from "react"
import { Shield, Maximize2, X, Anchor, Hotel, CreditCard, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser, discountPercentages } from "@/lib/user-context"
import { QRCodeSVG } from "qrcode.react"

const tierStyles = {
  starter: {
    gradient: "from-[#0A74DA] to-blue-400",
    label: "STARTER MEMBER",
  },
  basic: {
    gradient: "from-green-500 to-green-400",
    label: "BASIC MEMBER",
  },
  premium: {
    gradient: "from-orange-500 to-orange-400",
    label: "PREMIUM MEMBER",
  },
  elite: {
    gradient: "from-[#0A74DA] to-blue-400",
    label: "ELITE MEMBER",
  },
}

export function MembershipPass() {
  const { user } = useUser()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [validity, setValidity] = useState(30)
  const [qrValue, setQrValue] = useState("")

  useEffect(() => {
    const generateQR = () => {
      const timestamp = Date.now()
      const code = `SL:${user?.member_id || "DEMO"}:${timestamp}`
      setQrValue(code)
      setValidity(30)
    }

    generateQR()
    const interval = setInterval(() => {
      setValidity((prev) => {
        if (prev <= 1) {
          generateQR()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [user?.member_id])

  const tier = user?.tier || "starter"
  const style = tierStyles[tier as keyof typeof tierStyles] || tierStyles.starter
  const discount = discountPercentages[tier] || 5
  const validUntil = user?.validUntil
    ? new Date(user.validUntil).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A"

  const PassCard = ({ className = "" }: { className?: string }) => (
    <Card className={`overflow-hidden shadow-lg border-0 ${className}`}>
      {/* Header gradient */}
      <div className={`h-2 bg-gradient-to-r ${style.gradient}`} />

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img
              src="/images/screenshot-2025-12-14-021635-removebg-preview.png"
              alt="Subic.LIFE"
              className="h-8 w-auto brightness-0"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(1520%) hue-rotate(197deg) brightness(91%) contrast(93%)",
              }}
            />
          </div>
          <Badge className={`bg-gradient-to-r ${style.gradient} hover:opacity-90 text-white px-3 py-1`}>
            {style.label}
          </Badge>
        </div>

        {/* Member details */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-bold text-slate-900">{user?.name || "Guest"}</h2>
          <p className="text-sm text-slate-500 font-mono">{user?.member_id || "SL-2025-DEMO-0000"}</p>
          <p className="text-sm text-slate-500">Valid until {validUntil}</p>
        </div>

        {/* Insurance and discount badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <Shield className="w-4 h-4 text-[#0A74DA]" />
            <span className="text-sm text-slate-700">
              ₱{(user?.insuranceAmount || 25000).toLocaleString()} Coverage
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="text-sm text-slate-700">{discount}% Discount</span>
          </div>
          {tier === "premium" || tier === "elite" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
              <Hotel className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-slate-700">1 Hotel Night</span>
            </div>
          ) : null}
          {tier === "elite" && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-full">
              <Anchor className="w-4 h-4 text-cyan-600" />
              <span className="text-sm text-slate-700">Yacht Cruise</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white rounded-xl border-2 border-slate-100">
            <QRCodeSVG value={qrValue} size={160} level="M" includeMargin={false} />
          </div>
          <p className="text-sm text-slate-500 mt-3">Show to partner</p>

          {/* Validity timer */}
          <div className="w-full mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>QR refreshes in</span>
              <span>{validity}s</span>
            </div>
            <Progress value={(validity / 30) * 100} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>
        <PassCard className="w-full max-w-sm" />
      </div>
    )
  }

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      title: "Insurance",
      desc: `₱${(user?.insuranceAmount || 25000).toLocaleString()} Coverage`
    },
    {
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      title: "Discount",
      desc: `${discount}% at 50+ Partners`
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: "Points",
      desc: `${user?.points || 0} Points Balance`
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">My Pass</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div>
          <PassCard />
          <Button onClick={() => setIsFullscreen(true)} variant="outline" className="w-full mt-4 h-12 gap-2 rounded-xl border-slate-200 text-slate-600 font-medium">
            <Maximize2 className="w-4 h-4" />
            Tap to Fullscreen
          </Button>
        </div>

        {/* Benefits Summary Section */}
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white p-4">
              <div className="mb-2">{benefit.icon}</div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{benefit.title}</h4>
              <p className="text-sm font-bold text-slate-900 leading-tight">{benefit.desc}</p>
            </Card>
          ))}
          {(tier === 'premium' || tier === 'elite') && (
            <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-orange-50 to-white p-4">
              <div className="mb-2"><Hotel className="w-5 h-5 text-orange-600" /></div>
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Bonus</h4>
              <p className="text-sm font-bold text-slate-900 leading-tight">1 Free Hotel Night</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
