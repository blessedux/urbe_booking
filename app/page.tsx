"use client"

import { Header } from '@/components/header'
import { Component as FlipLinks } from '@/components/ui/flip-links'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { PWAInstaller } from '@/components/pwa-installer'

export default function HomePage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        {/* Menu Content */}
        <div className="relative z-10 min-h-screen">
          <FlipLinks />
        </div>
        
        {/* Small UV Logo - Bottom center */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <a 
            href="https://urbe.build" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block transition-transform hover:scale-110"
          >
            <img 
              src="/images/UVlogo2.png" 
              alt="Urbe Village" 
              className="w-16 h-auto md:w-20 opacity-100 cursor-pointer"
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            />
          </a>
        </div>
        
        {/* PWA Installer */}
        <PWAInstaller />
      </PageTransition>
    </MobileSwipeNavigation>
  )
}
