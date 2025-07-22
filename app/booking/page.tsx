"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RoomCard } from "@/components/room-card"
import { Calendar } from "@/components/ui/calendar"
import { ROOMS } from "@/data/rooms"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleRoomSelect = (roomId: string) => {
    if (selectedDate) {
      router.push(`/booking/${roomId}?date=${selectedDate.toISOString().split('T')[0]}`)
    } else {
      router.push(`/booking/${roomId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choose Your Space</h1>
            <p className="text-gray-600 text-sm">Select a date and room for your booking</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar - First on mobile, left on desktop */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <Calendar 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate}
                className="w-full"
              />
            </div>
          </div>

          {/* Room Cards - Second on mobile, right on desktop */}
          <div className="order-2 lg:order-1">
            <div className="space-y-4">
              {ROOMS.map((room) => (
                <RoomCard key={room.id} room={room} onSelect={handleRoomSelect} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
