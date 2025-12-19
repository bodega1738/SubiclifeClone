"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { MembershipPass } from "@/components/pass/membership-pass"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCard } from "@/components/pass/booking-card"
import { ActivityTimeline } from "@/components/pass/activity-timeline"
import { BookingDetailModal } from "@/components/pass/booking-detail-modal"
import { CancelBookingModal } from "@/components/pass/cancel-booking-modal"
import { Booking, Notification, Partner, CounterOffer } from "@/lib/types"
import { mockSupabase as supabase } from "@/lib/mock-db"
import { 
  acceptCounterOffer, 
  declineCounterOffer, 
  cancelBooking 
} from "@/lib/supabase-actions"
import { useToast } from "@/hooks/use-toast"
import { Calendar, History, Clock, Activity } from "lucide-react"

export default function PassPage() {
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  
  const [bookings, setBookings] = useState<(Booking & { partner?: Partner; counter_offer?: CounterOffer })[]>([])
  const [activities, setActivities] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { partner?: Partner }) | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    fetchData()

    // Realtime subscription
    const channel = supabase
      .channel("booking-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Realtime update:", payload)
          fetchData() // Refresh everything on change for simplicity and consistency

          if (payload.eventType === "UPDATE") {
            if (payload.new.status === "confirmed") {
              toast({ title: "Booking Confirmed!", description: "Your booking has been approved by the partner." })
            } else if (payload.new.status === "declined") {
              toast({
                title: "Booking Declined",
                description: "The partner was unable to accommodate your request.",
                variant: "destructive",
              })
            } else if (payload.new.status === "counter_offer_sent") {
              toast({ title: "New Counter-Offer", description: "A partner has sent a suggestion for your booking." })
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  async function fetchData() {
    if (!user?.id) return
    setIsLoading(true)
    try {
      // Fetch bookings with joins
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, partner:partners(*), counter_offer:counter_offers(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (bookingsError) throw bookingsError
      setBookings(bookingsData || [])

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['booking_confirmed', 'check_in', 'points_earned', 'tier_upgraded'])
        .order('created_at', { ascending: false })
        .limit(10)

      if (activitiesError) throw activitiesError
      setActivities(activitiesData || [])
    } catch (error) {
      console.error('Error fetching pass data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptCounter = async (bookingId: string, offerId: string) => {
    if (!offerId) return
    try {
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return
      await acceptCounterOffer(bookingId, offerId, user!.id, booking.partner_id)
      toast({ title: "Offer Accepted", description: "Your booking is now confirmed!" })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept offer.", variant: "destructive" })
    }
  }

  const handleDeclineCounter = async (bookingId: string, offerId: string) => {
    if (!offerId) return
    try {
      const booking = bookings.find(b => b.id === bookingId)
      if (!booking) return
      await declineCounterOffer(bookingId, offerId, user!.id, booking.partner_id)
      toast({ title: "Offer Declined", description: "Booking is back to pending status." })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline offer.", variant: "destructive" })
    }
  }

  const handleCancelBooking = async (reason: string, note: string) => {
    if (!bookingToCancel) return
    try {
      const booking = bookings.find(b => b.id === bookingToCancel)
      if (!booking) return
      await cancelBooking(bookingToCancel, user!.id, booking.partner_id, reason, note)
      toast({ title: "Booking Cancelled", description: "Your booking has been successfully cancelled." })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" })
    }
  }

  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingBookings = bookings.filter(b => {
    const bookingDateStr = b.booking_details.date || b.booking_details.check_in
    if (!bookingDateStr) return false
    const bookingDate = new Date(bookingDateStr)
    bookingDate.setHours(0, 0, 0, 0)
    
    return b.status === 'confirmed' && bookingDate >= today
  })

  const pendingBookings = bookings.filter(b => ['pending', 'counter_offer_sent'].includes(b.status))

  const pastBookings = bookings.filter(b => {
    const bookingEndDateStr = b.booking_details.date || b.booking_details.check_out
    if (!bookingEndDateStr) return ['completed', 'cancelled', 'declined'].includes(b.status)
    const bookingEndDate = new Date(bookingEndDateStr)
    bookingEndDate.setHours(0, 0, 0, 0)

    const isPastDate = bookingEndDate < today
    return isPastDate || ['completed', 'cancelled', 'declined'].includes(b.status)
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <MembershipPass />
      
      <div className="max-w-md mx-auto px-4 mt-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-white rounded-xl shadow-sm border border-slate-100 mb-6">
            <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-[#0A74DA] data-[state=active]:text-white text-xs font-bold transition-all">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-[#0A74DA] data-[state=active]:text-white text-xs font-bold transition-all">
              Pending
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg data-[state=active]:bg-[#0A74DA] data-[state=active]:text-white text-xs font-bold transition-all">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0 outline-none">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onViewDetails={(id) => {
                    setSelectedBooking(booking)
                    setIsDetailOpen(true)
                  }}
                  onCancel={(id) => {
                    setBookingToCancel(id)
                    setIsCancelOpen(true)
                  }}
                />
              ))
            ) : (
              <EmptyState icon={<Calendar className="h-10 w-10 text-slate-200" />} message="No upcoming bookings yet." />
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-0 outline-none">
            {pendingBookings.length > 0 ? (
              pendingBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onViewDetails={(id) => {
                    setSelectedBooking(booking)
                    setIsDetailOpen(true)
                  }}
                  onCancel={(id) => {
                    setBookingToCancel(id)
                    setIsCancelOpen(true)
                  }}
                  onAcceptCounterOffer={handleAcceptCounter}
                  onDeclineCounterOffer={handleDeclineCounter}
                />
              ))
            ) : (
              <EmptyState icon={<Clock className="h-10 w-10 text-slate-200" />} message="No pending requests." />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0 outline-none">
            {pastBookings.length > 0 ? (
              pastBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onViewDetails={(id) => {
                    setSelectedBooking(booking)
                    setIsDetailOpen(true)
                  }}
                  onCancel={() => {}} // No cancel for past
                />
              ))
            ) : (
              <EmptyState icon={<History className="h-10 w-10 text-slate-200" />} message="No past bookings found." />
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#0A74DA]" />
              Recent Activity
            </h3>
            <button className="text-[11px] font-bold text-[#0A74DA] uppercase tracking-wider">View All</button>
          </div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      <BookingDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        booking={selectedBooking} 
      />

      <CancelBookingModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelBooking}
        bookingId={bookingToCancel || ''}
      />
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode, message: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-sm text-slate-500 font-medium">{message}</p>
      <button className="mt-4 text-xs font-bold text-[#0A74DA] uppercase tracking-wider">Explore Partners</button>
    </div>
  )
}
