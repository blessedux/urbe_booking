import { Header } from "@/components/header"
import { RoomBooking } from "@/components/room-showcase"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <RoomBooking />
      </main>
    </div>
  )
}
