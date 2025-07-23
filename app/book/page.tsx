"use client"

import { Header } from "@/components/header"
import { RoomBooking } from "@/components/room-showcase"
import { MobileSwipeNavigation } from "@/components/mobile-swipe-navigation"
import { PageTransition } from "@/components/page-transition"

export default function BookPage() {
  return (
    <PageTransition className="relative">
      <Header />
      <MobileSwipeNavigation>
        <main>
          <RoomBooking />
        </main>
      </MobileSwipeNavigation>
    </PageTransition>
  )
} 