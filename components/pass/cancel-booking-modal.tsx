"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Info } from "lucide-react"

interface CancelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, note: string) => void
  bookingId: string
}

const cancellationReasons = [
  "Change of plans",
  "Found a better option",
  "Health or personal reasons",
  "Travel restrictions",
  "Weather conditions",
  "Incorrect booking details",
  "Other"
]

export function CancelBookingModal({ isOpen, onClose, onConfirm, bookingId }: CancelBookingModalProps) {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!reason) return
    setIsLoading(true)
    await onConfirm(reason, note)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl">
        <DialogHeader>
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">Cancel Booking?</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm pt-2">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-[11px] text-blue-800 leading-relaxed">
              <strong>Cancellation Policy:</strong> Free cancellation is available until 24 hours before the scheduled time. Points will be refunded within 3-5 business days.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reason for Cancellation</label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {cancellationReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Notes (Optional)</label>
            <Textarea 
              placeholder="Tell us more about why you're cancelling..." 
              className="min-h-[100px] rounded-xl border-slate-200 resize-none focus-visible:ring-[#0A74DA]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-slate-500 font-medium hover:bg-slate-50"
            disabled={isLoading}
          >
            Go Back
          </Button>
          <Button 
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
            disabled={!reason || isLoading}
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
