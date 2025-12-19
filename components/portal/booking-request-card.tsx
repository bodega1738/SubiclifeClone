'use strict'

import React from 'react'
import { Booking } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Edit, X, Calendar, Users, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingRequestCardProps {
  booking: Booking
  onAccept: (id: string) => void
  onCounter: (id: string) => void
  onDecline: (id: string) => void
}

export function BookingRequestCard({
  booking,
  onAccept,
  onCounter,
  onDecline
}: BookingRequestCardProps) {
  const { user, booking_details, created_at, total_amount, discount_amount, final_amount, partner } = booking
  const commissionRate = partner?.commission_rate || 0.1
  const commissionAmount = final_amount * commissionRate
  const netAmount = final_amount - commissionAmount

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMins < 60) return `${diffInMins} mins ago`
    const diffInHours = Math.floor(diffInMins / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return date.toLocaleDateString()
  }

  const getTierColor = (tier: string | null | undefined) => {
    switch (tier?.toLowerCase()) {
      case 'elite':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'premium':
        return 'bg-green-50 text-green-600 border-green-100'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <div className="relative rounded-xl border-l-4 border-blue-500 p-4 shadow-sm bg-white overflow-hidden">
      <div className="absolute top-2 right-2">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          NEW
        </span>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-10 w-10 border border-gray-100">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-1.5 h-4", getTierColor(user?.tier))}>
              {user?.tier || 'Basic'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatTime(created_at)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-bold text-gray-800">{booking_details.package_name}</h4>
        
        <div className="grid grid-cols-1 gap-1.5">
          {booking_details.check_in && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{booking_details.check_in} - {booking_details.check_out}</span>
            </div>
          )}
          {booking_details.date && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{booking_details.date} at {booking_details.time}</span>
            </div>
          )}
          {booking_details.guests && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>{booking_details.guests.adults} Adults, {booking_details.guests.children} Children</span>
            </div>
          )}
          {booking_details.party_size && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Party of {booking_details.party_size}</span>
            </div>
          )}
          {booking_details.special_requests && (
            <p className="text-xs text-gray-500 italic mt-1 bg-gray-50 p-2 rounded border border-dashed border-gray-200">
              "{booking_details.special_requests}"
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-3 mt-3 space-y-1 bg-gray-50/50 -mx-4 px-4 pb-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Package Rate</span>
          <span className="font-medium">₱{total_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Discount</span>
          <span className="text-red-600 font-medium">-₱{discount_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-100">
          <span className="font-semibold text-gray-700">Subtotal</span>
          <span className="text-green-600 font-bold">₱{final_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-gray-400">
          <span>Commission ({Math.round(commissionRate * 100)}%)</span>
          <span>-₱{commissionAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Your Net</span>
          <span className="text-lg font-black text-gray-900 leading-none">₱{netAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          onClick={() => onAccept(booking.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 rounded-lg font-bold gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Accept
        </Button>
        <Button 
          variant="outline"
          onClick={() => onCounter(booking.id)}
          className="flex-1 border-2 border-gray-300 hover:bg-gray-50 h-10 rounded-lg font-bold gap-2 text-gray-700"
        >
          <Edit className="w-4 h-4" />
          Counter
        </Button>
        <Button 
          variant="outline"
          onClick={() => onDecline(booking.id)}
          className="w-10 h-10 p-0 border-2 border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg shrink-0"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
