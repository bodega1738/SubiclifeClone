"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Booking, CounterOfferData } from "@/lib/types"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CounterOfferModalProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CounterOfferData) => Promise<void>
}

export function CounterOfferModal({ booking, open, onOpenChange, onSubmit }: CounterOfferModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [merchantNote, setMerchantNote] = useState("")
  
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

  const handleSubmit = async () => {
    if (!booking) return
    if (!merchantNote) {
      toast({
        title: "Note required",
        description: "Please add a note explaining the counter-offer.",
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
          check_in: hotelCheckIn || booking.booking_details.check_in,
          check_out: hotelCheckOut || booking.booking_details.check_out,
          room_type: roomType || booking.booking_details.room_type,
          price: hotelPrice ? parseFloat(hotelPrice) : undefined,
          sweeteners
        }
      } else if (booking.booking_type === 'restaurant') {
        data = {
          ...data,
          date: restaurantDate || booking.booking_details.date,
          time_slot: restaurantTime || booking.booking_details.time,
          table_type: tableType,
          complimentary
        }
      } else if (booking.booking_type === 'yacht') {
        data = {
          ...data,
          date: yachtDate,
          time_slot: yachtTime,
          duration,
          vessel,
          add_ons: yachtAddOns,
          weather_backup_date: backupDate
        }
      } else if (booking.booking_type === 'activity') {
        data = {
          ...data,
          date: activityDate,
          time_slot_label: activitySlot,
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
      // Reset other states if needed, but component remounting handles it usually if key changes or props change
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Counter-Offer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in</Label>
                  <Input type="date" value={hotelCheckIn} onChange={e => setHotelCheckIn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Check-out</Label>
                  <Input type="date" value={hotelCheckOut} onChange={e => setHotelCheckOut(e.target.value)} />
                </div>
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
                </div>
              </div>
              <div className="space-y-2">
                <Label>Included Sweeteners</Label>
                <div className="grid grid-cols-2 gap-2">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={restaurantDate} onChange={e => setRestaurantDate(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={restaurantTime} onValueChange={setRestaurantTime}>
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Table Type</Label>
                <RadioGroup value={tableType} onValueChange={setTableType} className="flex gap-4">
                  {["Indoor", "Outdoor", "Private"].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
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
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={yachtDate} onChange={e => setYachtDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={yachtTime} onChange={e => setYachtTime(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <RadioGroup value={duration} onValueChange={setDuration} className="flex gap-4">
                  {["2hr", "3hr", "4hr", "Full day"].map(d => (
                    <div key={d} className="flex items-center space-x-2">
                      <RadioGroupItem value={d} id={d} />
                      <Label htmlFor={d}>{d}</Label>
                    </div>
                  ))}
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
                  <Input type="date" value={backupDate} onChange={e => setBackupDate(e.target.value)} />
                </div>
             </div>
          )}

          {booking.booking_type === 'activity' && (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Slot</Label>
                  <RadioGroup value={activitySlot} onValueChange={setActivitySlot} className="flex gap-4">
                    {["Morning", "Afternoon", "Full day"].map(s => (
                      <div key={s} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={s} />
                        <Label htmlFor={s}>{s}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
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
              className={cn("h-24", !merchantNote && "border-input")}
            />
            <div className="text-xs text-right text-muted-foreground">{merchantNote.length}/500</div>
          </div>

          {/* Preview Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Member Preview</h4>
            <p className="text-sm text-blue-800">
              {merchantNote || "Your note will appear here..."}
            </p>
            <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-700">
               {hotelPrice && <div>New Price: ₱{hotelPrice}</div>}
               {pricePerPerson && <div>Price/Person: ₱{pricePerPerson}</div>}
               {sweeteners.length > 0 && <div>Includes: {sweeteners.join(", ")}</div>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!merchantNote || loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Sending..." : "Send Counter-Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
