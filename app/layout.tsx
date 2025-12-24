import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Manrope, Great_Vibes, Merriweather } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/lib/user-context"
import "@/styles/globals.css"
import { BottomNavWrapper } from "@/components/layout/bottom-nav-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const greatVibes = Great_Vibes({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes"
})
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
})

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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${greatVibes.variable} ${merriweather.variable} antialiased font-sans`} suppressHydrationWarning>
        <UserProvider>
          {children}
          <BottomNavWrapper />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
