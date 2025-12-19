export type MembershipTier = "starter" | "basic" | "premium" | "elite" | null

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  birthday?: string
  address?: string
  tier: MembershipTier
  member_id?: string
  insuranceAmount: number
  ecoContribution: number
  points: number
  validUntil: Date
  createdAt: Date
  preferences?: {
    travelFrequency?: 'first-time' | 'occasional' | 'frequent' | 'local-resident'
    interests?: string[] // ['hotels', 'activities', 'dining', 'water-sports', 'wellness']
    budgetRange?: 'budget' | 'moderate' | 'luxury' | 'ultra-luxury'
  }
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
  commission_rate?: number
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

export interface MerchantSession {
  email: string
  partner_ids: string[] // ['all'] for demo account
  name: string
}

export interface Booking {
  id: string
  user_id: string
  partner_id: string
  booking_type: 'hotel' | 'restaurant' | 'yacht' | 'activity' | 'service'
  booking_details: {
    // Hotel
    check_in?: string
    check_out?: string
    room_type?: string
    guests?: { adults: number; children: number }
    
    // Restaurant
    date?: string
    time?: string
    party_size?: number
    
    // Yacht
    duration?: string
    passengers?: number
    
    // Activity
    participants?: number
    
    // Common
    special_requests?: string
    package_name?: string
  }
  status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled' | 'counter_offer_sent'
  payment_status: 'pending' | 'paid' | 'refunded'
  payment_method?: string
  total_amount: number
  discount_amount: number
  final_amount: number
  created_at: string
  confirmed_at?: string
  
  // Joined data
  user?: User
  partner?: Partner
}

export interface DashboardMetrics {
  newRequests: number
  confirmedToday: number
  expectedArrivals: number
  revenue: number
}

export interface AcceptData {
  roomOrTable?: string
  internalNote?: string
}

export interface DeclineData {
  reason: string
  explanation: string
}

export interface Notification {
  id: string
  user_id?: string
  partner_id?: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface CounterOfferData {
  // Common
  merchant_note?: string
  price?: number
  price_per_person?: number
  
  // Hotel
  check_in?: string
  check_out?: string
  room_type?: string
  sweeteners?: string[]
  
  // Restaurant
  date?: string
  time_slot?: string
  table_type?: string
  complimentary?: string[]
  
  // Yacht
  duration?: string
  vessel?: string
  weather_backup_date?: string
  add_ons?: string[]
  
  // Activity
  time_slot_label?: string
  package?: string
  participant_limit?: number
  activity_add_ons?: string[]
  
  // Service
  decline_reason?: string
  explanation?: string
}

export interface CounterOffer {
  id: string
  booking_id: string
  partner_id: string
  offer_details: CounterOfferData
  merchant_note: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}
