"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, MapPin, Hash } from "lucide-react"
import { bookingStore } from "@/lib/booking-store"

interface ConfirmationPageProps {
  params: Promise<{ bookingId: string }>
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { bookingId } = use(params)
  const booking = bookingStore.getBookingById(bookingId)

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <Link href="/booking">
            <Button>Make a New Booking</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeDisplay = () => {
    if (booking.timeSlot) {
      return booking.timeSlot
    }
    if (booking.duration === "4h") {
      return "4 Hours (9:00 - 13:00)"
    }
    return "Full Day (9:00 - 17:00)"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{"You're Booked!"}</h1>
              <p className="text-gray-600">Your reservation has been confirmed</p>
            </div>
          </div>

          {/* Booking Details Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{booking.roomName}</p>
                  {booking.seatNumber && <p className="text-sm text-gray-600">Seat #{booking.seatNumber}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                <p className="font-medium">{formatDate(booking.date)}</p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
                <p className="font-medium">{getTimeDisplay()}</p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Hash className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-mono font-bold text-blue-600">{booking.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Placeholder */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <div className="text-gray-500 text-sm">QR Code</div>
                </div>
                <p className="text-sm text-gray-600">Show this at check-in</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/booking" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                Book Another Room
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full py-6 text-lg bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact Urbe Village staff</p>
          </div>
        </div>
      </div>
    </div>
  )
}
