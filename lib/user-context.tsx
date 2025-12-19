"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import type { User, MembershipTier, MerchantSession } from "./types"
import { useMockDBStore, useHydratedMockDB } from "./mock-db"

interface UserContextType {
  user: User | null
  merchantSession: MerchantSession | null
  setUser: (user: User | null) => void
  login: (name: string, email: string, phone?: string, birthday?: string, address?: string) => void
  loginAsDemo: () => void
  upgradeTier: (tier: MembershipTier) => void
  addPoints: (amount: number) => void
  updateUser: (data: Partial<User>) => void
  updatePreferences: (preferences: User['preferences']) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function generateMemberId(tier: MembershipTier): string {
  const random = Math.floor(Math.random() * 9000) + 1000
  const tierCode = tier?.toUpperCase() || "STARTER"
  return `SL-2025-${tierCode}-${random}`
}

const insuranceAmounts: Record<string, number> = {
  starter: 25000,
  basic: 100000,
  premium: 500000,
  elite: 1000000,
}

export const discountPercentages: Record<string, number> = {
  starter: 5,
  basic: 10,
  premium: 20,
  elite: 25,
}

export const tierThresholds = {
  starter: 0,
  basic: 5000,
  premium: 15000,
  elite: 30000,
}

function getTierFromPoints(points: number): MembershipTier {
  if (points >= 30000) return "elite"
  if (points >= 15000) return "premium"
  if (points >= 5000) return "basic"
  return "starter"
}

export function UserProvider({ children }: { children: ReactNode }) {
  const isReady = useHydratedMockDB()
  
  // We'll use the first user in the mock DB as the current user for now
  // In a real app, this would be based on auth
  const user = useMockDBStore((state) => state.users[0] || null)
  const merchantSession = useMockDBStore((state) => state.merchant_session)
  const updateUser = useMockDBStore((state) => state.updateUser)
  const addUser = useMockDBStore((state) => state.addUser)

  const setUser = (user: User | null) => {
    // This is a bit tricky since our store has a list of users
    // For simplicity, we'll assume we're updating the first user or adding it
    if (user) {
      const existing = useMockDBStore.getState().users.find(u => u.id === user.id)
      if (existing) {
        updateUser(user.id, user)
      } else {
        addUser(user)
      }
    }
  }

  const login = (name: string, email: string, phone?: string, birthday?: string, address?: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      birthday,
      address,
      tier: "starter",
      member_id: generateMemberId("starter"),
      insuranceAmount: insuranceAmounts.starter,
      ecoContribution: 0,
      points: 1000,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    }
    addUser(newUser)
  }

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'alfred-id',
      name: "Alfred",
      email: "alfred@demo.com",
      tier: "elite",
      member_id: "SL-2025-ELITE-1234",
      points: 1000,
      insuranceAmount: 1000000,
      ecoContribution: 500,
      validUntil: new Date('2026-12-31'),
      createdAt: new Date('2024-01-01'),
    }
    const existing = useMockDBStore.getState().users.find(u => u.id === demoUser.id)
    if (!existing) {
      addUser(demoUser)
    }
  }

  const upgradeTier = (tier: MembershipTier) => {
    if (user && tier) {
      updateUser(user.id, {
        tier,
        member_id: generateMemberId(tier),
        insuranceAmount: insuranceAmounts[tier || "starter"],
        ecoContribution: tier === "elite" ? 12450 : tier === "premium" ? 5000 : tier === "basic" ? 2000 : 1000,
      })
    }
  }

  const addPoints = (amount: number) => {
    if (user) {
      const newPoints = (user.points || 0) + amount
      const newTier = getTierFromPoints(newPoints)
      updateUser(user.id, {
        points: newPoints,
        tier: newTier,
        insuranceAmount: insuranceAmounts[newTier || "starter"],
        member_id: newTier !== user.tier ? generateMemberId(newTier) : user.member_id,
      })
    }
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      updateUser(user.id, data)
    }
  }

  const updatePreferences = (preferences: User['preferences']) => {
    if (user) {
      updateUser(user.id, { preferences })
    }
  }

  const logout = () => {
    // For demo purposes, we'll just redirect to home
    window.location.href = '/'
  }

  // Prevent flash of unhydrated state
  if (!isReady) return null

  return (
    <UserContext.Provider
      value={{
        user,
        merchantSession,
        setUser,
        login,
        loginAsDemo,
        upgradeTier,
        addPoints,
        updateUser: updateProfile,
        updatePreferences,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
