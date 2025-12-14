"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"

export function HeroSection() {
  const { loginAsDemo } = useUser()
  const router = useRouter()

  const handleDemoLogin = () => {
    loginAsDemo()
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/final-20image-203.png')`,
        }}
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-md w-full">
          <div className="mb-8">
            <img
              src="/images/screenshot-2025-12-14-021635-removebg-preview.png"
              alt="Subic.LIFE"
              className="h-20 md:h-24 w-auto"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance">Your Gateway to Subic Bay</h1>
          <p className="text-lg text-white/90 mb-12 font-light">Exclusive benefits. Sustainable travel.</p>

          <div className="flex flex-col gap-3 w-full mb-4">
            <Button
              onClick={() => router.push("/register?provider=google")}
              variant="outline"
              className="w-full h-14 text-base font-medium bg-white hover:bg-white/90 text-slate-700 border-0 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={() => router.push("/register?provider=facebook")}
              className="w-full h-14 text-base font-medium bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>

            <Button
              onClick={() => router.push("/register?provider=instagram")}
              className="w-full h-14 text-base font-medium text-white border-0 shadow-lg"
              style={{
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Continue with Instagram
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full mb-4">
            <div className="flex-1 h-px bg-white/30" />
            <span className="text-sm text-white/70">or</span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* CTA Buttons - navigate to register page */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="w-full h-14 text-base font-semibold bg-transparent hover:bg-white/10 text-white border-white/50"
            >
              Sign up with Email
            </Button>
            <Button
              onClick={handleDemoLogin}
              className="w-full h-14 text-base font-semibold bg-[#135bec] hover:bg-[#0e45b5] text-white shadow-lg"
            >
              Demo as Elite Member
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full bg-[#10b981] py-3">
        <p className="text-center text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full" />
          SBMA GREEN DESTINATIONS 2025
        </p>
      </div>
    </div>
  )
}
