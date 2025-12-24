"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { id: "all", label: "All" },
  { id: "hotels", label: "Hotels" },
  { id: "activities", label: "Activities" },
  { id: "dining", label: "Dining" },
  { id: "water-sports", label: "Water Sports" },
]

const partners = [
  {
    id: "lighthouse",
    name: "Lighthouse Marina Resort",
    category: "hotels",
    logo: "/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png",
    discount: 25,
  },
  {
    id: "zoobic",
    name: "Zoobic Safari",
    category: "activities",
    logo: "/images/3.jpeg",
    discount: 20,
  },
  {
    id: "labanca",
    name: "La Banca Cruises",
    category: "water-sports",
    logo: "/images/a97d3f-f3e8aad1f46446e58a87dda0cae5d7b9-mv2.png",
    discount: 15,
  },
  {
    id: "treetop",
    name: "Tree Top Adventure",
    category: "activities",
    logo: "/images/tree-20top.jpeg",
    discount: 20,
  },
  {
    id: "sailing",
    name: "Subic Sailing",
    category: "water-sports",
    logo: "/images/7c5eba-df2c5ae831f247eab0d0f46ba54f996a-mv2-d-2880-1616-s-2.jpg",
    discount: 15,
  },
  {
    id: "funtastic",
    name: "Funtastic Park",
    category: "activities",
    logo: "/images/4.jpeg",
    discount: 20,
  },
  {
    id: "bestwestern",
    name: "Best Western Plus Hotel",
    category: "hotels",
    logo: "/images/viber-image-2024-10-14-08-01-33-908.webp",
    discount: 20,
  },
  {
    id: "networx",
    name: "NetworX Jetsports",
    category: "water-sports",
    logo: "/images/king-of-watersports.jpg",
    discount: 15,
  },
  {
    id: "icc",
    name: "ICC Zambales",
    category: "activities",
    logo: "/images/icc-20zambales.png",
    discount: 15,
  },
  {
    id: "standard",
    name: "Standard Insurance",
    category: "services",
    logo: "/images/standard-insurance-logo.png",
    discount: 10,
  },
  {
    id: "assist",
    name: "Assist America",
    category: "services",
    logo: "/images/1631388385330.jpg",
    discount: 10,
  },
]

interface PartnersDirectoryProps {
  defaultCategory?: string
}

export function PartnersDirectory({ defaultCategory }: PartnersDirectoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || defaultCategory || "all"
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPartners = partners.filter((partner) => {
    const matchesCategory = activeCategory === "all" || partner.category === activeCategory
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Partners</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partners"
              className="pl-10 h-11 shadow-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#0A74DA] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Grid */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredPartners.map((partner) => (
            <Card
              key={partner.id}
              onClick={() => router.push(`/partners/${partner.id}`)}
              className="overflow-hidden shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer active:scale-95 duration-150"
            >
              <CardContent className="p-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 text-center line-clamp-2 mb-1">{partner.name}</h3>
                <p className="text-xs text-slate-500 text-center capitalize mb-2">
                  {partner.category.replace("-", " ")}
                </p>
                <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-100">
                  {partner.discount}% OFF
                </Badge>
                <button className="w-full mt-2 text-xs text-[#0A74DA] font-medium flex items-center justify-center gap-1">
                  View Details <ChevronRight className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No partners found</p>
          </div>
        )}
      </div>
    </div>
  )
}
