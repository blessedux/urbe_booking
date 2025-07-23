"use client"

import { SwipeTest } from "@/components/swipe-test"
import { MobileSwipeNavigation } from "@/components/mobile-swipe-navigation"
import { PageTransition } from "@/components/page-transition"

export default function TestSwipePage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full max-w-6xl">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Swipe Navigation Test</h1>
            <p className="text-white text-center mb-8">Test both card swiping and page navigation swiping</p>
            
            {/* Mobile Swipe Indicators */}
            <div className="fixed inset-0 pointer-events-none z-40 md:hidden">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80">
                <div className="bg-white/30 backdrop-blur-sm rounded-full p-3 border border-white/50">
                  <div className="text-white text-sm font-bold">← Profile</div>
                </div>
              </div>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80">
                <div className="bg-white/30 backdrop-blur-sm rounded-full p-3 border border-white/50">
                  <div className="text-white text-sm font-bold">Events →</div>
                </div>
              </div>
            </div>
            
            <SwipeTest />
          </div>
        </div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 