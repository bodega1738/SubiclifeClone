"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Plane, 
  Compass, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Hotel,
  Mountain,
  Utensils,
  Waves,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

type OnboardingData = {
  travelFrequency?: 'first-time' | 'occasional' | 'frequent' | 'local-resident'
  interests: string[]
  budgetRange?: 'budget' | 'moderate' | 'luxury' | 'ultra-luxury'
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updatePreferences } = useUser()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    interests: []
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.preferences && step === 1) {
      // If preferences already exist and we just landed, maybe they are retaking it
      // but for now let's just allow it or redirect if desired.
      // router.push("/home") 
    }
  }, [user, router])

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleSkipAll = () => {
    router.push("/home")
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    updatePreferences(data)
    router.push("/home")
  }

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const isNextDisabled = () => {
    if (step === 1 && !data.travelFrequency) return true
    if (step === 2 && data.interests.length === 0) return true
    if (step === 3 && !data.budgetRange) return true
    return false
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex-1 max-w-[200px]">
          <Progress value={progress} className="h-1 bg-slate-100" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Step {step} of {totalSteps}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSkipAll}
          className="text-slate-500 hover:text-slate-900"
        >
          Skip All
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">How often do you visit Subic Bay?</h1>
                <p className="text-slate-500">Help us tailor your experience based on your familiarity with the area.</p>
              </div>
              <div className="grid gap-3">
                {[
                  { id: 'first-time', label: 'First-time visitor', icon: Plane },
                  { id: 'occasional', label: 'Occasional (2-3x/year)', icon: Compass },
                  { id: 'frequent', label: 'Frequent traveler', icon: Sparkles },
                  { id: 'local-resident', label: 'Local resident', icon: Hotel }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, travelFrequency: option.id as any })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      data.travelFrequency === option.id
                        ? "border-[#135bec] bg-blue-50 text-[#135bec]"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      data.travelFrequency === option.id ? "bg-blue-100" : "bg-white"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">What interests you most?</h1>
                <p className="text-slate-500">Select all that apply. We'll show you the best deals for these categories.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'hotels', label: 'Hotels & Stays', icon: Hotel },
                  { id: 'activities', label: 'Adventure Activities', icon: Mountain },
                  { id: 'dining', label: 'Dining Experiences', icon: Utensils },
                  { id: 'water-sports', label: 'Water Sports', icon: Waves },
                  { id: 'wellness', label: 'Wellness & Spa', icon: Sparkles }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleInterest(option.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      data.interests.includes(option.id)
                        ? "border-[#135bec] bg-blue-50 text-[#135bec]"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      data.interests.includes(option.id) ? "bg-blue-100" : "bg-white"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">What's your typical travel budget?</h1>
                <p className="text-slate-500">We want to make sure our recommendations fit your style.</p>
              </div>
              <div className="grid gap-3">
                {[
                  { id: 'budget', label: 'Budget-friendly', sub: '₱2-5K/day', icon: Wallet },
                  { id: 'moderate', label: 'Moderate', sub: '₱5-10K/day', icon: Wallet },
                  { id: 'luxury', label: 'Luxury', sub: '₱10-20K/day', icon: Sparkles },
                  { id: 'ultra-luxury', label: 'Ultra-luxury', sub: '₱20K+/day', icon: Sparkles }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setData({ ...data, budgetRange: option.id as any })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      data.budgetRange === option.id
                        ? "border-[#135bec] bg-blue-50 text-[#135bec]"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      data.budgetRange === option.id ? "bg-blue-100" : "bg-white"
                    )}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm opacity-70">{option.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-white border-t flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={step === 1 ? handleSkipAll : handleBack}
          className="text-slate-500"
        >
          {step === 1 ? "Skip" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="bg-[#135bec] hover:bg-[#135bec]/90 text-white rounded-xl px-8 h-12 min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === totalSteps ? "Finish" : "Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
