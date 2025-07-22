import type { Room } from "@/types/booking"

export const ROOMS: Room[] = [
  {
    id: "meeting-room",
    name: "Meeting Room",
    description: "Private room for meetings. Book in 1-hour blocks.",
    type: "hourly",
    availableHours: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Meeting+Room"
  },
  {
    id: "hot-desk",
    name: "Hot Desk Area",
    description: "24 open desks. Book in 4h blocks or full day.",
    type: "desk",
    capacity: 24,
    image: "https://via.placeholder.com/400x300/10b981/ffffff?text=Hot+Desk+Area"
  },
  {
    id: "focus-room",
    name: "Focus Room",
    description: "6 silent desks. No meetings. Book in 4h or full day.",
    type: "desk",
    capacity: 6,
    image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Focus+Room"
  },
]

export const DURATION_OPTIONS = [
  { value: "4h", label: "4 Hours (9:00 - 13:00)" },
  { value: "8h", label: "Full Day (9:00 - 17:00)" },
]
