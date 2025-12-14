export type MembershipTier = "starter" | "basic" | "premium" | "elite" | null

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  birthday?: string
  address?: string
  tier: MembershipTier
  memberId?: string
  insuranceAmount: number
  ecoContribution: number
  points: number
  validUntil: Date
  createdAt: Date
}

export interface Partner {
  id: string
  name: string
  logo: string
  category: "hotels" | "activities" | "dining" | "water-sports" | "services"
  description: string
  discount: number
  eliteDiscount: number
  offers: string[]
  featured?: boolean
}

export interface Offer {
  id: string
  partnerId: string
  partnerName: string
  title: string
  description: string
  image: string
  discount: number
  isEliteExclusive?: boolean
}

export interface BookingRequest {
  id: string
  guestName: string
  tier: MembershipTier
  request: string
  timestamp: Date
  status: "pending" | "accepted" | "declined"
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  bookingCard?: {
    venue: string
    time: string
    guests: number
    discount: number
    image: string
  }
}
