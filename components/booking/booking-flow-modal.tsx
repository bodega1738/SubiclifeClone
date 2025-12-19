"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Users, Info, CreditCard, Check, Loader2, Minus, Plus, 
  Sun, CloudRain, ShieldCheck, QrCode, ArrowRight, Download
} from "lucide-react"
import { Drawer } from "vaul"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, addDays, isBefore, startOfToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useUser, discountPercentages } from "@/lib/user-context"
import { mockSupabase as supabase } from "@/lib/mock-db"
import type { Partner, Booking } from "@/lib/types"

// --- Types & Schemas ---

type BookingType = 'hotel' | 'restaurant' | 'yacht' | 'activity'

interface BookingFlowModalProps {
  isOpen: boolean
  onClose: () => void
  partner: Partner
  bookingType: BookingType
}

// Validation Schemas
const hotelSchema = z.object({
  dates: z.object({
    from: z.date(),
    to: z.date()
  }).refine(data => data.to > data.from, { message: "Check-out must be after check-in" }),
  roomType: z.string().min(1, "Please select a room type"),
  guests: z.object({
    adults: z.number().min(1),
    children: z.number().min(0)
  }),
  specialRequests: z.string().max(500).optional()
})

const restaurantSchema = z.object({
  date: z.date(),
  timeSlot: z.string().min(1, "Please select a time slot"),
  partySize: z.number().min(1).max(20),
  dietary: z.array(z.string()).optional(),
  specialRequests: z.string().max(500).optional(),
  addToCalendar: z.boolean().default(false)
})

const yachtSchema = z.object({
  package: z.string().min(1, "Please select a package"),
  date: z.date(),
  timeSlot: z.string().min(1, "Please select a time"),
  passengers: z.number().min(1).max(20),
  addOns: z.array(z.string()).optional(),
  backupDate: z.date().optional()
})

const activitySchema = z.object({
  activityId: z.string().min(1),
  date: z.date(),
  timeSlot: z.string().min(1),
  participants: z.array(z.object({
    name: z.string().min(2),
    age: z.number().min(0),
    height: z.string().optional(),
    weight: z.string().optional()
  })).min(1),
  waivers: z.object({
    health: z.boolean().refine(v => v === true),
    liability: z.boolean().refine(v => v === true),
    photo: z.boolean().refine(v => v === true)
  })
})


// --- Shared Components ---

const StepperControl = ({ value, onChange, min = 0, max = 10, label }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="font-medium text-gray-700">{label}</span>
    <div className="flex items-center gap-4">
      <button 
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center active:bg-gray-50 disabled:opacity-50"
        disabled={value <= min}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-6 text-center font-bold">{value}</span>
      <button 
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center active:bg-gray-50 disabled:opacity-50"
        disabled={value >= max}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
)

