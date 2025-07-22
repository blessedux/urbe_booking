"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ROOMS } from "@/data/rooms"
import type { BookingFormData } from "@/types/booking"
import { bookingStore } from "@/lib/booking-store"

interface BookingDetailPageProps {
  params: Promise<{ roomId: string }>
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { roomId } = use(params)
  const router = useRouter()

  const room = ROOMS.find((r) => r.id === roomId)

  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    roomId: roomId,
  })

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
          <Link href="/booking">
            <Button>Back to Room Selection</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    setBookingData((prev) => ({ ...prev, date: dateString }))
  }

  const handleConfirmBooking = () => {
    if (!bookingData.date) return

    const booking = {
      id: bookingStore.generateBookingId(),
      roomId: room.id,
      roomName: room.name,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      duration: bookingData.duration,
      seatNumber: bookingData.seatNumber,
      createdAt: new Date().toISOString(),
    }

    bookingStore.addBooking(booking)
    router.push(`/confirmation/${booking.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-gray-600 text-sm">{room.description}</p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Calendar
              selectedDate={bookingData.date ? new Date(bookingData.date) : undefined}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Booking Summary */}
          {bookingData.date && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <p className="text-sm text-gray-600">Room: {room.name}</p>
              <p className="text-sm text-gray-600">Date: {bookingData.date}</p>
            </div>
          )}

          {/* Confirm Button */}
          {bookingData.date && (
            <Button
              onClick={handleConfirmBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
