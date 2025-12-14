"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Bell, Hotel, Waves, Utensils, MapPin, Grid3X3, ChevronRight, Star, Shield, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser, discountPercentages, tierThresholds } from "@/lib/user-context"

const quickActions = [
  { id: "hotels", name: "Hotels", icon: Hotel, color: "text-[#135bec]" },
  { id: "activities", name: "Activities", icon: MapPin, color: "text-orange-500" },
  { id: "water-sports", name: "Water\nSports", icon: Waves, color: "text-cyan-500" },
  { id: "dining", name: "Dining", icon: Utensils, color: "text-red-500" },
  { id: "insurance", name: "Insurance", icon: Shield, color: "text-purple-500" },
  { id: "all", name: "All Partners", icon: Grid3X3, color: "text-gray-500" },
]

const featuredOffers = [
  {
    id: "1",
    type: "large",
    image: "/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png",
    badge: "Platinum",
    badgeColor: "bg-[#10b981]",
    title: "Free Airport Lounge Access",
    subtitle: "Global coverage",
  },
  {
    id: "2",
    type: "small",
    icon: Utensils,
    title: "2x Points",
    subtitle: "On all fine dining",
  },
  {
    id: "3",
    type: "small",
    badge: "Invite Only",
    title: "Exclusive Gala Night",
    cta: "RSVP Now",
  },
]

const deals = [
  {
    id: "1",
    image: "/images/a97d3f-f3e8aad1f46446e58a87dda0cae5d7b9-mv2.png",
    badge: "30% OFF",
    badgeColor: "bg-[#10b981]",
    title: "Yacht Charter",
    subtitle: "La Banca Cruises",
    price: "₱8,500",
    originalPrice: "₱12,000",
  },
  {
    id: "2",
    image: "/images/3.jpeg",
    badge: "Wildlife",
    badgeColor: "bg-orange-500",
    title: "Tiger Encounter",
    subtitle: "Zoobic Safari",
    price: "₱1,200",
    originalPrice: "₱1,600",
  },
  {
    id: "3",
    image: "/images/7c5eba-df2c5ae831f247eab0d0f46ba54f996a-mv2-d-2880-1616-s-2.jpg",
    badge: "Sailing",
    badgeColor: "bg-[#135bec]",
    title: "Weekend Lessons",
    subtitle: "Subic Sailing",
    price: "₱2,500",
    originalPrice: "₱3,500",
  },
]

const tierConfig = {
  starter: {
    label: "STARTER MEMBER",
    labelColor: "text-blue-300",
    nextTier: "Basic",
    nextThreshold: 5000,
  },
  basic: {
    label: "BASIC MEMBER",
    labelColor: "text-green-300",
    nextTier: "Premium",
    nextThreshold: 15000,
  },
  premium: {
    label: "PREMIUM MEMBER",
    labelColor: "text-orange-300",
    nextTier: "Elite",
    nextThreshold: 30000,
  },
  elite: {
    label: "ELITE MEMBER",
    labelColor: "text-blue-300",
    nextTier: "Diamond",
    nextThreshold: 50000,
  },
}

