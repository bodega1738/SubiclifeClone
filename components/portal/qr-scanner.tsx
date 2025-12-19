"use client"

import { useEffect, useState, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { 
  Camera, 
  X, 
  Flashlight, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Ticket,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { verifyMember, getConfirmedBooking, checkInBooking } from "@/lib/supabase-actions"
import { mockSupabase as supabase } from "@/lib/mock-db"
import { User, Booking } from "@/lib/types"

interface QRScannerProps {
  partnerId: string
  onClose?: () => void
}

export default function QRScanner({ partnerId, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(true)
  const [result, setResult] = useState<"success" | "error" | "no_booking" | null>(null)
  const [member, setMember] = useState<User | null>(null)
  const [booking, setBooking] = useState<any | null>(null)
  const [flashOn, setFlashOn] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const { toast } = useToast()

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader")
      }

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 280 },
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      )
      setScanning(true)
    } catch (err) {
      console.error("Failed to start scanner:", err)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop()
      setScanning(false)
    }
  }

  const toggleFlash = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        const newState = !flashOn
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: newState } as any]
        })
        setFlashOn(newState)
      } catch (err) {
        console.error("Flash not supported", err)
      }
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessing) return
    setIsProcessing(true)
    
    // Parse QR: SL:MEMBER_ID:TIMESTAMP
    const parts = decodedText.split(":")
    if (parts[0] !== "SL" || !parts[1]) {
      setResult("error")
      setIsProcessing(false)
      stopScanner()
      return
    }

    const memberId = parts[1]

    try {
      await stopScanner()
      
      const memberData = await verifyMember(memberId)
      if (!memberData) {
        setResult("error")
        return
      }
      setMember(memberData)

      const confirmedBooking = await getConfirmedBooking(memberData.id, partnerId)
      if (confirmedBooking) {
        setBooking(confirmedBooking)
        setResult("success")
      } else {
        setResult("no_booking")
      }
    } catch (err) {
      console.error("Verification error:", err)
      setResult("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const onScanFailure = (error: any) => {
    // Silently handle scan failures (common when no QR in frame)
  }

  const handleCheckIn = async () => {
    if (!booking || !member) return
    
    try {
      await checkInBooking(booking.id, member.id)
      toast({
        title: "Success",
        description: "Member checked in successfully!",
      })
      setResult(null)
      if (onClose) onClose()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to complete check-in.",
        variant: "destructive",
      })
    }
  }

  const handleRetry = () => {
    setResult(null)
    setMember(null)
    setBooking(null)
    startScanner()
  }

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-medium">Scan Member QR</span>
        <button 
          onClick={toggleFlash}
          className={`p-2 rounded-full text-white backdrop-blur-md ${flashOn ? 'bg-yellow-400/20' : 'bg-white/10'}`}
        >
          <Flashlight className={`w-6 h-6 ${flashOn ? 'text-yellow-400' : ''}`} />
        </button>
      </div>

      {/* Video Container */}
      <div id="qr-reader" className="w-full h-full object-cover" />

      {/* Dark Overlay with Scan Frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Scan Area Hole (CSS Mask equivalent) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px]">
          <div className="absolute inset-0 border-4 border-white rounded-2xl shadow-[0_0_0_100vw_rgba(0,0,0,0.6)]" />
          
          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-12 h-12 border-l-4 border-t-4 border-blue-500 rounded-tl-2xl animate-pulse" />
          <div className="absolute -top-1 -right-1 w-12 h-12 border-r-4 border-t-4 border-blue-500 rounded-tr-2xl animate-pulse" />
          <div className="absolute -bottom-1 -left-1 w-12 h-12 border-l-4 border-b-4 border-blue-500 rounded-bl-2xl animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-r-4 border-b-4 border-blue-500 rounded-br-2xl animate-pulse" />
          
          {/* Scanning Line */}
          <div className="absolute top-0 left-4 right-4 h-1 bg-blue-500/50 blur-sm animate-[scan_2s_ease-in-out_infinite]" />
        </div>

        <div className="absolute bottom-24 left-0 right-0 text-center px-6">
          <p className="text-white/80 text-sm">Align the QR code within the frame to scan</p>
        </div>
      </div>

      {/* Success Sheet */}
      <Dialog open={result === "success"} onOpenChange={(open) => !open && handleRetry()}>
        <DialogContent className="sm:max-w-md animate-bottom-sheet">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold">Verified Member</DialogTitle>
            <DialogDescription>
              Booking confirmed for today
            </DialogDescription>
          </DialogHeader>
          
          {member && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={""} />
                  <AvatarFallback>{member.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {member.tier || 'Member'}
                    </Badge>
                    <Badge variant="outline" className="text-gray-500">
                      ID: {member.member_id}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Insurance Active</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">15% Discount</span>
                </div>
              </div>

              {booking && (
                <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Booking Details</p>
                  <p className="font-medium text-gray-900">{booking.booking_type || 'General Admission'}</p>
                  <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                  <p className="text-sm text-gray-500 mt-1">{booking.guests || 1} Guests</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col gap-2">
            <Button 
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl"
              onClick={handleCheckIn}
            >
              Confirm Check-in
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500"
              onClick={handleRetry}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Booking Sheet */}
      <Dialog open={result === "no_booking"} onOpenChange={(open) => !open && handleRetry()}>
        <DialogContent className="sm:max-w-md animate-bottom-sheet">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <Ticket className="w-10 h-10 text-yellow-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">No Booking Found</DialogTitle>
            <DialogDescription className="text-center">
              This member doesn't have a confirmed booking at your location for today.
            </DialogDescription>
          </DialogHeader>

          {member && (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 my-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={""} />
                <AvatarFallback>{member.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold">{member.name}</h3>
                <Badge variant="secondary">{member.tier || 'Member'}</Badge>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <p className="text-sm text-blue-800">
              You can still offer the member discount manually or help them create a booking.
            </p>
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl"
              onClick={handleRetry}
            >
              Scan Another Member
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500"
              onClick={() => {
                setResult(null)
                if (onClose) onClose()
              }}
            >
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Sheet */}
      <Dialog open={result === "error"} onOpenChange={(open) => !open && handleRetry()}>
        <DialogContent className="sm:max-w-md animate-bottom-sheet">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold">Invalid QR Code</DialogTitle>
            <DialogDescription>
              The scanned code is not a valid Subiclife member QR code or has expired.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button 
              className="w-full h-12 bg-gray-900 hover:bg-black font-bold rounded-xl"
              onClick={handleRetry}
            >
              Scan Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-bottom-sheet {
          animation: slide-in-bottom 0.35s ease-out;
        }
        @keyframes slide-in-bottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
