"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RoomCard } from "@/components/room-card"
import { Calendar } from "@/components/ui/calendar"
import { ROOMS } from "@/data/rooms"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { MobileSwipeNavigation } from "@/components/mobile-swipe-navigation"

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  // Get room from URL parameter
  useEffect(() => {
    const roomParam = searchParams.get('room')
    if (roomParam && ROOMS.find(r => r.id === roomParam)) {
      setSelectedRoomId(roomParam)
    }
  }, [searchParams])

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
    if (selectedDate) {
      router.push(`/booking/${roomId}?date=${selectedDate.toISOString().split('T')[0]}`)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    if (selectedRoomId) {
      router.push(`/booking/${selectedRoomId}?date=${date.toISOString().split('T')[0]}`)
    }
  }

  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Choose Your Space</h1>
              <p className="text-red-100 text-sm">Select a date and room for your booking</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar - First on mobile, left on desktop */}
            <div className="order-1 lg:order-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border">
                <Calendar 
                  selectedDate={selectedDate} 
                  onDateSelect={handleDateSelect}
                  className="w-full"
                />
              </div>
            </div>

            {/* Room Cards - Second on mobile, right on desktop */}
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                {ROOMS.map((room) => (
                  <RoomCard 
                    key={room.id} 
                    room={room} 
                    onSelect={handleRoomSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading booking page...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
