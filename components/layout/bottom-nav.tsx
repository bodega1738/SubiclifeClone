"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, CreditCard, Handshake } from "lucide-react"

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "concierge", label: "Concierge", icon: MessageSquare, path: "/concierge" },
  { id: "pass", label: "My Pass", icon: CreditCard, path: "/pass" },
  { id: "partners", label: "Partners", icon: Handshake, path: "/partners" },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-3 pb-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1.5 group transition-colors ${
                isActive ? "text-[#135bec]" : "text-gray-400 hover:text-[#111318]"
              }`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? "" : "group-hover:scale-110"} transition-transform`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#135bec] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
