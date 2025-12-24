"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Mail, Building2 } from "lucide-react"

export function HeroSection() {
  const { loginAsDemo } = useUser()
  const router = useRouter()

  const handleDemoLogin = () => {
    loginAsDemo()
    router.push("/home")
  }

  return (
    <div className="bg-background-light min-h-screen flex items-center justify-center font-sans text-text-primary-light">
      <div className="w-full max-w-md mx-auto h-full min-h-screen bg-background-light relative overflow-hidden flex flex-col">
        {/* Background Image Section */}
        <div className="absolute top-0 left-0 w-full h-[45%] z-0">
          <img
            alt="Beautiful beach landscape at sunset"
            className="w-full h-full object-cover opacity-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGymlp-8Q4zLvtXBZTL3Via5ZneNjym2e__35GM6eWMxwuxm8RKN84oXEK5qbl0IRhpEDqk3Fz3uOErROpzuueOtcXXeWDg28nHzwnBteGkinrX7qKpSXHoOG7ERhoCbTNLxShc2_gyeo6-NFzPC2nps9apwOG7sooaQoQRupSv2B9LYs-jIsjJbCpn_s2iL_YirsyGwwM-bABcGz7ZosXT3jagy3mM0AY9BRRstcgHb0IhCFTf2ECiHkw81EkJkMxv_sBn17aybra"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background-light"></div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 pt-16 pb-6 px-6 flex flex-col items-center">
          <div className="text-center mb-4 drop-shadow-lg">
            <h1 className="font-script text-6xl text-white mb-[-10px] tracking-wide">Subic</h1>
            <div className="text-[0.7rem] uppercase tracking-[0.4em] text-yellow-300 font-bold ml-2">
              . Life
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-4 text-center leading-tight drop-shadow-md">
            Your Gateway <br /> to Subic Bay
          </h2>
          <p className="text-white/90 text-sm mt-3 text-center font-medium drop-shadow-sm max-w-[280px]">
            Exclusive benefits. Sustainable travel. Experience paradise.
          </p>
        </div>

        {/* Action Sheet */}
        <div className="flex-1 relative z-20 bg-background-light rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] mt-4 px-6 pt-8 pb-12 flex flex-col animate-slide-up">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
          
          <div className="space-y-4 w-full max-w-sm mx-auto">
            <button
              onClick={() => router.push("/register?provider=google")}
              className="w-full relative flex items-center justify-center bg-white border border-border-light hover:bg-gray-50 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5 absolute left-4"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW4gNQxdKuaCxZbjjFvTHd9lV3QhcUyMvcSN5yQTSa0Iqs5veP4c1u7r1lM70jZxmUCl5SHAd8d41OWIrzsUieOgLRUwtohKeVKV_PdGkHnc6MhYYde60YAnZxghUMHuV-KHPCwNR-atgllD31iIcN7U9Ax_vrfiFTyLc01jwJlw5P5bsjFt5SXHMh8cJaNdpXxGKmoWkkipp5MgzJ2djptYQsNwjDGuHthFcBx6XdTm0mrl9ow96utSUP8a59E-tuITKvoSIwV-Z9"
              />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=facebook")}
              className="w-full relative flex items-center justify-center bg-white border border-border-light hover:bg-gray-50 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <svg className="w-5 h-5 absolute left-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=apple")}
              className="w-full relative flex items-center justify-center bg-white border border-border-light hover:bg-gray-50 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 group cursor-pointer"
            >
              <svg className="w-5 h-5 absolute left-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.09-.48-3.08.35-1.06.86-2.91.24-4.04-1.42-2.31-3.35-1.96-8.29 2.08-9.98 1.98-.82 3.32-.12 4.41-.12 1.05 0 2.68-.86 4.98-.06 1.2.42 2.18 1.15 2.86 2.03-2.58 1.57-2.12 5.86.39 6.94-.58 1.72-1.41 3.42-2.42 4.91zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            <button
              onClick={() => router.push("/register?provider=instagram")}
              className="w-full relative flex items-center justify-center bg-white border border-border-light hover:bg-gray-50 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 group cursor-pointer"
            >
               <svg className="w-5 h-5 absolute left-4 instagram-gradient" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <span>Continue with Instagram</span>
            </button>
          </div>

          <div className="relative py-6 flex items-center">
            <div className="flex-grow border-t border-border-light"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-text-secondary-light uppercase tracking-widest font-medium">or</span>
            <div className="flex-grow border-t border-border-light"></div>
          </div>

          <button
            onClick={() => router.push("/register")}
            className="w-full bg-surface-light border border-transparent hover:border-gray-300 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-4 cursor-pointer"
          >
            <Mail className="w-5 h-5" />
            Sign up with Email
          </button>

          <button
            onClick={handleDemoLogin}
            className="w-full bg-primary/10 text-primary font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 hover:bg-primary/20 mt-auto cursor-pointer"
          >
            Demo as Elite Member
          </button>

          <button
            onClick={() => router.push("/portal/register")}
            className="w-full bg-surface-light border border-transparent hover:border-gray-300 text-text-primary-light font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <Building2 className="w-5 h-5" />
            Register as Merchant
          </button>

          <p className="text-xs text-center text-text-secondary-light mt-6 px-4 leading-relaxed">
            By continuing, you agree to Subic Life's <a className="underline decoration-1 underline-offset-2 text-text-primary-light font-semibold" href="#">Terms of Service</a> and confirm that you have read our <a className="underline decoration-1 underline-offset-2 text-text-primary-light font-semibold" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
