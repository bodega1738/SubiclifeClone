import type { Partner, Offer } from "./types"
import { mockSupabase as supabase } from "./mock-db"

export async function getPartnerById(id: string): Promise<Partner | null> {
  try {
    const { data, error } = await supabase.from("partners").select("*").eq("id", id).single()

    if (error || !data) {
      return partners.find((p) => p.id === id) || null
    }

    return data as Partner
  } catch (err) {
    console.error("Error fetching partner from Supabase:", err)
    return partners.find((p) => p.id === id) || null
  }
}

export const partners: Partner[] = [
  {
    id: "lighthouse",
    name: "Lighthouse Marina Resort",
    logo: "/images/7c5eba-df2c5ae831f247eab0d0f46ba54f996a-mv2-d-2880-1616-s-2.jpg",
    category: "hotels",
    description:
      "Premier waterfront resort with stunning views of Subic Bay. Home of the Saturday Afternoon Gentlemen Sailors.",
    discount: 15,
    eliteDiscount: 25,
    offers: ["Aqua Veranda Suite - 25% Off Elite", "Free Room Night for Elite Members", "Sunset Dining Experience"],
    featured: true,
  },
  {
    id: "labanca",
    name: "La Banca Cruises",
    logo: "/images/a97d3f-f3e8aad1f46446e58a87dda0cae5d7b9-mv2.png",
    category: "water-sports",
    description: "Luxury yacht cruises around Subic Bay. Perfect for sunset tours and special occasions.",
    discount: 15,
    eliteDiscount: 25,
    offers: ["FREE 3-Hour Cruise (Elite)", "Sunset Champagne Tour", "Private Island Hopping"],
    featured: true,
  },
  {
    id: "zoobic",
    name: "Zoobic Safari",
    logo: "/images/3.jpeg",
    category: "activities",
    description: "Experience wildlife up close with thrilling safari adventures and animal encounters.",
    discount: 15,
    eliteDiscount: 25,
    offers: ["Priority Access - Skip the Line", "Night Safari Experience", "Tiger Feeding Adventure"],
    featured: true,
  },
  {
    id: "treetop",
    name: "Tree Top Adventure",
    logo: "/images/tree-20top.jpeg",
    category: "activities",
    description: "Nature camp with ziplines, rope courses, and eco-adventures in the Subic forest.",
    discount: 10,
    eliteDiscount: 20,
    offers: ["Canopy Tour Package", "Superman Zipline", "Team Building Activities"],
  },
  {
    id: "funtastic",
    name: "Funtastic Park",
    logo: "/images/4.jpeg",
    category: "activities",
    description: "Family-friendly amusement park with rides, attractions, and entertainment for all ages.",
    discount: 10,
    eliteDiscount: 20,
    offers: ["All-Day Pass Discount", "Family Bundle", "VIP Fast Pass"],
  },
  {
    id: "networx",
    name: "Networx Jetsports",
    logo: "/images/king-of-watersports.jpg",
    category: "water-sports",
    description: "King of watersports in Subic Bay. Jet skis, banana boats, and aquatic adventures.",
    discount: 15,
    eliteDiscount: 25,
    offers: ["Jet Ski Rental Package", "Banana Boat Group Rate", "Parasailing Adventure"],
  },
  {
    id: "icc",
    name: "ICC Zambales",
    logo: "/images/icc-20zambales.png",
    category: "services",
    description: "Local community organization supporting sustainable tourism in Zambales.",
    discount: 10,
    eliteDiscount: 15,
    offers: ["Community Tours", "Local Guide Services", "Cultural Experiences"],
  },
  {
    id: "standard-insurance",
    name: "Standard Insurance",
    logo: "/images/standard-insurance-logo.png",
    category: "services",
    description: "Comprehensive travel insurance coverage for all Subic.Life members.",
    discount: 0,
    eliteDiscount: 0,
    offers: ["Personal Accident Coverage", "Medical Evacuation", "Trip Cancellation Protection"],
  },
  {
    id: "assist-america",
    name: "Assist America",
    logo: "/images/1631388385330.jpg",
    category: "services",
    description: "Global emergency assistance services for travelers.",
    discount: 0,
    eliteDiscount: 0,
    offers: ["24/7 Emergency Hotline", "Medical Referrals", "Emergency Evacuation"],
  },
]

export const featuredOffers: Offer[] = [
  {
    id: "offer-1",
    partnerId: "lighthouse",
    partnerName: "Lighthouse Marina Resort",
    title: "Aqua Veranda Suite",
    description: "25% Off for Elite Members",
    image: "/luxury-resort-suite-ocean-view-sunset.jpg",
    discount: 25,
  },
  {
    id: "offer-2",
    partnerId: "labanca",
    partnerName: "La Banca Cruises",
    title: "3-Hour Yacht Cruise",
    description: "FREE for Elite Members",
    image: "/luxury-yacht-cruise-sunset-subic-bay.jpg",
    discount: 100,
    isEliteExclusive: true,
  },
  {
    id: "offer-3",
    partnerId: "zoobic",
    partnerName: "Zoobic Safari",
    title: "Night Safari Experience",
    description: "Priority Access + 25% Off",
    image: "/tiger-safari-night-dark-dramatic.jpg",
    discount: 25,
  },
  {
    id: "offer-4",
    partnerId: "treetop",
    partnerName: "Tree Top Adventure",
    title: "Canopy Tour Package",
    description: "20% Off Adventure Bundle",
    image: "/zipline-forest-canopy-adventure-green.jpg",
    discount: 20,
  },
  {
    id: "offer-5",
    partnerId: "networx",
    partnerName: "Networx Jetsports",
    title: "Jet Ski Adventure",
    description: "25% Off Water Sports",
    image: "/jet-ski-ocean-watersports-blue-sky.jpg",
    discount: 25,
  },
]
