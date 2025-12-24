"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Booking, CounterOfferData } from "@/lib/types"
import { AlertCircle, Cloud, Info, Check, CheckCircle2, ArrowRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CounterOfferModalProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CounterOfferData) => Promise<void>
}

// Utility functions
const isDateInPast = (dateString: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

const getSunsetTime = () => "5:47 PM"

export function CounterOfferModal({ booking, open, onOpenChange, onSubmit }: CounterOfferModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [merchantNote, setMerchantNote] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Toggles
  const [enableCheckInChange, setEnableCheckInChange] = useState(false)
  const [enableCheckOutChange, setEnableCheckOutChange] = useState(false)
  const [enableDateChange, setEnableDateChange] = useState(false)
  const [enableTimeChange, setEnableTimeChange] = useState(false)
  const [enableYachtDateChange, setEnableYachtDateChange] = useState(false)
  const [enableYachtTimeChange, setEnableYachtTimeChange] = useState(false)
  const [enableActivityDateChange, setEnableActivityDateChange] = useState(false)
  const [enableActivitySlotChange, setEnableActivitySlotChange] = useState(false)
  
  // Hotel state
  const [hotelCheckIn, setHotelCheckIn] = useState("")
  const [hotelCheckOut, setHotelCheckOut] = useState("")
  const [roomType, setRoomType] = useState("")
  const [hotelPrice, setHotelPrice] = useState("")
  const [sweeteners, setSweeteners] = useState<string[]>([])
  
  // Restaurant state
  const [restaurantDate, setRestaurantDate] = useState("")
  const [restaurantTime, setRestaurantTime] = useState("")
  const [tableType, setTableType] = useState("Indoor")
  const [complimentary, setComplimentary] = useState<string[]>([])
  
  // Yacht state
  const [yachtDate, setYachtDate] = useState("")
  const [yachtTime, setYachtTime] = useState("")
  const [duration, setDuration] = useState("2hr")
  const [vessel, setVessel] = useState("")
  const [yachtAddOns, setYachtAddOns] = useState<string[]>([])
  const [backupDate, setBackupDate] = useState("")
  
  // Activity state
  const [activityDate, setActivityDate] = useState("")
  const [activitySlot, setActivitySlot] = useState("Morning")
  const [activityPackage, setActivityPackage] = useState("")
  const [pricePerPerson, setPricePerPerson] = useState("")
  const [activityAddOns, setActivityAddOns] = useState<string[]>([])
  const [participantLimit, setParticipantLimit] = useState("")
  
  // Service state
  const [declineReason, setDeclineReason] = useState("")
  const [explanation, setExplanation] = useState("")

  // Validation Logic
  const hasChanges = () => {
     if (!booking) return false
     
     if (booking.booking_type === 'hotel') {
        if (enableCheckInChange && hotelCheckIn && hotelCheckIn !== booking.booking_details.check_in) return true
        if (enableCheckOutChange && hotelCheckOut && hotelCheckOut !== booking.booking_details.check_out) return true
        if (roomType && roomType !== booking.booking_details.room_type) return true
        if (hotelPrice) return true
        if (sweeteners.length > 0) return true
     } else if (booking.booking_type === 'restaurant') {
        if (enableDateChange && restaurantDate && restaurantDate !== booking.booking_details.date) return true
        if (enableTimeChange && restaurantTime && restaurantTime !== booking.booking_details.time) return true
        if (tableType && tableType !== "Indoor") return true 
        if (complimentary.length > 0) return true
     } else if (booking.booking_type === 'yacht') {
        if (enableYachtDateChange && yachtDate) return true
        if (enableYachtTimeChange && yachtTime) return true
        if (duration && duration !== booking.booking_details.duration) return true
        if (vessel) return true 
        if (yachtAddOns.length > 0) return true
     } else if (booking.booking_type === 'activity') {
        if (enableActivityDateChange && activityDate) return true
        if (enableActivitySlotChange && activitySlot) return true
        if (activityPackage) return true
        if (pricePerPerson) return true
        if (activityAddOns.length > 0) return true
     }
     
     return false
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (merchantNote.length < 20) {
      errors.push("Merchant note must be at least 20 characters")
    }

    if ((enableCheckInChange && isDateInPast(hotelCheckIn)) ||
        (enableCheckOutChange && isDateInPast(hotelCheckOut)) ||
        (enableDateChange && isDateInPast(restaurantDate)) ||
        (enableYachtDateChange && isDateInPast(yachtDate)) ||
        (enableActivityDateChange && isDateInPast(activityDate))) {
      errors.push("Dates cannot be in the past")
    }

    if (!hasChanges()) {
        errors.push("Please modify at least one field from the original request")
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async () => {
    if (!booking) return
    
    if (!validateForm()) {
        toast({
            title: "Validation Error",
            description: "Please fix the errors before sending.",
            variant: "destructive"
        })
        return
    }

    setLoading(true)
    
    try {
      let data: CounterOfferData = {
        merchant_note: merchantNote
      }

      if (booking.booking_type === 'hotel') {
        data = {
          ...data,
          check_in: enableCheckInChange ? hotelCheckIn : booking.booking_details.check_in,
          check_out: enableCheckOutChange ? hotelCheckOut : booking.booking_details.check_out,
          room_type: roomType || booking.booking_details.room_type,
          price: hotelPrice ? parseFloat(hotelPrice) : undefined,
          sweeteners
        }
      } else if (booking.booking_type === 'restaurant') {
        data = {
          ...data,
          date: enableDateChange ? restaurantDate : booking.booking_details.date,
          time_slot: enableTimeChange ? restaurantTime : booking.booking_details.time,
          table_type: tableType,
          complimentary
        }
      } else if (booking.booking_type === 'yacht') {
        data = {
          ...data,
          date: enableYachtDateChange ? yachtDate : undefined,
          time_slot: enableYachtTimeChange ? yachtTime : undefined,
          duration,
          vessel,
          add_ons: yachtAddOns,
          weather_backup_date: backupDate
        }
      } else if (booking.booking_type === 'activity') {
        data = {
          ...data,
          date: enableActivityDateChange ? activityDate : undefined,
          time_slot_label: enableActivitySlotChange ? activitySlot : undefined,
          package: activityPackage,
          price_per_person: pricePerPerson ? parseFloat(pricePerPerson) : undefined,
          activity_add_ons: activityAddOns,
          participant_limit: participantLimit ? parseInt(participantLimit) : undefined
        }
      } else if (booking.booking_type === 'service') {
        data = {
          ...data,
          decline_reason: declineReason,
          explanation
        }
      }

      await onSubmit(data)
      onOpenChange(false)
      setMerchantNote("")
      toast({
        title: "Counter-offer sent",
        description: "The member has been notified of your offer.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to send counter-offer. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSweetener = (item: string) => {
    setSweeteners(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const toggleComplimentary = (item: string) => {
    setComplimentary(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const toggleYachtAddOn = (item: string) => {
    setYachtAddOns(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const toggleActivityAddOn = (item: string) => {
    setActivityAddOns(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  if (!booking) return null

  // Price Warning Check
  const showPriceWarning = () => {
      if (hotelPrice && booking.total_amount) {
          const price = parseFloat(hotelPrice)
          if (price < booking.total_amount * 0.5 || price > booking.total_amount * 1.5) {
              return true
          }
      }
      return false
  }

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Counter-Offer</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          <div className="space-y-6">
          {/* Original Request Summary */}
          <div className="bg-muted/50 border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Original Request
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Guest:</span> {booking.user?.name}
              </div>
              {booking.booking_type === 'hotel' && (
                <>
                  <div><span className="text-muted-foreground">Dates:</span> {booking.booking_details.check_in} - {booking.booking_details.check_out}</div>
                  <div><span className="text-muted-foreground">Room:</span> {booking.booking_details.room_type}</div>
                  {booking.total_amount > 0 && <div><span className="text-muted-foreground">Budget:</span> {formatCurrency(booking.total_amount)}</div>}
                </>
              )}
              {booking.booking_type === 'restaurant' && (
                 <>
                  <div><span className="text-muted-foreground">Date:</span> {booking.booking_details.date}</div>
                  <div><span className="text-muted-foreground">Time:</span> {booking.booking_details.time}</div>
                </>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground">Special Request:</span> {booking.booking_details.special_requests || "None"}
              </div>
            </div>
          </div>

          {/* Dynamic Form Section */}
          {booking.booking_type === 'hotel' && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="enableCheckIn" checked={enableCheckInChange} onCheckedChange={(c) => setEnableCheckInChange(!!c)} />
                    <Label htmlFor="enableCheckIn">Suggest different check-in</Label>
                </div>
                {enableCheckInChange && (
                    <div className="space-y-2 pl-6">
                        <Label>New Check-in</Label>
                        <Input type="date" value={hotelCheckIn} onChange={e => setHotelCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Checkbox id="enableCheckOut" checked={enableCheckOutChange} onCheckedChange={(c) => setEnableCheckOutChange(!!c)} />
                    <Label htmlFor="enableCheckOut">Suggest different check-out</Label>
                </div>
                {enableCheckOutChange && (
                    <div className="space-y-2 pl-6">
                        <Label>New Check-out</Label>
                        <Input type="date" value={hotelCheckOut} onChange={e => setHotelCheckOut(e.target.value)} min={hotelCheckIn || new Date().toISOString().split('T')[0]} />
                    </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Ocean View">Ocean View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₱)</Label>
                  <Input type="number" value={hotelPrice} onChange={e => setHotelPrice(e.target.value)} placeholder="0.00" />
                  {showPriceWarning() && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Price varies significantly from original
                      </p>
                  )}
                  {booking.total_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                          Suggested: {formatCurrency(booking.total_amount * 0.5)} - {formatCurrency(booking.total_amount * 1.5)}
                      </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Included Sweeteners</Label>
                <div className="grid grid-cols-1 gap-2">
                  {["Free breakfast", "Room upgrade day 2", "Late checkout", "Welcome drink"].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={item} checked={sweeteners.includes(item)} onCheckedChange={() => toggleSweetener(item)} />
                      <Label htmlFor={item} className="font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {booking.booking_type === 'restaurant' && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="enableDate" checked={enableDateChange} onCheckedChange={(c) => setEnableDateChange(!!c)} />
                    <Label htmlFor="enableDate">Suggest different date</Label>
                </div>
                {enableDateChange && (
                    <div className="pl-6">
                        <Input type="date" value={restaurantDate} onChange={e => setRestaurantDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Checkbox id="enableTime" checked={enableTimeChange} onCheckedChange={(c) => setEnableTimeChange(!!c)} />
                    <Label htmlFor="enableTime">Suggest different time</Label>
                </div>
                {enableTimeChange && (
                    <div className="pl-6">
                        <Select value={restaurantTime} onValueChange={setRestaurantTime}>
                            <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                            <SelectContent>
                            {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Table Type</Label>
                <RadioGroup value={tableType} onValueChange={setTableType} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Indoor" id="Indoor" />
                      <Label htmlFor="Indoor">Indoor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Outdoor" id="Outdoor" />
                      <Label htmlFor="Outdoor">Outdoor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Private" id="Private" />
                      <Label htmlFor="Private">Private dining room (+₱1,000)</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground ml-6">Additional charges will be added to final amount</p>
              </div>
              <div className="space-y-2">
                <Label>Complimentary Items</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Appetizer", "Dessert", "Birthday cake", "Wine"].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`comp-${item}`} checked={complimentary.includes(item)} onCheckedChange={() => toggleComplimentary(item)} />
                      <Label htmlFor={`comp-${item}`} className="font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {booking.booking_type === 'yacht' && (
             <div className="space-y-4">
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enableYachtDate" checked={enableYachtDateChange} onCheckedChange={(c) => setEnableYachtDateChange(!!c)} />
                    <Label htmlFor="enableYachtDate">Suggest different date</Label>
                  </div>
                  {enableYachtDateChange && (
                      <div className="pl-6 flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input type="date" value={yachtDate} onChange={e => setYachtDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground" title="We'll contact you if weather conditions are unsafe">
                             <Cloud className="h-4 w-4" />
                             <span className="hidden sm:inline">Partly cloudy</span>
                          </div>
                      </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="enableYachtTime" checked={enableYachtTimeChange} onCheckedChange={(c) => setEnableYachtTimeChange(!!c)} />
                    <Label htmlFor="enableYachtTime">Suggest different time</Label>
                  </div>
                  {enableYachtTimeChange && (
                      <div className="pl-6 space-y-1">
                          <Input type="time" value={yachtTime} onChange={e => setYachtTime(e.target.value)} />
                          <p className="text-xs text-blue-600 bg-blue-50 p-1 rounded inline-block">
                              ℹ️ Sunset today: {getSunsetTime()} (recommended for best views)
                          </p>
                      </div>
                  )}
               </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <RadioGroup value={duration} onValueChange={setDuration} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2hr" id="2hr" />
                    <Label htmlFor="2hr">2 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3hr" id="3hr" />
                    <Label htmlFor="3hr">3 hours (+₱2,000)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4hr" id="4hr" />
                    <Label htmlFor="4hr">4 hours (+₱4,000)</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Full day" id="Full day" />
                    <Label htmlFor="Full day">Full day (custom pricing)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Vessel</Label>
                <Select value={vessel} onValueChange={setVessel}>
                   <SelectTrigger><SelectValue placeholder="Select vessel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Speedboat">Speedboat</SelectItem>
                      <SelectItem value="Catamaran">Catamaran</SelectItem>
                      <SelectItem value="Luxury Yacht">Luxury Yacht</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label>Add-ons</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Premium catering", "Photographer", "DJ/music", "Snorkeling gear"].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`yacht-${item}`} checked={yachtAddOns.includes(item)} onCheckedChange={() => toggleYachtAddOn(item)} />
                      <Label htmlFor={`yacht-${item}`} className="font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
               <div className="space-y-2">
                  <Label>Weather Backup Date</Label>
                  <Input type="date" value={backupDate} onChange={e => setBackupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
             </div>
          )}

          {booking.booking_type === 'activity' && (
            <div className="space-y-4">
              <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enableActivityDate" checked={enableActivityDateChange} onCheckedChange={(c) => setEnableActivityDateChange(!!c)} />
                    <Label htmlFor="enableActivityDate">Suggest different date</Label>
                  </div>
                  {enableActivityDateChange && (
                       <div className="pl-6">
                          <Input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                       </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="enableActivitySlot" checked={enableActivitySlotChange} onCheckedChange={(c) => setEnableActivitySlotChange(!!c)} />
                    <Label htmlFor="enableActivitySlot">Suggest different slot</Label>
                  </div>
                   {enableActivitySlotChange && (
                       <div className="pl-6">
                            <RadioGroup value={activitySlot} onValueChange={setActivitySlot} className="flex gap-4">
                                {["Morning", "Afternoon", "Full day"].map(s => (
                                <div key={s} className="flex items-center space-x-2">
                                    <RadioGroupItem value={s} id={s} />
                                    <Label htmlFor={s}>{s}</Label>
                                </div>
                                ))}
                            </RadioGroup>
                       </div>
                   )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Package</Label>
                  <Select value={activityPackage} onValueChange={setActivityPackage}>
                    <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label>Price per Person (₱)</Label>
                  <Input type="number" value={pricePerPerson} onChange={e => setPricePerPerson(e.target.value)} placeholder="0.00" />
                </div>
              </div>
               <div className="space-y-2">
                <Label>Participant Limit</Label>
                <Input type="number" value={participantLimit} onChange={e => setParticipantLimit(e.target.value)} placeholder="Max participants" />
              </div>
               <div className="space-y-2">
                <Label>Included Add-ons</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Photos", "Lunch", "Transportation", "T-shirt"].map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`act-${item}`} checked={activityAddOns.includes(item)} onCheckedChange={() => toggleActivityAddOn(item)} />
                      <Label htmlFor={`act-${item}`} className="font-normal">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {booking.booking_type === 'service' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={declineReason} onValueChange={setDeclineReason}>
                  <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully booked">Fully booked</SelectItem>
                    <SelectItem value="Staff unavailable">Staff unavailable</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Explanation</Label>
                <Textarea 
                  value={explanation} 
                  onChange={e => setExplanation(e.target.value)} 
                  placeholder="Explain why and propose alternatives..." 
                  className="h-24" 
                />
              </div>
            </div>
          )}

          {/* Merchant Note */}
          <div className="space-y-2">
            <Label>Merchant Note <span className="text-red-500">*</span></Label>
            <Textarea 
              value={merchantNote} 
              onChange={e => setMerchantNote(e.target.value)} 
              maxLength={500}
              placeholder="We're fully booked Dec 25, but can upgrade you..."
              className={cn("h-24", merchantNote.length > 0 && merchantNote.length < 20 && "border-red-300")}
            />
             <div className="flex justify-between items-center text-xs">
                {merchantNote.length < 20 && merchantNote.length > 0 && <span className="text-red-500">Min 20 characters required</span>}
                <div className={cn("ml-auto", merchantNote.length < 20 ? "text-red-500" : "text-green-600")}>
                    {merchantNote.length}/500
                </div>
             </div>
          </div>
          
           {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <h4 className="text-sm font-semibold text-red-800 mb-1 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Please fix the following:
                  </h4>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                      {validationErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                      ))}
                  </ul>
              </div>
           )}

          </div>

          {/* Right Column: Preview Box */}
          <div className="space-y-4">
             <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-sm sticky top-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2">
                        <Info className="h-5 w-5" /> Member Preview
                    </h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Counter-Offer Received</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Original Request</h5>
                        {booking.booking_type === 'hotel' && (
                            <div className="text-sm space-y-1">
                                <p>{booking.booking_details.check_in}</p>
                                <p>{booking.booking_details.room_type}</p>
                                <p className="text-muted-foreground">{formatCurrency(booking.total_amount || 0)}</p>
                            </div>
                        )}
                        {booking.booking_type === 'restaurant' && (
                            <div className="text-sm space-y-1">
                                <p>{booking.booking_details.date}</p>
                                <p>{booking.booking_details.time}</p>
                                <p>Indoor</p>
                            </div>
                        )}
                        {booking.booking_type === 'yacht' && (
                             <div className="text-sm space-y-1">
                                <p>Requested Duration: {booking.booking_details.duration}</p>
                             </div>
                        )}
                         {booking.booking_type === 'activity' && (
                             <div className="text-sm space-y-1">
                                <p>Participants: {booking.booking_details.participants}</p>
                             </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Your Offer</h5>
                         {booking.booking_type === 'hotel' && (
                            <div className="text-sm space-y-1">
                                <p className={cn(enableCheckInChange && "text-green-600 font-medium flex items-center gap-1")}>
                                    {enableCheckInChange && <Check className="h-3 w-3" />}
                                    {enableCheckInChange ? hotelCheckIn : booking.booking_details.check_in}
                                </p>
                                <p className={cn(roomType && roomType !== booking.booking_details.room_type && "text-green-600 font-medium flex items-center gap-1")}>
                                     {roomType && roomType !== booking.booking_details.room_type && <Check className="h-3 w-3" />}
                                     {roomType || booking.booking_details.room_type}
                                </p>
                                {hotelPrice && (
                                     <p className="text-green-600 font-medium flex items-center gap-1">
                                         <Check className="h-3 w-3" /> {formatCurrency(parseFloat(hotelPrice))}
                                     </p>
                                )}
                            </div>
                        )}
                         {booking.booking_type === 'restaurant' && (
                             <div className="text-sm space-y-1">
                                 <p className={cn(enableDateChange && "text-green-600 font-medium flex items-center gap-1")}>
                                     {enableDateChange && <Check className="h-3 w-3" />}
                                     {enableDateChange ? restaurantDate : booking.booking_details.date}
                                 </p>
                                 <p className={cn(enableTimeChange && "text-green-600 font-medium flex items-center gap-1")}>
                                     {enableTimeChange && <Check className="h-3 w-3" />}
                                     {enableTimeChange ? restaurantTime : booking.booking_details.time}
                                 </p>
                                  <p className={cn(tableType && tableType !== 'Indoor' && "text-green-600 font-medium flex items-center gap-1")}>
                                     {tableType !== 'Indoor' && <Check className="h-3 w-3" />}
                                     {tableType}
                                 </p>
                             </div>
                         )}
                         {booking.booking_type === 'yacht' && (
                             <div className="text-sm space-y-1">
                                 {enableYachtDateChange && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {yachtDate}</p>}
                                 {enableYachtTimeChange && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {yachtTime}</p>}
                                 {duration && duration !== booking.booking_details.duration && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {duration}</p>}
                                 {vessel && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {vessel}</p>}
                             </div>
                         )}
                         {booking.booking_type === 'activity' && (
                             <div className="text-sm space-y-1">
                                 {enableActivityDateChange && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {activityDate}</p>}
                                 {enableActivitySlotChange && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {activitySlot}</p>}
                                 {activityPackage && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> {activityPackage}</p>}
                                 {pricePerPerson && <p className="text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> ₱{pricePerPerson}/pax</p>}
                             </div>
                         )}
                    </div>
                </div>

                <div className="bg-white/80 rounded p-3 mb-4 border border-blue-100">
                    <div className="flex items-start gap-2">
                         <Avatar className="h-8 w-8">
                             <AvatarImage src="/placeholder-logo.png" />
                             <AvatarFallback>M</AvatarFallback>
                         </Avatar>
                         <div>
                            <p className="text-xs font-semibold text-blue-900 mb-1">Message from {booking.partner?.name || "Merchant"}</p>
                            <div className="text-sm text-blue-800 italic relative">
                                <Quote className="h-3 w-3 absolute -left-2 -top-1 text-blue-300 transform -scale-x-100" />
                                {merchantNote || "Your note will appear here..."}
                            </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-2 opacity-70 pointer-events-none grayscale-[0.5]">
                    <div className="flex gap-2">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Accept Offer</Button>
                        <Button variant="outline" className="w-full">Decline</Button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">Member will see these options</p>
                </div>
             </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (
                <>
                    <span className="animate-spin mr-2">⏳</span> Sending...
                </>
            ) : "Send Counter-Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
