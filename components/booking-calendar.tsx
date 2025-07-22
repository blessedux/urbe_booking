"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Download, Home } from "lucide-react"
import { ROOMS } from "@/data/rooms"
import { bookingStore } from "@/lib/booking-store"
import { useRouter } from "next/navigation"

interface BookingCalendarProps {
  selectedRoomIndex: number
  onBack: () => void
  onBookingComplete: (bookingId: string) => void
}

export function BookingCalendar({ selectedRoomIndex, onBack, onBookingComplete }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [currentStep, setCurrentStep] = useState<'date' | 'time'>('date')
  const room = ROOMS[selectedRoomIndex]

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setCurrentStep('time')
  }

  const handleTimeSelect = (timeSlot: string) => {
    // Immediately create and complete the booking
    if (selectedDate && room) {
      const newBookingId = bookingStore.generateBookingId()
      const booking = {
        id: newBookingId,
        roomId: room.id,
        roomName: room.name,
        date: selectedDate.toISOString().split("T")[0],
        timeSlot: timeSlot,
        createdAt: new Date().toISOString(),
      }

      bookingStore.addBooking(booking)
      onBookingComplete(newBookingId)
    }
  }

  if (!room) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Room not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Date Selection Step */}
      {currentStep === 'date' && (
        <div className="bg-white rounded-lg shadow-lg border">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            className="w-full"
          />
        </div>
      )}

      {/* Time Selection Step */}
      {currentStep === 'time' && selectedDate && (
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentStep('date')}
              className="text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Date
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">Select a Time</h3>
            <p className="text-gray-600 text-sm">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {room.availableHours?.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  onClick={() => handleTimeSelect(time)}
                  className="w-full h-12 text-base justify-start"
                >
                  <Clock className="h-4 w-4 mr-3" />
                  {time}
                </Button>
              )) || (
                // For desk bookings, show duration options
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleTimeSelect("4h")}
                    className="w-full h-12 text-base justify-start"
                  >
                    <Clock className="h-4 w-4 mr-3" />
                    4 Hours (9:00 - 13:00)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTimeSelect("8h")}
                    className="w-full h-12 text-base justify-start"
                  >
                    <Clock className="h-4 w-4 mr-3" />
                    Full Day (9:00 - 17:00)
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 