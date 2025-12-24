"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ChevronDown, Check, Waves, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useUser } from "@/lib/user-context"

function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [address, setAddress] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const { login } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const provider = searchParams.get("provider")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

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
    name && email && validateEmail(email) && phone && birthday && isOver18(birthday) && address && agreedToTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    login(name, email, `+63 ${phone}`, birthday, address)
    setIsLoading(false)
    router.push("/onboarding")
  }

  const getProviderLabel = () => {
    switch (provider) {
      case "google":
        return "Google"
      case "facebook":
        return "Facebook"
      case "instagram":
        return "Instagram"
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        {/* Header Text */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Create your account</h1>
          <p className="text-base text-slate-500 leading-relaxed">
            {getProviderLabel()
              ? `Complete your profile to continue with ${getProviderLabel()}`
              : "Join Subic.Life for exclusive travel benefits"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="h-14 text-base pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                required
              />
              {name && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError("")
                }}
                placeholder="juan@email.com"
                className={`h-14 text-base pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all ${emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                required
              />
              {email && validateEmail(email) && !emailError && (
                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 h-14 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 shrink-0">
                <span className="text-lg">🇵🇭</span>
                <span className="font-medium">+63</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="917 123 4567"
                  className="h-14 text-base pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                  required
                />
                {phone && phone.length >= 10 && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label htmlFor="birthday" className="block text-sm font-medium text-slate-700">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="h-14 text-base pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                required
              />
              {birthday && isOver18(birthday) && (
                <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-xs text-slate-500">You must be at least 18 years old</p>
            {birthday && !isOver18(birthday) && (
              <p className="text-sm text-red-500">You must be 18 years or older to register</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Street, City, Province"
                className="h-14 text-base pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all"
                required
              />
              {address && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 data-[state=checked]:bg-[#135bec] data-[state=checked]:border-[#135bec]"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
              I agree to the{" "}
              <span className="text-[#135bec] font-medium hover:underline cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-[#135bec] font-medium hover:underline cursor-pointer">Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full h-14 text-base font-semibold bg-[#135bec] hover:bg-[#0e45b5] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-500 pt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-[#135bec] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>

          <div className="pt-8 border-t border-slate-100 mt-8">
            <p className="text-center text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
              Are you a business partner?
            </p>
            <Button
              type="button"
              onClick={() => router.push("/portal/register")}
              variant="outline"
              className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#135bec] hover:border-[#135bec] rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Building2 className="w-5 h-5 text-slate-400 group-hover:text-[#135bec] transition-colors" />
              Register as a Merchant
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#135bec] border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
