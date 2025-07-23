"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileSwipeNavigationProps {
  children: React.ReactNode
}

export function MobileSwipeNavigation({ children }: MobileSwipeNavigationProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 100
  // Maximum vertical movement to still be considered a horizontal swipe
  const maxVerticalMovement = 50

  // Calculate motion blur based on drag distance
  const getMotionBlur = () => {
    if (!isDragging || !isMobile) return 0
    
    const deltaX = Math.abs(dragStartX - dragCurrentX)
    const maxBlur = 8 // Maximum blur in pixels
    const blurThreshold = 50 // Distance at which blur starts
    
    if (deltaX < blurThreshold) return 0
    
    const blurIntensity = Math.min((deltaX - blurThreshold) / 100, 1) * maxBlur
    return blurIntensity
  }

  // Calculate blur direction based on swipe direction
  const getBlurDirection = () => {
    if (!isDragging || !isMobile) return 0
    
    const deltaX = dragStartX - dragCurrentX
    const blurAmount = getMotionBlur()
    
    // If swiping left (deltaX > 0), distortion should go right (positive) - same direction
    // If swiping right (deltaX < 0), distortion should go left (negative) - same direction
    return deltaX > 0 ? blurAmount : -blurAmount
  }



  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) {
      return
    }
    
    // Check if touch is within the room showcase area
    const roomShowcase = document.querySelector('[data-room-showcase]')
    if (roomShowcase) {
      const rect = roomShowcase.getBoundingClientRect()
      const touchX = e.touches[0].clientX
      const touchY = e.touches[0].clientY
      
      // If touch is within the room showcase area, don't handle swipe navigation
      if (touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom) {
        return
      }
    }
    
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragStartY(e.touches[0].clientY)
    setDragCurrentX(e.touches[0].clientX)
    setDragCurrentY(e.touches[0].clientY)
    setShowSwipeHint(false)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return
    
    setDragCurrentX(e.touches[0].clientX)
    setDragCurrentY(e.touches[0].clientY)
    
    // Show swipe hint when dragging starts
    const deltaX = dragStartX - e.touches[0].clientX
    if (Math.abs(deltaX) > 20) {
      setShowSwipeHint(true)
    }
  }

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) {
      return
    }
    
    const deltaX = dragStartX - dragCurrentX
    const deltaY = Math.abs(dragStartY - dragCurrentY)
    
    // Only process horizontal swipes with minimal vertical movement
    if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalMovement) {
      const currentPath = window.location.pathname
      
      if (deltaX > 0) {
        // Swiped left to right
        if (currentPath === '/profile') {
          // Stay on profile page (opposite direction)
        } else if (currentPath === '/') {
          router.push('/profile')
        } else if (currentPath === '/events') {
          router.push('/')
        }
      } else {
        // Swiped right to left
        if (currentPath === '/events') {
          // Stay on events page
        } else if (currentPath === '/') {
          router.push('/events')
        } else if (currentPath === '/profile') {
          router.push('/')
        }
      }
    }
    
    setIsDragging(false)
  }

  useEffect(() => {
    if (!isMobile) {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, isDragging, dragStartX, dragStartY, dragCurrentX, dragCurrentY])

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ 
        touchAction: isMobile ? 'pan-y' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div
        style={{
          filter: `blur(${getMotionBlur()}px)`,
          transition: isDragging ? 'none' : 'filter 0.3s ease-out',
          transform: isDragging ? `translateX(${(dragCurrentX - dragStartX) * 0.1}px) skewX(${getBlurDirection() * 0.5}deg)` : 'translateX(0) skewX(0deg)',
          transitionProperty: isDragging ? 'none' : 'filter, transform'
        }}
      >
        {children}
      </div>
    </div>
  )
} 