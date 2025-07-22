import type { Booking } from "@/types/booking"

// Mock in-memory store for MVP
const bookings: Booking[] = []

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
