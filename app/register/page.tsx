"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/lib/user-context"

function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOver18 = (dateString: string) => {
    if (!dateString) return false
    const birthDate = new Date(dateString)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  const isFormValid =
    firstName && lastName && email && phone && birthday && isOver18(birthday) && address

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`
    login(fullName, email, `+63 ${phone}`, birthday, address)
    
    setIsLoading(false)
    router.push("/onboarding")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradient Section */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-b from-white via-blue-50 to-teal-800">
        {/* Side Gradients */}
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-200/40 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-teal-200/40 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="pt-8 px-6 pb-8 text-center relative z-10">
        <button
          onClick={() => router.push("/")}
          className="absolute left-6 top-8 p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img src="/images/subic-life-script-logo.png" alt="Subic Life Logo" className="h-12 object-contain brightness-0" />
        </div>
        
        <h2 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-4 text-center mx-auto">Create an account</h2>
        <h1 className="text-5xl font-black text-slate-900 leading-[0.9] tracking-tighter">
          Subic<br />
          Life
        </h1>
        <p className="text-slate-600 text-sm mt-6 text-center font-medium mx-auto max-w-[280px]">
          Join Subic.Life for exclusive travel benefits
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-10 pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
          
          {/* First Name */}
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="block text-base font-bold text-slate-900">
              First name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your given name"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Middle Name */}
          <div className="space-y-1.5">
            <label htmlFor="middleName" className="block text-base font-bold text-slate-900">
              Middle name
            </label>
            <Input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional"
              className="h-14 text-base px-5 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
            />
            <p className="text-xs text-slate-400 px-1">Optional</p>
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="block text-base font-bold text-slate-900">
              Last name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-1.5">
            <label htmlFor="birthday" className="block text-base font-bold text-slate-900">
              Birth date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                required
              />
            </div>
            <p className="text-xs text-slate-400 px-1">Month, Day, Year</p>
          </div>

          {/* Email - Keeping essential fields */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="email" className="block text-base font-bold text-slate-900">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-base font-bold text-slate-900">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="917 123 4567"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-base font-bold text-slate-900">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Province"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 pb-4">
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full h-14 text-base font-bold bg-black hover:bg-slate-800 text-white rounded-full transition-all shadow-lg"
            >
              {isLoading ? "Creating..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
