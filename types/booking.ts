export type RoomType = "hourly" | "desk"

export type Room = {
  id: string
  name: string
  description: string
  type: RoomType
  availableHours?: string[]
  capacity?: number
  image?: string
}

export type Booking = {
  id: string
  roomId: string
  roomName: string
  date: string // YYYY-MM-DD
  timeSlot?: string // for meeting room
  duration?: string // for desk bookings
  seatNumber?: number // for desk bookings
  createdAt: string
}

export type BookingFormData = {
  roomId: string
  date: string
  timeSlot?: string
  duration?: string
  seatNumber?: number
}