export function HomeDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const firstName = user?.name?.split(" ")[0] || "Guest"
  const tier = user?.tier || "starter"
  const points = user?.points || 1000
  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter
  const userDiscount = discountPercentages[tier] || 5

  // Calculate progress to next tier
  const currentThreshold = tierThresholds[tier as keyof typeof tierThresholds] || 0
  const nextThreshold = config.nextThreshold
  const progressPercent = Math.min(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 100)
  const pointsToNext = Math.max(nextThreshold - points, 0)

  const handleQuickAction = (id: string) => {
    if (id === "all") {
      router.push("/partners")
    } else {
      router.push(`/partners?category=${id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] pb-24">
      <header className="sticky top-0 z-50 bg-[#f6f6f8]/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder.svg?height=44&width=44" />
                <AvatarFallback className="bg-[#135bec] text-white font-semibold">{firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#616f89] text-xs font-medium">Welcome back,</span>
              <h2 className="text-[#111318] text-lg font-bold leading-tight">{firstName}</h2>
            </div>
          </div>
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 text-[#111318] hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <section className="px-5">
          <div className="bg-[#101622] rounded-[2.5rem] p-6 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e2330] to-[#0c0f16]" />
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-[#135bec]/20 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#135bec]/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className={`${config.labelColor} font-bold tracking-wider uppercase text-[13px]`}>
                    {config.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-[36px] font-bold text-white tracking-tight leading-none">
                      {points.toLocaleString()}
                    </h3>
                    <span className="text-lg font-medium text-white/50">Pts</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white/60" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-white/60 font-medium">{config.nextTier} Tier</span>
                  <span className="text-white/60 font-medium">{pointsToNext.toLocaleString()} pts to go</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-[#135bec] rounded-full shadow-[0_0_12px_rgba(19,91,236,0.6)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <Button className="w-full h-14 rounded-full bg-white text-[#111318] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 shadow-lg">
                <Star className="w-5 h-5 text-[#135bec]" />
                Redeem Rewards
              </Button>
            </div>
          </div>
        </section>

        <section className="pl-5">
          <h3 className="text-sm font-bold text-[#111318] mb-3 pr-5">Quick Actions</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 pr-5 snap-x snap-mandatory">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="snap-start shrink-0 flex flex-col items-center justify-center gap-2 w-[84px] p-2 rounded-2xl bg-transparent transition-all active:scale-95 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center group-hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] transition-shadow">
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-[11px] font-semibold text-[#111318] text-center leading-tight whitespace-pre-line">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="text-lg font-bold text-[#111318] flex items-center gap-2">
              Featured Offers
              <span className="flex w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </h2>
            <button
              onClick={() => router.push("/partners")}
              className="text-xs font-bold text-[#135bec] hover:text-[#0e45b5] transition-colors"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 px-5 h-[340px]">
            {/* Large card */}
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden group cursor-pointer shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featuredOffers[0].image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-4 pb-6">
                <div className="flex items-start">
                  <span
                    className={`inline-flex items-center justify-center ${featuredOffers[0].badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm`}
                  >
                    {featuredOffers[0].badge}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xl font-bold text-white leading-tight">{featuredOffers[0].title}</h3>
                  <p className="text-xs text-white/80 font-medium">{featuredOffers[0].subtitle}</p>
                </div>
              </div>
            </div>

            {/* Small cards column */}
            <div className="flex flex-col gap-3 h-full">
              {/* 2x Points card */}
              <div className="flex-1 bg-white rounded-[1.5rem] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] p-3 flex flex-col items-center justify-center text-center border border-gray-100 group cursor-pointer">
                <div className="bg-blue-50 text-[#135bec] rounded-2xl p-2.5 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#111318]">2x Points</h3>
                <p className="text-[10px] text-[#616f89]">On all fine dining</p>
              </div>

              {/* Gala Night card */}
              <div className="flex-1 bg-white rounded-[1.5rem] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] p-4 flex flex-col justify-between items-start border border-gray-100 group cursor-pointer">
                <span className="bg-gray-100 text-[#616f89] text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                  Invite Only
                </span>
                <div className="mt-1 w-full">
                  <h3 className="text-sm font-bold text-[#111318] leading-tight mb-2">Exclusive Gala Night</h3>
                  <div className="text-[10px] font-bold text-[#10b981] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    RSVP Now <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-5">
          <div className="flex items-center justify-between mb-4 px-5">
            <h2 className="text-lg font-bold text-[#111318]">Deals for You</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 px-5 snap-x snap-mandatory">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="snap-center shrink-0 w-[300px] h-[200px] relative rounded-[2rem] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${deal.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex justify-between items-end w-full">
                    <div>
                      <span
                        className={`inline-block ${deal.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2`}
                      >
                        {deal.badge}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
                      <p className="text-xs text-white/80">{deal.subtitle}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-white">{deal.price}</span>
                      <span className="text-xs text-white/60 line-through">{deal.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
