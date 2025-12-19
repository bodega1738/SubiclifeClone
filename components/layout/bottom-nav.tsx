"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Compass, CreditCard, User } from "lucide-react"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "discover", label: "Discover", icon: Compass, path: "/partners" },
  { id: "pass", label: "My Pass", icon: CreditCard, path: "/pass" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 h-20 pb-safe z-50">
      <div className="flex justify-between items-center h-full max-w-md mx-auto px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 group transition-all duration-150 ${
                isActive ? "text-[#135bec]" : "text-gray-600 hover:text-[#111318]"
              }`}
            >
              <div className="relative transition-transform duration-150 hover:scale-110">
                <item.icon 
                  className={`w-5 h-5 transition-transform duration-150 ${isActive ? '' : 'group-hover:scale-110'}`}
                  strokeWidth={1.5}
                  fill={isActive ? 'currentColor' : 'none'}
                />
              </div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
