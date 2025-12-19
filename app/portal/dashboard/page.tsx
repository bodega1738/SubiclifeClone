"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Calendar, DollarSign, Users, CheckCircle, ChevronDown, Check, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Partner, Booking, AcceptData, DeclineData, CounterOfferData } from "@/lib/types"
import { partners as partnersData } from "@/lib/partners-data"
import { BookingRequestCard } from "@/components/portal/booking-request-card"
import { BookingDetailModal } from "@/components/portal/booking-detail-modal"
import { CounterOfferModal } from "@/components/portal/counter-offer-modal"
import { acceptBooking, declineBooking, sendCounterOffer } from "@/lib/supabase-actions"
import { mockSupabase as supabase } from "@/lib/mock-db"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: 'user1',
    partner_id: 'lighthouse-marina',
    booking_type: 'hotel',
    booking_details: {
      check_in: '2024-12-25',
      check_out: '2024-12-27',
      room_type: 'Aqua Veranda Suite',
      guests: { adults: 2, children: 0 },
      special_requests: 'Late checkout preferred, ocean view',
      package_name: 'Weekend Getaway Package'
    },
    status: 'pending',
    payment_status: 'pending',
    total_amount: 12000,
    discount_amount: 3000,
    final_amount: 9000,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: {
      id: 'user1',
      name: 'Maria Santos',
      email: 'maria@example.com',
      tier: 'elite',
      insuranceAmount: 0,
      ecoContribution: 0,
      points: 0,
      validUntil: new Date(),
      createdAt: new Date()
    }
  },
  {
    id: '2',
    user_id: 'user2',
    partner_id: 'lighthouse-marina',
    booking_type: 'restaurant',
    booking_details: {
      date: '2024-12-24',
      time: '19:00',
      party_size: 4,
      special_requests: 'Anniversary celebration, window seat',
      package_name: 'Sunset Dinner Special'
    },
    status: 'pending',
    payment_status: 'pending',
    total_amount: 8000,
    discount_amount: 2000,
    final_amount: 6000,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: {
      id: 'user2',
      name: 'John Cruz',
      email: 'john@example.com',
      tier: 'premium',
      insuranceAmount: 0,
      ecoContribution: 0,
      points: 0,
      validUntil: new Date(),
      createdAt: new Date()
    }
  },
  {
    id: '3',
    user_id: 'user3',
    partner_id: 'lighthouse-marina',
    booking_type: 'activity',
    booking_details: {
      date: '2024-12-26',
      participants: 2,
      package_name: 'Private Yacht Cruise'
    },
    status: 'pending',
    payment_status: 'pending',
    total_amount: 15000,
    discount_amount: 3750,
    final_amount: 11250,
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    user: {
      id: 'user3',
      name: 'Ana Reyes',
      email: 'ana@example.com',
      tier: 'elite',
      insuranceAmount: 0,
      ecoContribution: 0,
      points: 0,
      validUntil: new Date(),
      createdAt: new Date()
    }
  }
]

const revenueData = [
  { day: "1", revenue: 8500 },
  { day: "5", revenue: 12000 },
  { day: "10", revenue: 9800 },
  { day: "15", revenue: 15200 },
  { day: "20", revenue: 11000 },
  { day: "25", revenue: 18500 },
  { day: "30", revenue: 14200 },
]

