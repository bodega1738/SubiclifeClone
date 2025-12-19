"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Share2, Heart, MapPin, Star, 
  Shield, Award, Check, ChevronRight 
} from "lucide-react"
import { useUser, discountPercentages } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Partner } from "@/lib/types"
import { BookingFlowModal } from "@/components/booking/booking-flow-modal"

interface PartnerDetailProps {
  partner: Partner
}

export function PartnerDetail({ partner }: PartnerDetailProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Use partner images or placeholders
  const images = [
    partner.logo,
    "/public/subic-bay-aerial-view-blue-ocean-tropical.jpg",
    "/public/luxury-resort-suite-ocean-view-sunset.jpg",
    "/public/luxury-yacht-cruise-sunset-subic-bay.jpg",
    "/public/zipline-forest-canopy-adventure-green.jpg",
  ].map(img => img.replace('/public', ''))

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft
      const width = scrollRef.current.offsetWidth
      const index = Math.round(scrollPosition / width)
      setCurrentImageIndex(index)
    }
  }

  // Generate default packages if none exist
  const packages = [
    {
      id: "pkg-1",
      name: "Standard Experience",
      inclusions: ["General Admission", "Welcome Drink", "Guided Tour"],
      price: 1500
    },
    {
      id: "pkg-2",
      name: "Premium Package",
      inclusions: ["Fast Pass Access", "Full Course Meal", "Exclusive Lounge", "Souvenir Photo"],
      price: 3500
    },
    {
      id: "pkg-3",
      name: "Elite Day Tour",
      inclusions: ["Private Guide", "All-Inclusive Dining", "Spa Treatment", "VIP Transfer"],
      price: 7500
    }
  ]

  const userTier = user?.tier || "starter"
  const discount = userTier === "elite" && partner.eliteDiscount 
    ? partner.eliteDiscount 
    : (partner.discount || discountPercentages[userTier] || 5)

  const lowestPrice = Math.min(...packages.map(p => p.price))
  const discountedLowestPrice = lowestPrice * (1 - discount / 100)
  const savings = lowestPrice - discountedLowestPrice

  const getBookingType = (category: string): 'hotel' | 'restaurant' | 'yacht' | 'activity' => {
    switch (category) {
      case 'hotels': return 'hotel'
      case 'dining': return 'restaurant'
      case 'water-sports': return 'yacht'
      default: return 'activity'
    }
  }

  const bookingType = getBookingType(partner.category)

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Gallery Section */}
      <div className="relative aspect-square w-full overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        >
          {images.map((img, idx) => (
            <div 
              key={idx}
              className="min-w-full h-full snap-center bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Floating Controls */}
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-active active:scale-90"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-active active:scale-90">
            <Share2 className="h-5 w-5 text-gray-900" />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-active active:scale-90"
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-900"}`} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                currentImageIndex === idx ? "bg-white w-3" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{partner.name}</h1>
        
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Subic Bay</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">4.96</span>
            <span>(298 reviews)</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mb-6 flex gap-4 border-y border-gray-100 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-fit items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2">
              <Star className="h-5 w-5 text-[#135bec]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Guest favorite</p>
              <p className="text-xs text-gray-500">Top 5% of partners</p>
            </div>
          </div>
          <div className="flex min-w-fit items-center gap-3 border-l border-gray-100 pl-4">
            <div className="rounded-full bg-green-50 p-2">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Verified partner</p>
              <p className="text-xs text-gray-500">Identity confirmed</p>
            </div>
          </div>
          <div className="flex min-w-fit items-center gap-3 border-l border-gray-100 pl-4">
            <div className="rounded-full bg-purple-50 p-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Top rated</p>
              <p className="text-xs text-gray-500">Elite experience</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">About this partner</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            {partner.description} {partner.description} Experience the best of Subic Bay with {partner.name}. 
            Our commitment to excellence ensures every visitor enjoys a world-class experience tailored to their needs.
          </p>
        </div>

        {/* Packages Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Available Packages</h2>
          <div className="space-y-4">
            {packages.map((pkg) => {
              const discountedPrice = pkg.price * (1 - discount / 100)
              return (
                <div key={pkg.id} className="rounded-xl border border-gray-200 p-4 transition-all hover:border-[#135bec]/30">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      -{discount}% OFF
                    </Badge>
                  </div>
                  
                  <ul className="mb-4 space-y-2">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₱{discountedPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">₱{pkg.price.toLocaleString()}</span>
                  </div>

                  <Button variant="outline" className="w-full border-2 border-gray-200 font-semibold hover:bg-gray-50 hover:border-gray-300">
                    Select Package
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-between border-t border-gray-200 bg-white px-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">From</span>
            <span className="text-xl font-bold text-gray-900">₱{discountedLowestPrice.toLocaleString()}</span>
          </div>
          <p className="text-xs font-medium text-green-600">
            Save ₱{savings.toLocaleString()} ({discount}% Tier Discount)
          </p>
        </div>
        
        <Button 
          onClick={() => setIsBookingOpen(true)}
          className="h-12 rounded-xl bg-[#135bec] px-8 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#0e45b5] active:scale-95"
        >
          Request Booking
        </Button>
      </div>

      <BookingFlowModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        partner={partner} 
        bookingType={bookingType}
      />
    </div>
  )
}
