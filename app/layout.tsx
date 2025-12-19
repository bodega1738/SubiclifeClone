import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/lib/user-context"
import "./globals.css"
import { BottomNavWrapper } from "@/components/layout/bottom-nav-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Subic.Life - Your Gateway to Subic Bay",
  description:
    "Exclusive travel membership for Subic Bay. Sustainable luxury experiences, partner discounts, and premium concierge services.",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A74DA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <UserProvider>
          {children}
          <BottomNavWrapper />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
