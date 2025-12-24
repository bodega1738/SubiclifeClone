"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { type MerchantSession } from "@/lib/types"

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Demo login check
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === "demo@subic.life" && password === "demo123") {
      const session: MerchantSession = {
        email,
        partner_ids: ["all"],
        name: "Demo Account",
      }
      localStorage.setItem("merchant_session", JSON.stringify(session))
      router.push("/portal/dashboard")
    } else {
      setError("Invalid credentials. Try: demo@subic.life / demo123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px] shadow-lg border-0 rounded-2xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#135bec] rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SUBIC.LIFE</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Merchant Login</h1>
          <p className="text-slate-500 text-center mb-6">Access your merchant dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@subic.life"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </Label>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#135bec] hover:bg-[#0e45b5] text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-6">
            <p className="text-xs text-blue-700 font-mono text-center">Demo: demo@subic.life / demo123</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New partner?{' '}
              <button
                onClick={() => router.push('/portal/register')}
                className="text-blue-600 font-medium hover:underline"
              >
                Register your business
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
