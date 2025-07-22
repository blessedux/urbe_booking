"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface BookingConfirmationProps {
  params: {
    bookingId: string
  }
}

export default function BookingConfirmationPage({ params }: BookingConfirmationProps) {
  const router = useRouter()
  const { bookingId } = params

  // Mock booking data - in a real app this would come from your database
  const bookingData = {
    roomName: "Meeting Room",
    date: "December 15, 2024",
    time: "10:00 AM - 12:00 PM",
    capacity: "Up to 8 seats",
    bookingId: bookingId
  }

  const handleDownloadIcal = () => {
    // Create iCal content
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Urbe Village//Booking System//EN
BEGIN:VEVENT
UID:${bookingId}@urbevillage.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20241215T100000Z
DTEND:20241215T120000Z
SUMMARY:Meeting Room Booking - Urbe Village
DESCRIPTION:Your meeting room booking at Urbe Village for ETH Rome
LOCATION:Urbe Village, Rome
END:VEVENT
END:VCALENDAR`

    // Create and download file
    const blob = new Blob([icalContent], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `urbe-village-booking-${bookingId}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleGoHome = () => {
    router.push('/menu')
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
      style={{ backgroundImage: 'url(/images/background1.png)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-lg shadow-lg border p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/hnvtE6Z3_400x400.jpg"
                    alt="Booking confirmed"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your space has been successfully reserved</p>
              </div>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium text-gray-900">{bookingData.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium text-gray-900">{bookingData.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium text-gray-900">{bookingData.bookingId}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleDownloadIcal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download iCal File
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
