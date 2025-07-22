import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BookingFormData } from "@/types/booking"
import { ROOMS } from "@/data/rooms"
import { Calendar, Clock, MapPin } from "lucide-react"

interface BookingSummaryProps {
  bookingData: BookingFormData
}

export function BookingSummary({ bookingData }: BookingSummaryProps) {
  const room = ROOMS.find((r) => r.id === bookingData.roomId)

  if (!room) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{room.name}</p>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{formatDate(bookingData.date)}</p>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">
            {bookingData.timeSlot ||
              (bookingData.duration === "4h" ? "4 Hours (9:00 - 13:00)" : "Full Day (9:00 - 17:00)")}
          </p>
        </div>

        {bookingData.seatNumber && (
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">Seat #{bookingData.seatNumber}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
