import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Coffee, Wifi, MapPin, Heart } from "lucide-react"
import { CardsParallax, type iCardItem } from "./scroll-cards"

export function ActivitiesSection() {
  const activities = [
    {
      icon: Users,
      title: "Urbe Campus",
      description: "Modern learning and workspace environment with state-of-the-art facilities for focused work and collaboration"
    },
    {
      icon: Calendar,
      title: "Meetups & Networking",
      description: "Connect with the community in iconic Roman locations, including evening events at the Colosseum"
    },
    {
      icon: Coffee,
      title: "Coworking Space",
      description: "Clean, minimalist workspace with ergonomic furniture and the signature Urbe HUB environment"
    },
    {
      icon: Wifi,
      title: "ETHRome Hackathon",
      description: "Join the premier blockchain hackathon with cutting-edge technology and collaborative innovation"
    },
    {
      icon: MapPin,
      title: "Discover Rome",
      description: "Explore the historic city with guided tours and discover the rich culture and architecture of Rome"
    },
    {
      icon: Heart,
      title: "Wellness Activities",
      description: "Maintain balance with yoga sessions, wellness programs, and mindfulness activities in serene spaces"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            More Than Just Co-working
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a vibrant community with events and amenities designed to enhance your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <Card key={index} className="text-center p-6 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-col items-center justify-center p-0 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <activity.icon className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold">{activity.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 