"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Menu, User, ExternalLink, Calendar, Clock, MapPin, Download } from "lucide-react"
import Link from "next/link"
import { bookingStore } from "@/lib/booking-store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const menuItems = [
    { name: "Urbe Village", href: "https://urbevillage.com", external: true },
    { name: "ETH Rome", href: "https://ethrome.com", external: true },
    { name: "Hackathon", href: "https://ethrome.com/hackathon", external: true },
  ]

  // Mock user data
  const mockUser = {
    name: "Alex Chen",
    avatar: "/images/placeholder-user.jpg",
    email: "alex.chen@example.com"
  }

  // Get all bookings
  const allBookings = bookingStore.getBookings()

  const generateCalendarEvent = (booking: any, type: 'gcal' | 'ical') => {
    const startDate = new Date(booking.date)
    const endDate = new Date(booking.date)
    
    // Set time based on booking type
    if (booking.timeSlot) {
      // For hourly bookings, parse the time
      const [hours, minutes] = booking.timeSlot.split(':').map(Number)
      startDate.setHours(hours, minutes, 0, 0)
      endDate.setHours(hours + 1, minutes, 0, 0) // 1 hour duration
    } else {
      // For desk bookings, set default times
      startDate.setHours(9, 0, 0, 0) // 9:00 AM
      if (booking.duration === "4h") {
        endDate.setHours(13, 0, 0, 0) // 1:00 PM
      } else {
        endDate.setHours(17, 0, 0, 0) // 5:00 PM
      }
    }

    const title = `Booked: ${booking.roomName}`
    const description = `Booking ID: ${booking.id}\nRoom: ${booking.roomName}\nTime: ${booking.timeSlot || booking.duration}`
    const location = "Urbe Village"

    if (type === 'gcal') {
      // Google Calendar URL
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        details: description,
        location: location
      })
      return `https://calendar.google.com/calendar/render?${params.toString()}`
    } else {
      // iCal format
      const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Urbe Village//Booking System//EN',
        'BEGIN:VEVENT',
        `UID:${booking.id}`,
        `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n')

      const blob = new Blob([icalContent], { type: 'text/calendar' })
      const url = URL.createObjectURL(blob)
      return url
    }
  }

  const handleCalendarDownload = (booking: any, type: 'gcal' | 'ical') => {
    if (type === 'gcal') {
      const url = generateCalendarEvent(booking, 'gcal')
      window.open(url, '_blank')
    } else {
      const url = generateCalendarEvent(booking, 'ical')
      const link = document.createElement('a')
      link.href = url
      link.download = `booking-${booking.id}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Burger Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white/95 backdrop-blur-md">
            <SheetHeader>
              <SheetTitle className="text-red-600">Urbe Village</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  passHref
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noopener noreferrer" : ""}
                  className="text-lg font-medium text-gray-700 hover:text-red-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name} {item.external && <ExternalLink className="inline-block h-4 w-4 ml-1" />}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right: Profile Icon */}
        <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <User className="h-6 w-6" />
              <span className="sr-only">User profile</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md">
            <SheetHeader>
              <SheetTitle className="text-gray-900">My Profile</SheetTitle>
            </SheetHeader>
            
            {/* User Info */}
            <div className="mt-6 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <img 
                src={mockUser.avatar} 
                alt={mockUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{mockUser.name}</h3>
                <p className="text-sm text-gray-600">{mockUser.email}</p>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">My Bookings</h4>
              {allBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {allBookings.map((booking) => (
                    <Card key={booking.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">{booking.roomName}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-600">{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-gray-600">
                                {booking.timeSlot || booking.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCalendarDownload(booking, 'gcal')}
                              className="h-8 px-2 text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              GCal
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCalendarDownload(booking, 'ical')}
                              className="h-8 px-2 text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              iCal
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 