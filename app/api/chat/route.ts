const partners = {
  dining: [
    { name: "Lighthouse Marina Resort", desc: "luxury waterfront dining with sunset views", discount: 25 },
    {
      name: "Best Western Plus Hotel Subic",
      desc: "premium hotel restaurant with international cuisine",
      discount: 20,
    },
  ],
  yacht: [
    { name: "La Banca Cruises", desc: "private yacht charters and sunset cruises", discount: 25 },
    { name: "Subic Sailing", desc: "sailing lessons and yacht club experiences", discount: 20 },
  ],
  adventure: [
    { name: "Tree Top Adventure", desc: "ziplines and nature trails through the forest canopy", discount: 20 },
    { name: "Zoobic Safari", desc: "wildlife encounters and tiger feeding experiences", discount: 15 },
    { name: "Funtastic Park", desc: "water park and family entertainment", discount: 20 },
  ],
  water: [
    { name: "NetworX Jetsports", desc: "jet ski rentals and water sports", discount: 25 },
    { name: "Ocean Adventure", desc: "marine park with dolphin and sea lion shows", discount: 15 },
    { name: "ICC Zambales", desc: "beach activities and water adventures", discount: 20 },
  ],
  diving: [
    { name: "Subic Sailing", desc: "dive trips to WWII wrecks and coral reefs", discount: 25 },
    { name: "ICC Zambales", desc: "snorkeling and dive courses", discount: 20 },
  ],
  hotel: [
    { name: "Best Western Plus Hotel Subic", desc: "4-star hotel with pool and spa", discount: 25 },
    { name: "Lighthouse Marina Resort", desc: "boutique waterfront resort", discount: 20 },
  ],
}

function getSmartResponse(message: string): { content: string; bookingCard: any | null } {
  const msg = message.toLowerCase()

  // Dining keywords
  if (
    msg.includes("dinner") ||
    msg.includes("restaurant") ||
    msg.includes("food") ||
    msg.includes("eat") ||
    msg.includes("dining")
  ) {
    const partner = partners.dining[0]
    return {
      content: `For a memorable dining experience, I highly recommend ${partner.name} - ${partner.desc}. As an Elite member, you'll enjoy ${partner.discount}% off your bill.`,
      bookingCard: {
        venue: partner.name,
        time: "7:00 PM",
        guests: 2,
        discount: partner.discount,
        image: "/subic-bay-aerial-view-blue-ocean-tropical.jpg",
      },
    }
  }

  // Yacht/cruise keywords
  if (
    msg.includes("yacht") ||
    msg.includes("cruise") ||
    msg.includes("boat") ||
    msg.includes("sailing") ||
    msg.includes("sunset")
  ) {
    const partner = partners.yacht[0]
    return {
      content: `${partner.name} offers ${partner.desc}. Perfect for a romantic evening or special celebration! Your Elite membership gives you ${partner.discount}% off.`,
      bookingCard: {
        venue: partner.name,
        time: "4:30 PM",
        guests: 2,
        discount: partner.discount,
        image: "/luxury-yacht-cruise-sunset-subic-bay.jpg",
      },
    }
  }

  // Day trip / adventure keywords
  if (
    msg.includes("day trip") ||
    msg.includes("adventure") ||
    msg.includes("zipline") ||
    msg.includes("safari") ||
    msg.includes("zoo")
  ) {
    const partner = partners.adventure[Math.floor(Math.random() * 2)]
    return {
      content: `For an exciting day trip, check out ${partner.name} - ${partner.desc}. Great for families and adventure seekers! You'll save ${partner.discount}% with your membership.`,
      bookingCard: {
        venue: partner.name,
        time: "9:00 AM",
        guests: 2,
        discount: partner.discount,
        image: "/zipline-forest-canopy-adventure-green.jpg",
      },
    }
  }

  // Diving/snorkeling keywords
  if (
    msg.includes("diving") ||
    msg.includes("dive") ||
    msg.includes("snorkel") ||
    msg.includes("underwater") ||
    msg.includes("scuba")
  ) {
    const partner = partners.diving[0]
    return {
      content: `Subic Bay is famous for its WWII wreck diving! I recommend ${partner.name} for ${partner.desc}. Elite members get ${partner.discount}% off dive packages.`,
      bookingCard: {
        venue: partner.name,
        time: "8:00 AM",
        guests: 2,
        discount: partner.discount,
        image: "/subic-bay-aerial-view-blue-ocean-tropical.jpg",
      },
    }
  }

  // Water sports keywords
  if (msg.includes("jet ski") || msg.includes("water sport") || msg.includes("beach") || msg.includes("swim")) {
    const partner = partners.water[0]
    return {
      content: `For water sports thrills, head to ${partner.name} - ${partner.desc}. Your Elite discount is ${partner.discount}% off all rentals!`,
      bookingCard: {
        venue: partner.name,
        time: "10:00 AM",
        guests: 2,
        discount: partner.discount,
        image: "/jet-ski-ocean-watersports-blue-sky.jpg",
      },
    }
  }

  // Hotel keywords
  if (
    msg.includes("hotel") ||
    msg.includes("stay") ||
    msg.includes("accommodation") ||
    msg.includes("room") ||
    msg.includes("deal")
  ) {
    const partner = partners.hotel[0]
    return {
      content: `I recommend ${partner.name} - ${partner.desc}. Elite members enjoy ${partner.discount}% off room rates plus complimentary breakfast!`,
      bookingCard: {
        venue: partner.name,
        time: "Check-in 2:00 PM",
        guests: 2,
        discount: partner.discount,
        image: "/luxury-resort-suite-ocean-view-sunset.jpg",
      },
    }
  }

  // General/default response
  return {
    content: `I'd love to help you explore Subic Bay! We have amazing options for dining, yacht cruises, adventure parks, diving, and water sports. What type of experience are you looking for today?`,
    bookingCard: null,
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Add a small delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const response = getSmartResponse(message)

    return Response.json(response)
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { content: "I apologize, but I'm having trouble right now. Please try again.", bookingCard: null },
      { status: 500 },
    )
  }
}
