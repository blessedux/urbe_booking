"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DURATION_OPTIONS } from "@/data/rooms"
import { bookingStore } from "@/lib/booking-store"

interface DeskPickerProps {
  capacity: number
  selectedDate: string
  roomId: string
  selectedDuration?: string
  selectedSeat?: number
  onDurationSelect: (duration: string) => void
  onSeatSelect: (seat: number) => void
}

export function DeskPicker({
  capacity,
  selectedDate,
  roomId,
  selectedDuration,
  selectedSeat,
  onDurationSelect,
  onSeatSelect,
}: DeskPickerProps) {
  // Get existing bookings for this date and room
  const existingBookings = bookingStore.getBookingsForDate(selectedDate, roomId)
  const bookedSeats = existingBookings.map((booking) => booking.seatNumber).filter(Boolean)

  const isSeatAvailable = (seatNumber: number) => {
    return !bookedSeats.includes(seatNumber)
  }

  const availableSeats = Array.from({ length: capacity }, (_, i) => i + 1).filter(isSeatAvailable)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDuration} onValueChange={onDurationSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedDuration && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Seat ({availableSeats.length} available)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: capacity }, (_, i) => {
                const seatNumber = i + 1
                const available = isSeatAvailable(seatNumber)

                return (
                  <Button
                    key={seatNumber}
                    variant={selectedSeat === seatNumber ? "default" : "outline"}
                    disabled={!available}
                    onClick={() => onSeatSelect(seatNumber)}
                    className="aspect-square text-sm"
                  >
                    {seatNumber}
                  </Button>
                )
              })}
            </div>
            {availableSeats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center mt-4">No seats available for this date</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
