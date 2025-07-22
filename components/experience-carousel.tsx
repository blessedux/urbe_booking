"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Coffee, Utensils, GraduationCap, MapPin } from "lucide-react"
import { CardsParallax, type iCardItem } from "./scroll-cards"

interface EventOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  image?: string
}

const EVENT_OPTIONS: EventOption[] = [
  {
    id: "urbe-campus",
    title: "Urbe Campus",
    description: "Educational programs and learning experiences",
    icon: <GraduationCap className="h-8 w-8" />,
    color: "from-blue-500 to-blue-600",
    image: "https://via.placeholder.com/400x600/3b82f6/ffffff?text=Urbe+Campus"
  },
  {
    id: "workshops",
    title: "Workshops",
    description: "Hands-on learning and skill development sessions",
    icon: <Users className="h-8 w-8" />,
    color: "from-green-500 to-green-600",
    image: "https://via.placeholder.com/400x600/10b981/ffffff?text=Workshops"
  },
  {
    id: "demo-sessions",
    title: "Demo Sessions",
    description: "Product demonstrations and technology showcases",
    icon: <Calendar className="h-8 w-8" />,
    color: "from-purple-500 to-purple-600",
    image: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Demo+Sessions"
  },
  {
    id: "aperitivos",
    title: "Aperitivos",
    description: "Evening drinks and networking events",
    icon: <Coffee className="h-8 w-8" />,
    color: "from-orange-500 to-orange-600",
    image: "https://via.placeholder.com/400x600/f97316/ffffff?text=Aperitivos"
  },
  {
    id: "dinners",
    title: "Dinners",
    description: "Gourmet dining experiences and social gatherings",
    icon: <Utensils className="h-8 w-8" />,
    color: "from-red-500 to-red-600",
    image: "https://via.placeholder.com/400x600/ef4444/ffffff?text=Dinners"
  }
]

const SCROLL_CARDS_DATA: iCardItem[] = [
  {
    title: "Urbe Campus",
    description: "Educational programs and learning experiences designed for the modern professional",
    tag: "Education",
    src: "https://via.placeholder.com/800x600/3b82f6/ffffff?text=Urbe+Campus",
    link: "#",
    color: "rgba(59, 130, 246, 0.9)",
    textColor: "#ffffff"
  },
  {
    title: "Workshops",
    description: "Hands-on learning and skill development sessions with industry experts",
    tag: "Learning",
    src: "https://via.placeholder.com/800x600/10b981/ffffff?text=Workshops",
    link: "#",
    color: "rgba(16, 185, 129, 0.9)",
    textColor: "#ffffff"
  },
  {
    title: "Demo Sessions",
    description: "Product demonstrations and technology showcases from innovative startups",
    tag: "Technology",
    src: "https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Demo+Sessions",
    link: "#",
    color: "rgba(139, 92, 246, 0.9)",
    textColor: "#ffffff"
  },
  {
    title: "Aperitivos",
    description: "Evening drinks and networking events in a relaxed, social atmosphere",
    tag: "Networking",
    src: "https://via.placeholder.com/800x600/f97316/ffffff?text=Aperitivos",
    link: "#",
    color: "rgba(249, 115, 22, 0.9)",
    textColor: "#ffffff"
  },
  {
    title: "Dinners",
    description: "Gourmet dining experiences and social gatherings with the Urbe community",
    tag: "Dining",
    src: "https://via.placeholder.com/800x600/ef4444/ffffff?text=Dinners",
    link: "#",
    color: "rgba(239, 68, 68, 0.9)",
    textColor: "#ffffff"
  }
]

export function ExperienceCarousel() {
  return (
    <section className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/background2.png)' }}>
      <div className="text-center pt-16 pb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Experience Urbe Village
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-4">
          Discover our events and activities designed for the Urbe community
        </p>
      </div>
      
      <CardsParallax items={SCROLL_CARDS_DATA} />
    </section>
  )
} 