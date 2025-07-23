"use client"

import { Header } from "@/components/header"
import { RoomBooking } from "@/components/room-showcase"
import { MobileSwipeNavigation } from "@/components/mobile-swipe-navigation"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition className="relative">
        <Header />
        <main>
          <RoomBooking />
        </main>
        

      </PageTransition>
    </MobileSwipeNavigation>
  )
}
