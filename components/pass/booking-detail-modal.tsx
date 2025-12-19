"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Booking, Partner } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  X,
  History,
  CalendarPlus,
  Ban
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface BookingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: (Booking & { partner?: Partner }) | null
}

export function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
  const { toast } = useToast()
  
  if (!booking) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Booking reference copied to clipboard.",
    })
  }

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', className: 'bg-green-100 text-green-700' }
      case 'pending':
        return { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' }
      case 'declined':
        return { label: 'Declined', className: 'bg-red-100 text-red-700' }
      case 'cancelled':
        return { label: 'Cancelled', className: 'bg-gray-100 text-gray-700' }
      case 'counter_offer_sent':
        return { label: 'Counter Offer', className: 'bg-blue-100 text-blue-700' }
      case 'completed':
        return { label: 'Completed', className: 'bg-green-100 text-green-700' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-700' }
    }
  }

  const statusConfig = getStatusConfig(booking.status)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none max-h-[90vh] overflow-y-auto">
        <div className="relative h-48 w-full bg-slate-100">
          <Image
            src={booking.partner?.logo || '/placeholder.jpg'}
            alt={booking.partner?.name || 'Partner'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-xl font-bold text-white mb-1">{booking.partner?.name}</h2>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] uppercase tracking-wider">
              {booking.partner?.category}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Booking Status</p>
              <Badge className={`${statusConfig.className} px-2 py-0.5 rounded-full border-none`}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reference</p>
              <button 
                onClick={() => copyToClipboard(booking.id)}
                className="flex items-center gap-1.5 text-sm font-mono text-slate-900 hover:text-[#0A74DA] transition-colors"
              >
                {booking.id.slice(0, 12).toUpperCase()}
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {booking.booking_details.date || booking.booking_details.check_in || 'No date set'}
              </p>
            </div>
            {booking.booking_type === 'hotel' ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Check-out</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{booking.booking_details.check_out}</p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{booking.booking_details.time || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#0A74DA]" />
              Booking Information
            </h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Booking Type</span>
                <span className="font-semibold text-slate-900 capitalize">{booking.booking_type}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Capacity/Guests</span>
                <span className="font-semibold text-slate-900">
                  {booking.booking_details.party_size || 
                   booking.booking_details.guests?.adults || 
                   booking.booking_details.participants || 
                   booking.booking_details.passengers || 1}
                </span>
              </div>
              {booking.booking_details.special_requests && (
                <div className="pt-3 border-t border-slate-200 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Special Requests</span>
                  <p className="text-xs text-slate-600 bg-yellow-50 p-2 rounded-lg border border-yellow-100 italic">
                    "{booking.booking_details.special_requests}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0A74DA]" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Standard Price</span>
                <span className="text-slate-900">₱{booking.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Member Discount</span>
                <span className="text-green-600">-₱{booking.discount_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900">Total Charged</span>
                <span className="text-base font-bold text-[#0A74DA]">₱{booking.final_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-[#0A74DA]" />
              Booking Timeline
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <div className="relative">
                <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-[#0A74DA] ring-4 ring-white" />
                <p className="text-xs font-bold text-slate-900">Requested</p>
                <p className="text-[10px] text-slate-500">{new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {(booking.status === 'confirmed' || booking.status === 'completed') && (
                <div className="relative">
                  <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-900">Confirmed</p>
                  <p className="text-[10px] text-slate-500">Partner has approved your request</p>
                </div>
              )}
              {booking.status === 'completed' && (
                <div className="relative">
                  <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-900">Checked In / Completed</p>
                  <p className="text-[10px] text-slate-500">Service rendered and finalized</p>
                </div>
              )}
              {booking.status === 'cancelled' && (
                <div className="relative">
                  <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-900">Cancelled</p>
                  <p className="text-[10px] text-slate-500">Booking was cancelled</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#0A74DA]" />
              Utility Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-10 rounded-xl gap-2 text-xs border-slate-200" onClick={() => toast({ title: "Coming Soon", description: "Add to Calendar will be available soon." })}>
                <CalendarPlus className="h-4 w-4" />
                Add to Calendar
              </Button>
              <Button variant="outline" className="h-10 rounded-xl gap-2 text-xs border-slate-200" onClick={() => toast({ title: "Contact Support", description: "Connecting to support chat..." })}>
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button className="h-12 bg-[#0A74DA] hover:bg-[#0861b5] rounded-xl gap-2 text-xs">
                <MapPin className="h-4 w-4" />
                Directions
              </Button>
              <Button variant="outline" className="h-12 rounded-xl gap-2 text-xs border-slate-200">
                <Phone className="h-4 w-4" />
                Call Partner
              </Button>
            </div>
            <Button variant="outline" className="h-12 w-full rounded-xl gap-2 text-xs border-slate-200 text-slate-600">
              <ExternalLink className="h-4 w-4" />
              Download Confirmation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
