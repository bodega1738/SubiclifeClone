"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const navItems = [
  { id: "home", icon: "home_app_logo", path: "/home" },
  { id: "discover", icon: "explore", path: "/partners" },
  { id: "pass", icon: "confirmation_number", path: "/pass" },
  { id: "profile", icon: "person", path: "/profile" },
]

export function NewBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-3rem)] md:max-w-md bg-[#1A1A1A] dark:bg-card-dark text-white backdrop-blur-xl rounded-[2rem] shadow-2xl z-50 h-[72px] flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.id}
            href={item.path}
            className={`flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
              isActive 
                ? "w-14 h-14 bg-white/10 text-white" 
                : "w-12 h-12 text-gray-400 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {item.icon}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
