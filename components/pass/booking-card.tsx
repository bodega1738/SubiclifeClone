'use client'

import { Booking, Partner, CounterOffer } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  MapPin, 
  ExternalLink, 
  Calendar,
  Users,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'

interface BookingCardProps {
  booking: Booking & { partner?: Partner; counter_offer?: CounterOffer }
  onViewDetails: (id: string) => void
  onCancel: (id: string) => void
  onAcceptCounterOffer?: (bookingId: string, offerId: string) => void
  onDeclineCounterOffer?: (bookingId: string, offerId: string) => void
}

export function BookingCard({
  booking,
  onViewDetails,
  onCancel,
  onAcceptCounterOffer,
  onDeclineCounterOffer
}: BookingCardProps) {
  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200' }
      case 'pending':
        return { label: 'Pending', icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
      case 'declined':
        return { label: 'Declined', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200' }
      case 'cancelled':
        return { label: 'Cancelled', icon: XCircle, className: 'bg-gray-100 text-gray-700 border-gray-200' }
      case 'counter_offer_sent':
        return { label: 'Counter Offer', icon: RefreshCw, className: 'bg-blue-100 text-blue-700 border-blue-200' }
      case 'completed':
        return { label: 'Completed', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200' }
      default:
        return { label: status, icon: Clock, className: 'bg-gray-100 text-gray-700 border-gray-200' }
    }
  }

  const statusConfig = getStatusConfig(booking.status)
  const isCounterOffer = booking.status === 'counter_offer_sent'

  const getBookingDetailString = () => {
    const details = booking.booking_details
    switch (booking.booking_type) {
      case 'hotel':
        return `${details.check_in} - ${details.check_out} • ${details.room_type}`
      case 'restaurant':
        return `${details.date} at ${details.time} • ${details.party_size} guests`
      case 'yacht':
        return `${details.date} • ${details.duration} • ${details.passengers} pax`
      case 'activity':
        return `${details.date} • ${details.participants} participants`
      default:
        return `${details.date}`
    }
  }

  return (
    <Card className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md mb-4">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={booking.partner?.logo || '/placeholder.jpg'}
                alt={booking.partner?.name || 'Partner'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight mb-1">
                {booking.partner?.name || 'Partner'}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                {booking.partner?.category}
              </p>
              <p className="text-[10px] font-mono text-gray-400">
                REF: {booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <Badge className={`px-2 py-1 rounded-full flex items-center gap-1 text-[10px] border ${statusConfig.className}`}>
            <statusConfig.icon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{getBookingDetailString()}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 font-medium">Final Amount</span>
            <div className="text-right">
              <span className="font-bold text-gray-900 block">₱{booking.final_amount.toLocaleString()}</span>
              {booking.discount_amount > 0 && (
                <span className="text-[10px] text-green-600 font-medium">
                  Saved ₱{booking.discount_amount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isCounterOffer && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900">Partner sent a counter-offer</p>
                <p className="text-[11px] text-blue-700 italic">"{booking.counter_offer?.merchant_note}"</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                onClick={() => {
                  if (booking.counter_offer?.id) {
                    onAcceptCounterOffer?.(booking.id, booking.counter_offer.id)
                  }
                }}
                disabled={!booking.counter_offer?.id}
              >
                Accept Offer
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="h-10 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                onClick={() => {
                  if (booking.counter_offer?.id) {
                    onDeclineCounterOffer?.(booking.id, booking.counter_offer.id)
                  }
                }}
                disabled={!booking.counter_offer?.id}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
          <Button 
            variant="outline" 
            className="flex-1 h-10 rounded-lg text-xs font-medium border-gray-200 text-gray-700"
            onClick={() => onViewDetails(booking.id)}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            className="h-10 w-10 p-0 rounded-lg border-gray-200 text-gray-700"
            title="Get Directions"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="h-10 w-10 p-0 rounded-lg border-gray-200 text-gray-700"
            title="Contact"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button 
              variant="ghost" 
              className="w-full h-10 mt-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
