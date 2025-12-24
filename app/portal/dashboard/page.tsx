"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Calendar, DollarSign, Users, CheckCircle, ChevronDown, Check, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Partner, Booking, AcceptData, DeclineData, CounterOfferData, MerchantSession } from "@/lib/types"
import { partners as partnersData } from "@/lib/partners-data"
import { BookingRequestCard } from "@/components/portal/booking-request-card"
import { BookingDetailModal } from "@/components/portal/booking-detail-modal"
import { CounterOfferModal } from "@/components/portal/counter-offer-modal"
import { acceptBooking, declineBooking, sendCounterOffer } from "@/lib/supabase-actions"
import { mockSupabase as supabase } from "@/lib/mock-db"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function PortalDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Session & Partner State
  const [sessionType, setSessionType] = useState<'demo' | 'registered' | null>(null)
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [showPartnerMenu, setShowPartnerMenu] = useState(false)
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  
  // UI State
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCounterModal, setShowCounterModal] = useState(false)

  // 1. Session Detection & Initialization
  useEffect(() => {
    const initializeDashboard = () => {
      // Check for demo session first
      const demoSessionStr = localStorage.getItem('merchantSession')
      const registrationStr = localStorage.getItem('merchantRegistration')

      if (demoSessionStr) {
        setSessionType('demo')
        
        // Initialize Demo Partners
        const extendedPartners = partnersData.map(p => ({ ...p, commission_rate: 0.1 }))
        setPartners(extendedPartners)
        setCurrentPartner(extendedPartners[0])
        
      } else if (registrationStr) {
        setSessionType('registered')
        
        try {
          const data = JSON.parse(registrationStr)
          const newPartner: Partner = {
            id: data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: data.businessName,
            logo: data.logo || '/placeholder-logo.png',
            category: (data.businessType + 's') as any,
            description: data.description,
            discount: 10,
            eliteDiscount: 15,
            offers: data.packages.map((p: any) => p.name),
            featured: false,
            commission_rate: 0.1
          }
          
          setCurrentPartner(newPartner)
          setPartners([newPartner]) // Only one partner in registered mode
        } catch (e) {
          console.error('Failed to parse registration data', e)
          router.push("/portal/register")
        }
      } else {
        // No session found
        router.push("/portal/register")
      }
    }

    initializeDashboard()
  }, [router])

  // 3. Dynamic Booking Fetching
  const fetchBookings = async (partnerId: string) => {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    // If not demo mode (or even in demo mode if we want to filter by currently selected partner),
    // we should filter.
    // The plan says: "Demo mode: fetch all pending bookings". 
    // BUT also "Partner Switcher Logic... When partner is switched in demo mode... Fetch bookings filtered by new partner_id"
    // So essentially, we always filter by the CURRENT partner's ID, unless we are in a special "All Partners" view which isn't explicitly defined but hinted at.
    // However, step 2 says "Set currentPartner to first partner in list".
    // So we will always filter by currentPartner.id
    
    if (partnerId) {
      query = query.eq('partner_id', partnerId)
    }

    const { data } = await query
    
    if (data) {
      setBookings(data as Booking[])
    }
  }

  // Effect to fetch bookings when currentPartner changes
  useEffect(() => {
    if (currentPartner) {
      fetchBookings(currentPartner.id)
    }
  }, [currentPartner])

  // 6. Realtime Subscription Updates
  useEffect(() => {
    if (!currentPartner) return

    const channel = supabase
      .channel('merchant-dashboard')
      .on('postgres_changes', {
        event: '*',
        table: 'bookings',
        filter: sessionType === 'demo' 
          ? undefined // Listen to all in demo, but we might want to filter fetch? 
          // Actually if we receive an event for another partner while in demo mode, we might want to know?
          // But strict filter: `partner_id=eq.${currentPartner.id}` is better to match the current view.
          // The plan says: "Filter by partner_id if not in demo mode". 
          // This implies in demo mode we listen to EVERYTHING.
          : `partner_id=eq.${currentPartner.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // Check if it belongs to current partner or we are in demo mode
          if (sessionType === 'demo' || payload.new.partner_id === currentPartner.id) {
             toast({
              title: "New Booking Request",
              description: "A new booking request has arrived"
            })
          }
        }
        // Refresh data
        fetchBookings(currentPartner.id)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentPartner, sessionType, toast])


  // 4. Metrics Calculation
  const metrics = useMemo(() => {
    const isToday = (dateString: string) => {
      const date = new Date(dateString)
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }

    const newRequests = bookings.filter(b => b.status === 'pending').length
    
    const confirmedToday = bookings.filter(b => 
      b.status === 'confirmed' && 
      b.confirmed_at && 
      isToday(b.confirmed_at)
    ).length
    
    const expectedArrivals = bookings.filter(b => {
      if (b.status !== 'confirmed') return false
      
      // Determine arrival date based on booking type details
      let arrivalDate = b.booking_details.date // Restaurant/Activity
      if (b.booking_details.check_in) arrivalDate = b.booking_details.check_in // Hotel
      
      if (!arrivalDate) return false
      
      const date = new Date(arrivalDate)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      return date.toDateString() === today.toDateString() ||
             date.toDateString() === tomorrow.toDateString()
    }).length
    
    const revenue = bookings
      .filter(b => b.status === 'confirmed' && 
                   b.confirmed_at && 
                   isToday(b.confirmed_at))
      .reduce((sum, b) => sum + b.final_amount, 0)
    
    return { newRequests, confirmedToday, expectedArrivals, revenue }
  }, [bookings])

  // 9. Revenue Chart Data
  const revenueData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date
    })
    
    return last30Days.map(date => {
      const dayRevenue = bookings
        .filter(b => 
          b.status === 'confirmed' && 
          b.confirmed_at &&
          new Date(b.confirmed_at).toDateString() === date.toDateString()
        )
        .reduce((sum, b) => sum + b.final_amount, 0)
      
      return {
        day: date.getDate().toString(),
        revenue: dayRevenue
      }
    })
  }, [bookings])

  // 5. Partner Switcher Logic
  const switchPartner = (partner: Partner) => {
    setCurrentPartner(partner)
    setShowPartnerMenu(false)
    // fetchBookings will be triggered by useEffect dependency on currentPartner
  }

  // 10. Integration with Booking Actions
  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleAccept = async (id: string, data: AcceptData) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    
    try {
      await acceptBooking(id, booking.partner_id, booking.user_id, booking.partner?.name || '', data)
      // Remove booking from local state immediately (optimistic update for "Active Requests" list)
      // But actually we might want to keep it if we want it to count towards "Confirmed Today" immediately?
      // The current logic filters 'pending' for the list, so if we update status to 'confirmed', it will disappear from list but stay in 'bookings' for metrics.
      // So we should update the booking in state, not remove it.
      
      setBookings(prev => prev.map(b => 
        b.id === id 
          ? { ...b, status: 'confirmed' as const, confirmed_at: new Date().toISOString() } 
          : b
      ))
      
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
      // Update status to declined
      setBookings(prev => prev.map(b => 
        b.id === id 
          ? { ...b, status: 'declined' as const } 
          : b
      ))
      
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
      
      // Update status to counter_offer_sent
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, status: 'counter_offer_sent' as const } 
          : b
      ))

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
      throw error 
    }
  }

  // Filter bookings for Active Requests list
  const activeBookings = bookings.filter(b => b.status === 'pending')

  if (!currentPartner) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <button 
        onClick={() => router.push("/portal/scanner")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-colors z-30 sm:hidden"
      >
        <Camera className="w-6 h-6 text-white" />
      </button>
      
      {/* 7. Header Display Logic */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => sessionType === 'demo' && setShowPartnerMenu(!showPartnerMenu)}
              disabled={sessionType !== 'demo'}
              className={cn(
                "flex items-center gap-3 text-left p-1 rounded-lg transition-colors",
                sessionType === 'demo' ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"
              )}
            >
              <img
                src={currentPartner.logo}
                alt={currentPartner.name}
                className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-slate-200"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-bold text-slate-900">{currentPartner.name}</h1>
                  {sessionType === 'demo' && <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Merchant Portal</p>
              </div>
            </button>

            {showPartnerMenu && sessionType === 'demo' && (
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
                      <span className={cn("text-sm flex-1 text-left truncate", currentPartner.id === partner.id ? "font-bold text-blue-600" : "text-slate-700")}>
                        {partner.name}
                      </span>
                      {currentPartner.id === partner.id && <Check className="w-4 h-4 text-blue-600" />}
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
              {metrics.newRequests > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
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
                <p className="text-2xl font-black text-slate-900">{metrics.newRequests}</p>
                {metrics.newRequests > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Requests</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">{metrics.confirmedToday}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Today</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3 text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">{metrics.expectedArrivals}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Arrivals</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">₱{metrics.revenue.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Active Requests</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none font-bold">
              {activeBookings.length} PENDING
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((booking) => (
              <BookingRequestCard 
                key={booking.id}
                booking={booking}
                onAccept={() => openBookingDetail(booking)}
                onCounter={() => openBookingDetail(booking)}
                onDecline={() => openBookingDetail(booking)}
              />
            ))}
            {/* 8. Empty State Handling */}
            {activeBookings.length === 0 && (
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
                            ₱{Number(payload[0].value).toLocaleString()}
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
