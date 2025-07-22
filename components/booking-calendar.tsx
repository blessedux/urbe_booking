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
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'loading'>('date')
  const room = ROOMS[selectedRoomIndex]

  // Set default month to October 2024
  const defaultMonth = new Date(2024, 9, 1) // October is month 9 (0-indexed)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setCurrentStep('time')
  }

  const handleTimeSelect = (timeSlot: string) => {
    // Show loading state first
    setCurrentStep('loading')
    
    // Then create and complete the booking after 1 second
    setTimeout(() => {
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
    }, 1000)
  }

  // Generate random booked/available hours for October
  const generateTimeSlots = () => {
    const allHours = [
      "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
      "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ]
    
    // Randomly book some hours (30-50% of slots)
    const bookedCount = Math.floor(Math.random() * 3) + 2 // 2-4 booked slots
    const bookedIndices = new Set()
    
    while (bookedIndices.size < bookedCount) {
      bookedIndices.add(Math.floor(Math.random() * allHours.length))
    }
    
    return allHours.map((hour, index) => ({
      time: hour,
      available: !bookedIndices.has(index)
    }))
  }

  const timeSlots = generateTimeSlots()

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
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <p className="text-gray-600 text-sm">Choose when you'd like to book this space</p>
          </div>
          <div className="p-4" style={{ minHeight: '256px' }}>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              defaultMonth={defaultMonth}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Time Selection Step */}
      {currentStep === 'time' && selectedDate && (
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
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
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
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
              {room.availableHours ? (
                // For rooms with predefined hours, use random availability
                timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={slot.available ? "outline" : "secondary"}
                    disabled={!slot.available}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    className={`w-full h-12 text-base justify-start ${
                      slot.available 
                        ? "hover:bg-blue-50 hover:border-blue-300" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-3" />
                    {slot.time}
                    {!slot.available && (
                      <span className="ml-auto text-xs text-gray-500">Booked</span>
                    )}
                  </Button>
                ))
              ) : (
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

      {/* Loading Step */}
      {currentStep === 'loading' && (
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Processing Booking</h3>
            <p className="text-gray-600 text-sm">
              {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="p-4 flex flex-col items-center justify-center" style={{ minHeight: '256px' }}>
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing your booking...</h3>
            <p className="text-gray-600 text-sm text-center">
              Please wait while we confirm your reservation
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 