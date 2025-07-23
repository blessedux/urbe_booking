"use client"

import { Header } from '@/components/header'
import { Component as FlipLinks } from '@/components/ui/flip-links'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'

export default function MenuPage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        {/* Menu Content */}
        <div className="relative z-10 min-h-screen">
          <FlipLinks />
        </div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 