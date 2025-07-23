"use client"

import { Header } from '@/components/header'
import { Component as FlipLinks } from '@/components/ui/flip-links'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { PWAInstaller } from '@/components/pwa-installer'

export default function MenuPage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        {/* Menu Content */}
        <div className="relative z-10 min-h-screen">
          <FlipLinks />
          
          {/* Debug PWA Button - Remove in production */}
          <div className="fixed top-20 right-4 z-50">
            <button
              onClick={() => {
                console.log('Debug: Triggering PWA prompt manually')
                // This will be handled by the PWA installer component
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            >
              Debug PWA
            </button>
          </div>
        </div>
        
        {/* PWA Installer */}
        <PWAInstaller />
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 