"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MoreVertical, Send, Bot, Check, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, discountPercentages } from "@/lib/user-context"
import { useToast } from "@/hooks/use-toast"
import { mockSupabase } from "@/lib/mock-db"
import type { ChatMessage } from "@/lib/types"

const quickPrompts = ["Find dinner spot", "Book yacht", "Plan day trip", "Best diving", "Hotel deals"]

export function ConciergeChat() {
  const { user, addPoints } = useUser()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to Subic.Life, ${user?.name?.split(" ")[0] || "Guest"}! I'm your personal concierge. As a ${user?.tier || "starter"} member, you enjoy ${discountPercentages[user?.tier || "starter"]}% off at all partners. How can I help you explore Subic Bay today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmedBookings, setConfirmedBookings] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        bookingCard: data.bookingCard,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmBooking = async (messageId: string, bookingCard: any) => {
    // Generate booking reference
    const bookingRef = `SL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Create booking in mockDB
    const newBooking = {
      id: crypto.randomUUID(),
      user_id: user?.id,
      partner_id: bookingCard.partnerId,
      booking_type: 'restaurant', // Infer from category or default
      booking_details: {
        date: new Date().toISOString().split('T')[0],
        time: bookingCard.time || '7:00 PM',
        party_size: bookingCard.guests || 2,
        special_requests: 'Booked via Concierge'
      },
      status: 'pending',
      payment_status: 'pending',
      total_amount: bookingCard.price,
      discount_amount: Math.round(bookingCard.price * (bookingCard.discount / 100)),
      final_amount: Math.round(bookingCard.price * (1 - bookingCard.discount / 100)),
      created_at: new Date().toISOString()
    }
    
    // Insert via mockSupabase
    await mockSupabase.from('bookings').insert(newBooking)
    
    // Create merchant notification
    await mockSupabase.from('notifications').insert({
      partner_id: bookingCard.partnerId,
      type: 'new_booking',
      title: 'New Booking Request',
      message: `${user?.name} (${user?.tier}) - Concierge booking`,
      read: false
    })
    
    // Award points
    addPoints(500)
    
    // Update UI
    setConfirmedBookings(prev => new Set(prev).add(messageId))
    
    // Show toast with reference
    toast({
      title: "✅ Booking Request Sent!",
      description: `Reference: ${bookingRef} • +500 Points Earned`
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#f6f6f8]">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#111318]">Concierge</h1>
            <span className="flex items-center gap-1 text-xs text-[#10b981]">
              <span className="w-2 h-2 bg-[#10b981] rounded-full" />
              Online
            </span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-[#616f89]" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto px-5 pb-3">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const input = form.elements.namedItem('search') as HTMLInputElement
              if (input.value.trim()) {
                handleSend(input.value)
                input.value = ''
              }
            }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              name="search"
              placeholder="What can I help you find?" 
              className="pl-11 h-12 rounded-xl bg-white shadow-sm border-gray-200"
            />
          </form>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-5 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded-full text-sm text-[#111318] font-medium hover:bg-gray-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-[#135bec] text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[#135bec] text-white"
                      : "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] text-[#111318]"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Booking Card */}
                {message.bookingCard && (
                  <Card className="mt-3 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] border-0 overflow-hidden rounded-2xl">
                    <div className="aspect-[4/3] w-full relative">
                      <img
                        src={message.bookingCard.image || "/placeholder.svg"}
                        alt={message.bookingCard.venue}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3 flex flex-col gap-2">
                      <div>
                        <h4 className="font-semibold text-[#111318]">{message.bookingCard.venue}</h4>
                        <p className="text-sm text-gray-600">
                          {message.bookingCard.category} • ⭐ {message.bookingCard.rating}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-500">From</span>
                           <span className="text-base font-semibold">₱{message.bookingCard.price?.toLocaleString()}</span>
                        </div>
                        <span className="bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded-md text-xs font-medium">
                          {message.bookingCard.discount}% OFF
                        </span>
                      </div>

                      {confirmedBookings.has(message.id) ? (
                        <div className="mt-2 flex items-center justify-center gap-2 py-2 bg-green-100 rounded-lg">
                          <Check className="w-4 h-4 text-[#10b981]" />
                          <span className="text-sm font-medium text-green-700">Booking Request Sent</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleConfirmBooking(message.id, message.bookingCard)}
                          className="w-full mt-2 bg-[#10b981] hover:bg-[#059669] rounded-xl h-11"
                        >
                          Book Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                <p className="text-xs text-[#616f89] mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-[#135bec] text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#616f89]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto px-5 py-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your concierge..."
            className="flex-1 h-12 rounded-xl border-gray-200"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-xl bg-[#135bec] hover:bg-[#0e45b5]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
