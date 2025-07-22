"use client"

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MapPin, Trophy, Smartphone, Gift, Clock } from 'lucide-react'

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/placeholder-user.jpg",
  joinDate: "2024-01-15",
  totalBookings: 12,
  totalPOAPs: 8,
  completedTours: 2
}

// Mock bookings data
const mockBookings = [
  {
    id: "1",
    roomName: "Meeting Room A",
    date: "2024-01-20",
    timeSlot: "10:00",
    status: "completed"
  },
  {
    id: "2", 
    roomName: "Hot Desk Area",
    date: "2024-01-22",
    duration: "4h",
    status: "upcoming"
  },
  {
    id: "3",
    roomName: "Focus Room",
    date: "2024-01-25",
    timeSlot: "14:00",
    status: "upcoming"
  }
]

// Mock POAPs data
const mockPOAPs = [
  {
    id: "1",
    name: "Colosseum Visit",
    description: "Visited the iconic Colosseum",
    date: "2024-01-18",
    image: "/placeholder.jpg"
  },
  {
    id: "2",
    name: "Vatican Museums",
    description: "Explored the Vatican Museums",
    date: "2024-01-19",
    image: "/placeholder.jpg"
  },
  {
    id: "3",
    name: "Trevi Fountain",
    description: "Made a wish at Trevi Fountain",
    date: "2024-01-20",
    image: "/placeholder.jpg"
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short", 
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Header />
      
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
                <p className="text-gray-600 mb-4">{mockUser.email}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Member since {formatDate(mockUser.joinDate)}
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{mockUser.totalBookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{mockUser.totalPOAPs}</div>
                    <div className="text-sm text-gray-600">POAPs Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockUser.completedTours}</div>
                    <div className="text-sm text-gray-600">Tours Completed</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="shrink-0">
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="poaps">My POAPs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{booking.roomName}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.date)} • {booking.timeSlot || booking.duration}
                            </div>
                          </div>
                          <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Recent POAPs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPOAPs.slice(0, 3).map((poap) => (
                        <div key={poap.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Gift className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{poap.name}</div>
                            <div className="text-sm text-gray-600">{formatDate(poap.date)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{booking.roomName}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.date)} • {booking.timeSlot || booking.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'}>
                            {booking.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="poaps" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My POAP Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockPOAPs.map((poap) => (
                      <div key={poap.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                          <Gift className="h-12 w-12 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-1">{poap.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{poap.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{formatDate(poap.date)}</span>
                          <Badge variant="outline" className="text-xs">
                            Collected
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
} 