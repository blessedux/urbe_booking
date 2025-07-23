"use client"

import { Header } from '@/components/header'
import { Component as FlipLinks } from '@/components/ui/flip-links'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { PWAInstaller } from '@/components/pwa-installer'

export default function HomePage() {
  const handleDebugPWA = () => {
    console.log('🔍 PWA Debug: Manual trigger clicked')
    console.log('🔍 PWA Debug: User Agent:', navigator.userAgent)
    console.log('🔍 PWA Debug: Screen Size:', window.innerWidth, 'x', window.innerHeight)
    console.log('🔍 PWA Debug: Display Mode:', window.matchMedia('(display-mode: standalone)').matches)
    console.log('🔍 PWA Debug: Service Worker:', 'serviceWorker' in navigator)
    console.log('🔍 PWA Debug: iOS Detection:', /iPad|iPhone|iPod/.test(navigator.userAgent))
    console.log('🔍 PWA Debug: Touch Support:', 'ontouchstart' in window)
    console.log('🔍 PWA Debug: Max Touch Points:', navigator.maxTouchPoints)
    
    // Force show the prompt for testing
    window.dispatchEvent(new Event('beforeinstallprompt'))
    
    // For iOS, show manual instructions
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      alert('📱 iOS PWA Installation:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm\n\nThis will install Urbe Village on your home screen!')
    }
  }

  const handleForceShowPrompt = () => {
    // Force show the PWA prompt by dispatching a custom event
    const event = new CustomEvent('forceShowPWAPrompt')
    window.dispatchEvent(event)
    console.log('🔍 PWA Debug: Force show prompt event dispatched')
  }

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
          <img 
            src="/images/UVlogo2.png" 
            alt="Urbe Village" 
            className="w-16 h-auto md:w-20 opacity-100"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        
        {/* PWA Installer */}
        <PWAInstaller />
        
        {/* Debug PWA Buttons - Remove after testing */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          <button
            onClick={handleDebugPWA}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm block w-full"
          >
            Debug PWA
          </button>
          <button
            onClick={handleForceShowPrompt}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm block w-full"
          >
            Force Show
          </button>
        </div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
}
