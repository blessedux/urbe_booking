"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bookingStore } from "@/lib/booking-store"

interface TimeSlotPickerProps {
  availableHours: string[]
  selectedDate: string
  roomId: string
  selectedTime?: string
  onTimeSelect: (time: string) => void
}

export function TimeSlotPicker({
  availableHours,
  selectedDate,
  roomId,
  selectedTime,
  onTimeSelect,
}: TimeSlotPickerProps) {
  // Get existing bookings for this date and room
  const existingBookings = bookingStore.getBookingsForDate(selectedDate, roomId)
  const bookedTimes = existingBookings.map((booking) => booking.timeSlot?.split("–")[0])

  const isTimeAvailable = (time: string) => {
    return !bookedTimes.includes(time)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {availableHours.map((time) => {
            const available = isTimeAvailable(time)
            const timeSlot = `${time}–${String(Number.parseInt(time.split(":")[0]) + 1).padStart(2, "0")}:${time.split(":")[1]}`

            return (
              <Button
                key={time}
                variant={selectedTime === timeSlot ? "default" : "outline"}
                disabled={!available}
                onClick={() => onTimeSelect(timeSlot)}
                className="text-sm"
              >
                {timeSlot}
                {!available && <span className="ml-1 text-xs">(Booked)</span>}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