const TimeSlotGrid = ({ slots, selected, onSelect }: any) => (
  <div className="grid grid-cols-3 gap-2">
    {slots.map((slot: string) => (
      <button
        key={slot}
        type="button"
        onClick={() => onSelect(slot)}
        className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all ${
          selected === slot 
            ? "bg-[#135bec] border-[#135bec] text-white" 
            : "bg-white border-gray-200 text-gray-600 hover:border-[#135bec]/30"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
)

const PricingBreakdown = ({ items, total, discount }: any) => (
  <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
    {items.map((item: any, i: number) => (
      <div key={i} className="flex justify-between text-sm">
        <span className="text-gray-500">{item.label}</span>
        <span className="font-medium text-gray-900">₱{item.amount.toLocaleString()}</span>
      </div>
    ))}
    {discount > 0 && (
      <div className="flex justify-between text-sm text-green-600 font-medium">
        <span>Tier Discount</span>
        <span>-₱{discount.toLocaleString()}</span>
      </div>
    )}
    <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
      <span className="font-bold text-gray-900">Total</span>
      <span className="text-2xl font-bold text-[#135bec]">₱{total.toLocaleString()}</span>
    </div>
  </div>
)

// --- Main Component ---

export function BookingFlowModal({ isOpen, onClose, partner, bookingType }: BookingFlowModalProps) {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [confNumber, setConfNumber] = useState("")

  const totalSteps = {
    hotel: 6,
    restaurant: 4,
    yacht: 5,
    activity: 6
  }[bookingType]

  const form = useForm({
    defaultValues: {
      dates: { from: new Date(), to: addDays(new Date(), 1) },
      roomType: "",
      guests: { adults: 1, children: 0 },
      specialRequests: "",
      date: new Date(),
      timeSlot: "",
      partySize: 2,
      dietary: [],
      addToCalendar: false,
      package: "",
      passengers: 2,
      addOns: [],
      backupDate: undefined,
      activityId: "1",
      participants: [{ name: "", age: 18, height: "", weight: "" }],
      waivers: { health: false, liability: false, photo: false }
    }
  })

  const nextStep = async () => {
    // Basic validation logic for current step would go here
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleBookingSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const formData = form.getValues()
      const userTier = user?.tier || "starter"
      const discountRate = userTier === "elite" && partner.eliteDiscount 
        ? partner.eliteDiscount 
        : (partner.discount || discountPercentages[userTier] || 5)

      // Mock calculation for demo
      const baseAmount = 5000 
      const discountAmount = baseAmount * (discountRate / 100)
      const finalAmount = baseAmount - discountAmount

      const bookingData = {
        user_id: user?.id,
        partner_id: partner.id,
        booking_type: bookingType,
        booking_details: formData,
        status: 'pending',
        payment_status: bookingType === 'restaurant' ? 'pending' : 'paid',
        total_amount: baseAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
      }

      const { data: booking, error: bookingError } = await supabase.from('bookings').insert(bookingData)
      if (bookingError) throw bookingError

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user?.id,
        partner_id: partner.id,
        type: 'booking_request',
        title: 'Booking Requested',
        message: `Your request for ${partner.name} has been sent.`,
        read: false
      })

      const generatedId = (booking as any).id || `SL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setConfNumber(generatedId)
      setIsSuccess(true)

      // Award points (500)
      if (user?.id) {
        await supabase.rpc('add_points', {
          user_id: user.id,
          points: 500
        })
      }

    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (bookingType) {
      case 'hotel':
        return renderHotelSteps()
      case 'restaurant':
        return renderRestaurantSteps()
      case 'yacht':
        return renderYachtSteps()
      case 'activity':
        return renderActivitySteps()
      default:
        return null
    }
  }

  // --- STEP RENDERERS ---

  const renderHotelSteps = () => {
    switch (step) {
      case 1: // Dates
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Select Dates</h3>
            <div className="rounded-2xl border border-gray-100 p-2 bg-gray-50/50">
              <Controller
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => isBefore(date, startOfToday())}
                    className="mx-auto"
                  />
                )}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Info className="w-4 h-4" />
              <span>Standard check-in: 2:00 PM</span>
            </div>
          </div>
        )
      case 2: // Room Type
        const rooms = [
          { id: 'standard', name: 'Standard Room', price: 4500, features: ['1 King Bed', 'City View', 'Free Wi-Fi'] },
          { id: 'deluxe', name: 'Deluxe Suite', price: 7500, features: ['1 King Bed', 'Ocean View', 'Bathtub', 'Balcony'] },
          { id: 'suite', name: 'Executive Suite', price: 12000, features: ['2 King Beds', 'Panoramic View', 'Private Lounge Access'] }
        ]
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Choose Room</h3>
            <div className="space-y-3">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  onClick={() => form.setValue('roomType', room.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    form.watch('roomType') === room.id 
                      ? "border-[#135bec] bg-blue-50/50" 
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">{room.name}</span>
                    <span className="font-bold text-[#135bec]">₱{room.price.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map(f => (
                      <span key={f} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 3: // Guests
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Number of Guests</h3>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <Controller
                control={form.control}
                name="guests.adults"
                render={({ field }) => <StepperControl label="Adults" {...field} min={1} max={10} />}
              />
              <Controller
                control={form.control}
                name="guests.children"
                render={({ field }) => <StepperControl label="Children" {...field} min={0} max={6} />}
              />
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-sm text-orange-700">
                Children above 12 years old are considered adults.
              </p>
            </div>
          </div>
        )
      case 4: // Special Requests
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Special Requests</h3>
            <div className="space-y-2">
              <Label>Message for the hotel (optional)</Label>
              <Textarea 
                placeholder="High floor, early check-in, dietary restrictions, etc."
                className="h-40 rounded-2xl"
                {...form.register('specialRequests')}
              />
              <div className="text-right text-xs text-gray-400">
                {form.watch('specialRequests')?.length || 0} / 500
              </div>
            </div>
          </div>
        )
      case 5: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Review Trip</h3>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
              <img src={partner.logo} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold">{partner.name}</h4>
                <p className="text-sm text-gray-500">{form.watch('roomType')} - {form.watch('guests.adults')} Adults</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Check-in</p>
                <p className="font-bold">{format(form.watch('dates.from'), 'MMM dd, yyyy')}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Check-out</p>
                <p className="font-bold">{format(form.watch('dates.to'), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <PricingBreakdown 
              items={[{ label: 'Room Charge (2 nights)', amount: 9000 }, { label: 'Service Fee', amount: 500 }]}
              total={9500 * (1 - (user?.tier === 'elite' ? 20 : 10)/100)}
              discount={9500 * ((user?.tier === 'elite' ? 20 : 10)/100)}
            />
          </div>
        )
      case 6: // Payment
        return renderPaymentStep()
    }
  }

  const renderRestaurantSteps = () => {
    switch (step) {
      case 1: // Date & Time
        const slots = ['11:30', '12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30', '20:00']
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Select Date & Time</h3>
            <div className="rounded-2xl border border-gray-100 p-2 bg-gray-50/50">
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => isBefore(date, startOfToday())}
                    className="mx-auto"
                  />
                )}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-500">Available Slots</Label>
              <Controller
                control={form.control}
                name="timeSlot"
                render={({ field }) => <TimeSlotGrid slots={slots} selected={field.value} onSelect={field.onChange} />}
              />
            </div>
          </div>
        )
      case 2: // Party Size
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Party Size</h3>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <Controller
                control={form.control}
                name="partySize"
                render={({ field }) => <StepperControl label="Guests" {...field} min={1} max={20} />}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-500">Dietary Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'No Seafood'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const current = form.getValues('dietary') || []
                      const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
                      form.setValue('dietary', next)
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      (form.watch('dietary') || []).includes(tag)
                        ? "bg-blue-100 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 3: // Special Requests
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Special Requests</h3>
            <Textarea 
              placeholder="Anniversary, window seat, high chair, etc."
              className="h-40 rounded-2xl"
              {...form.register('specialRequests')}
            />
            <div className="flex items-center space-x-2 p-2">
              <Checkbox 
                id="calendar" 
                checked={form.watch('addToCalendar')} 
                onCheckedChange={(checked) => form.setValue('addToCalendar', !!checked)} 
              />
              <label htmlFor="calendar" className="text-sm font-medium leading-none">Add to calendar after confirmation</label>
            </div>
          </div>
        )
      case 4: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Confirm Reservation</h3>
            <div className="p-6 rounded-2xl bg-[#135bec] text-white space-y-4 shadow-lg shadow-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-bold">{partner.name}</h4>
                  <p className="opacity-80">Subic Bay</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs opacity-60 uppercase tracking-widest">Date</p>
                  <p className="font-bold">{format(form.watch('date'), 'MMM dd')}</p>
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase tracking-widest">Time</p>
                  <p className="font-bold">{form.watch('timeSlot')}</p>
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase tracking-widest">Guests</p>
                  <p className="font-bold">{form.watch('partySize')} People</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
              Note: No payment is required for this reservation. You will pay directly at the restaurant.
            </div>
          </div>
        )
    }
  }

  const renderYachtSteps = () => {
    switch (step) {
      case 1: // Package
        const packages = [
          { id: '2hr', name: 'Sunset Cruise', duration: '2 Hours', price: 15000, capacity: '15 pax' },
          { id: '4hr', name: 'Half Day Adventure', duration: '4 Hours', price: 28000, capacity: '15 pax' },
          { id: '8hr', name: 'Full Day Escape', duration: '8 Hours', price: 50000, capacity: '15 pax' }
        ]
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Select Package</h3>
            <div className="space-y-3">
              {packages.map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => form.setValue('package', pkg.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    form.watch('package') === pkg.id 
                      ? "border-[#135bec] bg-blue-50/50" 
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-lg">{pkg.name}</span>
                    <span className="font-bold text-[#135bec]">₱{pkg.price.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Loader2 className="w-3 h-3" /> {pkg.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {pkg.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 2: // Date & Time
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Departure Date</h3>
            <div className="rounded-2xl border border-gray-100 p-2 bg-gray-50/50">
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => isBefore(date, startOfToday())}
                    className="mx-auto"
                  />
                )}
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-center">
              <Sun className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm font-bold text-blue-900">Clear Skies Expected</p>
                <p className="text-xs text-blue-700">Sunset at 18:30 in Subic Bay</p>
              </div>
            </div>
          </div>
        )
      case 3: // Passengers & Add-ons
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Passengers & Extras</h3>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <Controller
                control={form.control}
                name="passengers"
                render={({ field }) => <StepperControl label="Total Passengers" {...field} min={1} max={15} />}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-500">Add-ons</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cat', label: 'Catering', price: 5000 },
                  { id: 'photo', label: 'Photographer', price: 3500 },
                  { id: 'dj', label: 'DJ / Music', price: 6000 },
                  { id: 'eq', label: 'Watersports Gear', price: 2000 }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const current = form.getValues('addOns') || []
                      const next = current.includes(item.id) ? current.filter(t => t !== item.id) : [...current, item.id]
                      form.setValue('addOns', next)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      (form.watch('addOns') || []).includes(item.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs text-[#135bec]">+₱{item.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 4: // Weather Backup
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Weather Policy</h3>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                Safety is our priority. If the Coast Guard issues a Small Craft Advisory, we will offer a full refund or reschedule to your backup date.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Optional Backup Date</Label>
              <div className="rounded-xl border border-gray-100 p-2">
                <Controller
                  control={form.control}
                  name="backupDate"
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => isBefore(date, startOfToday())}
                      className="mx-auto scale-90"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )
      case 5: // Payment
        return renderPaymentStep()
    }
  }

  const renderActivitySteps = () => {
    switch (step) {
      case 1: // Selection
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Select Activity</h3>
            <div className="grid gap-3">
              {[
                { id: '1', name: 'Zipline Adventure', price: 1200 },
                { id: '2', name: 'Forest Trekking', price: 800 },
                { id: '3', name: 'Night Safari', price: 1500 }
              ].map(act => (
                <div 
                  key={act.id}
                  onClick={() => form.setValue('activityId', act.id)}
                  className={`p-4 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all ${
                    form.watch('activityId') === act.id ? "border-[#135bec] bg-blue-50" : "border-gray-100"
                  }`}
                >
                  <span className="font-bold">{act.name}</span>
                  <span className="font-bold text-[#135bec]">₱{act.price}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 2: // Date & Time
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Schedule</h3>
            <div className="rounded-2xl border border-gray-100 p-2 bg-gray-50/50">
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => isBefore(date, startOfToday())}
                    className="mx-auto"
                  />
                )}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-500">Session</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Morning', 'Afternoon', 'Full Day'].map(session => (
                  <button
                    key={session}
                    onClick={() => form.setValue('timeSlot', session)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      form.watch('timeSlot') === session ? "bg-[#135bec] text-white border-[#135bec]" : "bg-white text-gray-600 border-gray-100"
                    }`}
                  >
                    {session}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 3: // Participants
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Participant Info</h3>
            <div className="space-y-4">
              {form.watch('participants').map((p, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Participant {i+1}</span>
                    {i > 0 && (
                      <button onClick={() => {
                        const current = form.getValues('participants')
                        form.setValue('participants', current.filter((_, idx) => idx !== i))
                      }} className="text-red-500 text-xs font-bold">Remove</button>
                    )}
                  </div>
                  <Input placeholder="Full Name" {...form.register(`participants.${i}.name` as any)} className="bg-white border-0" />
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" placeholder="Age" {...form.register(`participants.${i}.age` as any)} className="bg-white border-0" />
                    <Input placeholder="Ht (cm)" {...form.register(`participants.${i}.height` as any)} className="bg-white border-0" />
                    <Input placeholder="Wt (kg)" {...form.register(`participants.${i}.weight` as any)} className="bg-white border-0" />
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => {
                  const current = form.getValues('participants')
                  form.setValue('participants', [...current, { name: "", age: 18, height: "", weight: "" }])
                }}
                className="w-full h-12 border-dashed border-2 rounded-2xl"
              >
                + Add Another Participant
              </Button>
            </div>
          </div>
        )
      case 4: // Waiver
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Safety Waiver</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-2xl">
                <Checkbox 
                  id="w1" 
                  checked={form.watch('waivers.health')}
                  onCheckedChange={(c) => form.setValue('waivers.health', !!c)}
                />
                <label htmlFor="w1" className="text-sm leading-relaxed">I declare that all participants are in good health and have no medical conditions that would prevent participation.</label>
              </div>
              <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-2xl">
                <Checkbox 
                  id="w2" 
                  checked={form.watch('waivers.liability')}
                  onCheckedChange={(c) => form.setValue('waivers.liability', !!c)}
                />
                <label htmlFor="w2" className="text-sm leading-relaxed">I assume all risks and release the partner and Subiclife from any liability for injury or damage.</label>
              </div>
              <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-2xl">
                <Checkbox 
                  id="w3" 
                  checked={form.watch('waivers.photo')}
                  onCheckedChange={(c) => form.setValue('waivers.photo', !!c)}
                />
                <label htmlFor="w3" className="text-sm leading-relaxed">I consent to the use of photos or videos taken during the activity for promotional purposes.</label>
              </div>
            </div>
          </div>
        )
      case 5: // Payment
        return renderPaymentStep()
    }
  }

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Payment Method</h3>
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-2xl h-14">
          <TabsTrigger value="card" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Card</TabsTrigger>
          <TabsTrigger value="gcash" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">GCash</TabsTrigger>
          <TabsTrigger value="maya" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Maya</TabsTrigger>
        </TabsList>
        <TabsContent value="card" className="mt-6 space-y-4">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-gray-400">Card Information</Label>
            <div className="relative">
              <Input placeholder="0000 0000 0000 0000" className="h-14 rounded-2xl pl-12" />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM / YY" className="h-14 rounded-2xl" />
              <Input placeholder="CVV" className="h-14 rounded-2xl" />
            </div>
            <Input placeholder="Cardholder Name" className="h-14 rounded-2xl" />
          </div>
          <div className="flex items-center justify-center gap-2 py-4 grayscale opacity-50">
            <img src="/visa-logo-generic.png" className="h-5" />
            <img src="/mastercard-logo.png" className="h-5" />
            <span className="text-[10px] font-bold">SECURED BY STRIPE</span>
          </div>
        </TabsContent>
        <TabsContent value="gcash" className="mt-6 text-center py-8 space-y-4 bg-blue-50 rounded-3xl">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
            <span className="text-white font-black text-2xl">G</span>
          </div>
          <p className="text-sm text-blue-900 font-medium px-8">You'll be redirected to GCash to complete your transaction.</p>
        </TabsContent>
        <TabsContent value="maya" className="mt-6 text-center py-8 space-y-4 bg-green-50 rounded-3xl">
          <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto flex items-center justify-center overflow-hidden">
             <img src="/paymaya-maya-logo-green.jpg" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-green-900 font-medium px-8">You'll be redirected to Maya to complete your transaction.</p>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in slide-in-from-bottom duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 scale-110">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Requested!</h2>
      <p className="text-gray-500 mb-8">Your request has been sent to {partner.name}. We'll notify you once they confirm.</p>
      
      <div className="w-full bg-gray-50 rounded-3xl p-6 mb-8 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-medium">Confirmation ID</span>
          <span className="font-bold text-gray-900">{confNumber}</span>
        </div>
        <div className="py-4 flex justify-center border-y border-gray-100">
          <QrCode className="w-32 h-32 text-gray-900" />
        </div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Show this QR during check-in</p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        <Button 
          onClick={() => { onClose(); router.push('/pass') }} 
          className="h-14 rounded-2xl bg-[#135bec] text-white font-bold"
        >
          View My Bookings
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => { onClose(); router.push('/home') }}
          className="h-14 rounded-2xl font-bold text-gray-500"
        >
          Return Home
        </Button>
      </div>
    </div>
  )

  return (
    <Drawer.Root open={isOpen} onClose={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] h-[92vh] fixed bottom-0 left-0 right-0 z-[101] focus:outline-none">
          
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 mt-4 mb-2" />
          
          {isSuccess ? renderSuccess() : (
            <>
              {/* Header */}
              <div className="px-6 flex items-center justify-between py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button onClick={prevStep} className="p-2 -ml-2 rounded-full active:bg-gray-100">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  <div>
                    <h2 className="font-black text-lg">Booking</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Step {step} of {totalSteps}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-100 active:scale-90 transition-transform">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <Progress value={(step / totalSteps) * 100} className="h-1 rounded-none bg-gray-100" />

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
                {renderStep()}
              </div>

              {/* Footer Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Total</p>
                  <p className="text-xl font-bold">₱{ (bookingType === 'restaurant' ? 0 : 5000).toLocaleString() }</p>
                </div>
                
                {step === totalSteps ? (
                  <Button 
                    disabled={isSubmitting}
                    onClick={handleBookingSubmit}
                    className="h-14 px-8 rounded-2xl bg-[#135bec] text-white font-bold shadow-lg shadow-blue-100 min-w-[160px]"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      bookingType === 'restaurant' ? 'Confirm Request' : 'Pay & Book'
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    className="h-14 px-8 rounded-2xl bg-[#135bec] text-white font-bold shadow-lg shadow-blue-100 flex items-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
