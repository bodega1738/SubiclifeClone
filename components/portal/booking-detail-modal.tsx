"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Edit, Shield, XCircle } from "lucide-react"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Booking, AcceptData, DeclineData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BookingDetailModalProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: (bookingId: string, data: AcceptData) => Promise<void>
  onDecline: (bookingId: string, data: DeclineData) => Promise<void>
  onCounter: (bookingId: string) => void
}

export function BookingDetailModal({
  booking,
  open,
  onOpenChange,
  onAccept,
  onDecline,
  onCounter,
}: BookingDetailModalProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [acceptData, setAcceptData] = useState<AcceptData>({
    roomOrTable: "",
    internalNote: "",
  })
  
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineData, setDeclineData] = useState<DeclineData>({
    reason: "",
    explanation: "",
  })
  const [declineError, setDeclineError] = useState("")

  if (!booking) return null

  const handleAccept = async () => {
    await onAccept(booking.id, acceptData)
    setShowAcceptModal(false)
    onOpenChange(false)
  }

  const handleDecline = async () => {
    if (!declineData.reason || !declineData.explanation) {
      setDeclineError("Both fields are required")
      return
    }
    await onDecline(booking.id, declineData)
    setShowDeclineModal(false)
    onOpenChange(false)
  }

  const getTierColor = (tier: string | undefined | null) => {
    switch (tier) {
      case "elite":
        return "bg-blue-600 hover:bg-blue-600"
      case "premium":
        return "bg-green-600 hover:bg-green-600"
      default:
        return "bg-gray-600 hover:bg-gray-600"
    }
  }

  const commissionRate = booking.partner?.commission_rate || 0.1
  const commission = booking.final_amount * commissionRate
  const netAmount = booking.final_amount - commission
  const discountPercent = Math.round((booking.discount_amount / booking.total_amount) * 100) || 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Review booking request details</DialogDescription>
          </DialogHeader>

          {/* Member Card Section */}
          <div className="flex items-start gap-4 border-b pb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.user?.name}`} />
              <AvatarFallback>{booking.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">{booking.user?.name}</h3>
                <Badge className={cn("uppercase", getTierColor(booking.user?.tier))}>
                  {booking.user?.tier || "Basic"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Member since {booking.user?.createdAt ? format(new Date(booking.user.createdAt), "MMM yyyy") : "N/A"} • {booking.user?.points || 0} points
              </p>
              <div className="flex gap-3 pt-1">
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" /> Verified
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-600">
                  <Shield className="h-4 w-4" /> ₱{booking.user?.insuranceAmount || 0}M Coverage
                </span>
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Package</p>
              <p className="text-lg font-bold text-gray-900">{booking.booking_details.package_name || "Standard Booking"}</p>
            </div>

            {booking.booking_type === 'hotel' && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Check-in</p>
                  <p className="text-base text-gray-900">{booking.booking_details.check_in}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Check-out</p>
                  <p className="text-base text-gray-900">{booking.booking_details.check_out}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Room Type</p>
                  <p className="text-base text-gray-900">{booking.booking_details.room_type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Guests</p>
                  <p className="text-base text-gray-900">
                    {booking.booking_details.guests?.adults} Adults, {booking.booking_details.guests?.children} Children
                  </p>
                </div>
              </>
            )}

            {booking.booking_type === 'restaurant' && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Date</p>
                  <p className="text-base text-gray-900">{booking.booking_details.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Time</p>
                  <p className="text-base text-gray-900">{booking.booking_details.time}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Party Size</p>
                  <p className="text-base text-gray-900">{booking.booking_details.party_size} People</p>
                </div>
              </>
            )}
            
            {/* Add other types as needed based on booking_type */}
          </div>

          {/* Pricing Breakdown */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Package Rate</span>
                <span>₱{booking.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount ({discountPercent}%)</span>
                <span>-₱{booking.discount_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-semibold text-green-600">
                <span>Subtotal</span>
                <span>₱{booking.final_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Commission ({Math.round(commissionRate * 100)}%)</span>
                <span>-₱{commission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-xs font-bold uppercase text-gray-500">Your Net</span>
                <span className="text-2xl font-black text-gray-900">₱{netAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.booking_details.special_requests && (
            <div className="rounded-r border-l-4 border-yellow-400 bg-yellow-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                <p className="text-sm italic text-gray-700">{booking.booking_details.special_requests}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button 
              onClick={() => setShowAcceptModal(true)}
              className="h-12 flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Accept
            </Button>
            <Button 
              onClick={() => {
                onOpenChange(false)
                setTimeout(() => onCounter(booking.id), 150)
              }}
              variant="outline"
              className="h-12 flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Edit className="mr-2 h-4 w-4" /> Counter
            </Button>
            <Button 
              onClick={() => setShowDeclineModal(true)}
              variant="outline"
              className="h-12 flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" /> Decline
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Accept Confirmation Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Confirm this booking?</DialogTitle>
            <DialogDescription className="sr-only">Confirm acceptance details</DialogDescription>
          </DialogHeader>
          
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-700">Member will be notified immediately</p>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Room/Table Assignment (Optional)</label>
              <Select 
                value={acceptData.roomOrTable} 
                onValueChange={(val) => setAcceptData({...acceptData, roomOrTable: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign room/table..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room-101">Room 101</SelectItem>
                  <SelectItem value="room-102">Room 102</SelectItem>
                  <SelectItem value="table-5">Table 5</SelectItem>
                  <SelectItem value="table-6">Table 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Internal Note</label>
              <Textarea 
                placeholder="Add internal notes..." 
                rows={3}
                value={acceptData.internalNote}
                onChange={(e) => setAcceptData({...acceptData, internalNote: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAcceptModal(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAccept}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decline Confirmation Modal */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">Decline this booking?</DialogTitle>
            <DialogDescription className="sr-only">Provide reason for decline</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">This action cannot be undone</p>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason <span className="text-red-500">*</span></label>
              <Select 
                value={declineData.reason} 
                onValueChange={(val) => setDeclineData({...declineData, reason: val})}
              >
                <SelectTrigger className={declineError && !declineData.reason ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully_booked">Fully booked</SelectItem>
                  <SelectItem value="unavailable_dates">Unavailable dates</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="weather">Weather conditions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Explanation for Guest <span className="text-red-500">*</span></label>
              <Textarea 
                placeholder="Explain to the guest why you're declining..." 
                rows={4}
                value={declineData.explanation}
                onChange={(e) => setDeclineData({...declineData, explanation: e.target.value})}
                className={declineError && !declineData.explanation ? "border-red-500" : ""}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{declineError && <span className="text-red-500">{declineError}</span>}</span>
                <span>{declineData.explanation.length}/500</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDeclineModal(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDecline}>
              Decline Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
