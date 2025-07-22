import type { Booking } from "@/types/booking"

// Mock in-memory store for MVP
const bookings: Booking[] = [
  // Sample bookings for testing
  {
    id: "URB-ABC123DEF",
    roomId: "meeting-room-1",
    roomName: "Meeting Room",
    date: "2024-12-20",
    timeSlot: "10:00",
    createdAt: "2024-12-15T10:30:00Z"
  },
  {
    id: "URB-XYZ789GHI",
    roomId: "hot-desk-1",
    roomName: "Hot Desk Area",
    date: "2024-12-21",
    duration: "4h",
    seatNumber: 5,
    createdAt: "2024-12-16T14:20:00Z"
  },
  {
    id: "URB-DEF456JKL",
    roomId: "focus-room-1",
    roomName: "Focus Room",
    date: "2024-12-19",
    timeSlot: "14:00",
    createdAt: "2024-12-14T09:15:00Z"
  },
  {
    id: "URB-GHI789MNO",
    roomId: "conference-room-1",
    roomName: "Conference Room",
    date: "2024-12-22",
    timeSlot: "16:00",
    createdAt: "2024-12-17T11:45:00Z"
  }
]

export const bookingStore = {
  getBookings: () => bookings,

  addBooking: (booking: Booking) => {
    bookings.push(booking)
    return booking
  },

  deleteBooking: (id: string) => {
    const index = bookings.findIndex((booking) => booking.id === id)
    if (index !== -1) {
      bookings.splice(index, 1)
      return true
    }
    return false
  },

  getBookingById: (id: string) => {
    return bookings.find((booking) => booking.id === id)
  },

  getBookingsForDate: (date: string, roomId?: string) => {
    return bookings.filter((booking) => booking.date === date && (!roomId || booking.roomId === roomId))
  },

  generateBookingId: () => {
    return "URB-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  },
}