export default function PortalDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [showPartnerMenu, setShowPartnerMenu] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCounterModal, setShowCounterModal] = useState(false)

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from('bookings').select('*').eq('status', 'pending')
      if (data) {
        setBookings(data)
      }
    }

    // For demo: use partners-data.ts
    const extendedPartners = partnersData.map(p => ({ ...p, commission_rate: 0.1 }))
    setPartners(extendedPartners)
    setCurrentPartner(extendedPartners[0])
    fetchBookings()

    // Mock Realtime
    const channel = supabase.channel('dashboard')
      .on('postgres_changes', { event: '*', table: 'bookings' }, () => {
        fetchBookings()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const switchPartner = (partner: Partner) => {
    setCurrentPartner(partner)
    setShowPartnerMenu(false)
    // In a real app, this would trigger a data reload
    setBookings(mockBookings.map(b => ({ ...b, partner: partner })))
  }

  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleAccept = async (id: string, data: AcceptData) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    
    try {
      await acceptBooking(id, booking.partner_id, booking.user_id, booking.partner?.name || '', data)
      setBookings(prev => prev.filter(b => b.id !== id))
      toast({
        title: "Booking Confirmed",
        description: "The member has been notified",
        variant: "default"
      })
    } catch (error) {
      console.error('Accept error:', error)
      toast({
        title: "Error",
        description: "Failed to update booking. Please check console.",
        variant: "destructive"
      })
    }
  }

  const handleDecline = async (id: string, data: DeclineData) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    
    try {
      await declineBooking(id, booking.partner_id, booking.user_id, booking.partner?.name || '', data)
      setBookings(prev => prev.filter(b => b.id !== id))
      toast({
        title: "Booking Declined",
        description: "The member has been notified of the decline",
        variant: "default"
      })
    } catch (error) {
      console.error('Decline error:', error)
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      })
    }
  }

  const handleCounter = (id: string) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    setSelectedBooking(booking)
    setShowDetailModal(false)
    setShowCounterModal(true)
  }

  const handleCounterSubmit = async (data: CounterOfferData) => {
    if (!selectedBooking) return
    
    try {
      await sendCounterOffer(
        selectedBooking.id, 
        selectedBooking.partner_id, 
        selectedBooking.user_id, 
        selectedBooking.partner?.name || '', 
        data,
        data.merchant_note || ''
      )
      
      setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
      toast({
        title: "Counter-Offer Sent",
        description: "The member has been notified of your offer.",
        variant: "default"
      })
      setShowCounterModal(false)
    } catch (error) {
      console.error('Counter offer error:', error)
      toast({
        title: "Error",
        description: "Failed to send counter offer",
        variant: "destructive"
      })
      throw error // Re-throw to let the modal handle loading state if needed, though modal handles error too
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <button 
        onClick={() => router.push("/portal/scanner")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-colors z-30 sm:hidden"
      >
        <Camera className="w-6 h-6 text-white" />
      </button>
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => setShowPartnerMenu(!showPartnerMenu)}
              className="flex items-center gap-3 text-left hover:bg-slate-50 p-1 rounded-lg transition-colors"
            >
              <img
                src={currentPartner?.logo || "/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png"}
                alt={currentPartner?.name}
                className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-slate-200"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-bold text-slate-900">{currentPartner?.name || "Lighthouse Marina Resort"}</h1>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Merchant Portal</p>
              </div>
            </button>

            {showPartnerMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowPartnerMenu(false)} />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 z-40 overflow-hidden py-2">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => switchPartner(partner)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <img src={partner.logo} alt={partner.name} className="w-8 h-8 rounded object-contain bg-slate-100" />
                      <span className={cn("text-sm flex-1 text-left truncate", currentPartner?.id === partner.id ? "font-bold text-blue-600" : "text-slate-700")}>
                        {partner.name}
                      </span>
                      {currentPartner?.id === partner.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push("/portal/scanner")}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 relative group">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={() => router.push("/portal")} 
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-900">3</p>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Requests</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">12</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Today</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3 text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">8</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Arrivals</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">₱45,000</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active Requests</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none font-bold">
              {bookings.length} PENDING
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <BookingRequestCard 
                key={booking.id}
                booking={booking}
                onAccept={() => openBookingDetail(booking)}
                onCounter={() => openBookingDetail(booking)}
                onDecline={() => openBookingDetail(booking)}
              />
            ))}
            {bookings.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold">All caught up!</h3>
                <p className="text-sm text-slate-500">No new booking requests at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <Card className="shadow-sm border-0 bg-white overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-800">Revenue Overview</CardTitle>
              <select className="text-xs font-bold text-slate-400 bg-transparent border-none focus:ring-0 cursor-pointer uppercase tracking-wider">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} 
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border-none text-xs font-bold">
                            ₱{payload[0].value?.toLocaleString()}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="revenue" fill="#135bec" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onCounter={handleCounter}
      />

      <CounterOfferModal
        booking={selectedBooking}
        open={showCounterModal}
        onOpenChange={setShowCounterModal}
        onSubmit={handleCounterSubmit}
      />
    </div>
  )
}
