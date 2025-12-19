"use client"

import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/layout/bottom-nav"

export function BottomNavWrapper() {
  const pathname = usePathname()
  
  // Define routes where the bottom nav should be hidden
  const isPortal = pathname?.startsWith("/portal")
  const isLanding = pathname === "/"
  const isRegister = pathname === "/register"
  const isStarterPayment = pathname === "/starter-payment"

  const shouldShowBottomNav = !isPortal && !isLanding && !isRegister && !isStarterPayment

  if (!shouldShowBottomNav) return null

  return <BottomNav />
}
