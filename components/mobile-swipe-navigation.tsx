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
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 100
  // Maximum vertical movement to still be considered a horizontal swipe
  const maxVerticalMovement = 50

  // Calculate motion blur based on drag distance
  const getMotionBlur = () => {
    if (!isDragging || !isMobile || !isSwipeDirectionFunctional()) return 0
    
    const deltaX = Math.abs(dragStartX - dragCurrentX)
    const maxBlur = 8 // Maximum blur in pixels
    const blurThreshold = 50 // Distance at which blur starts
    
    if (deltaX < blurThreshold) return 0
    
    const blurIntensity = Math.min((deltaX - blurThreshold) / 100, 1) * maxBlur
    return blurIntensity
  }

  // Calculate content slide direction based on swipe direction
  const getContentSlide = () => {
    if (!isDragging || !isMobile || !isSwipeDirectionFunctional()) return 0
    
    const deltaX = dragStartX - dragCurrentX
    const slideIntensity = Math.min(Math.abs(deltaX) / 400, 0.15) // Reduced max slide to 15%
    
    // If swiping left to right (deltaX > 0), content should slide left (negative)
    // If swiping right to left (deltaX < 0), content should slide right (positive)
    return deltaX > 0 ? -slideIntensity : slideIntensity
  }

  // Calculate skew direction for motion blur effect
  const getSkewDirection = () => {
    if (!isDragging || !isMobile || !isSwipeDirectionFunctional()) return 0
    
    const deltaX = dragStartX - dragCurrentX
    const skewIntensity = Math.min(Math.abs(deltaX) / 800, 0.05) // Reduced max skew to 5%
    
    // Skew in the same direction as swipe for opposite motion blur effect
    return deltaX > 0 ? skewIntensity : -skewIntensity
  }

  // Calculate opacity for fade effect
  const getOpacity = () => {
    if (!isDragging || !isMobile || !isSwipeDirectionFunctional()) return 1
    
    const deltaX = Math.abs(dragStartX - dragCurrentX)
    const fadeThreshold = 30 // Start fading after 30px
    const maxFade = 0.3 // Minimum opacity (70% fade out)
    
    if (deltaX < fadeThreshold) return 1
    
    const fadeIntensity = Math.min((deltaX - fadeThreshold) / 100, 1) * (1 - maxFade)
    return 1 - fadeIntensity
  }

  // Check if current swipe direction is functional for the current page
  const isSwipeDirectionFunctional = () => {
    if (!isDragging || !isMobile) return false
    
    const deltaX = dragStartX - dragCurrentX
    const currentPath = window.location.pathname
    
    // Exclude home page (menu) from swipe navigation - it should be accessed via header icon
    if (currentPath === '/') {
      return false
    }
    
    if (deltaX > 0) {
      // Swiping left to right
      if (currentPath === '/profile') {
        return true // Can go to book (hub)
      } else if (currentPath === '/book') {
        return true // Can go to profile
      } else if (currentPath === '/events') {
        return true // Can go to book (hub)
      } else if (currentPath === '/unguided-tour') {
        return true // Can go to book (hub)
      }
    } else {
      // Swiping right to left
      if (currentPath === '/events') {
        return true // Can go to book (hub)
      } else if (currentPath === '/book') {
        return true // Can go to events
      } else if (currentPath === '/profile') {
        return true // Can go to book (hub)
      } else if (currentPath === '/unguided-tour') {
        return true // Can go to book (hub)
      }
    }
    
    return false
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return
    
    // Check if the touch target is a link or button
    const target = e.target as HTMLElement
    if (target.closest('a, button, [role="button"]')) {
      return // Don't start swipe navigation for links and buttons
    }
    
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragStartY(e.touches[0].clientY)
    setDragCurrentX(e.touches[0].clientX)
    setDragCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return
    
    setDragCurrentX(e.touches[0].clientX)
    setDragCurrentY(e.touches[0].clientY)
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
      
      // Exclude home page (menu) from swipe navigation - it should be accessed via header icon
      if (currentPath === '/') {
        return
      }
      
      if (deltaX > 0) {
        // Swiped left to right
        if (currentPath === '/profile') {
          router.push('/book')
        } else if (currentPath === '/book') {
          router.push('/profile')
        } else if (currentPath === '/events') {
          router.push('/book')
        } else if (currentPath === '/unguided-tour') {
          router.push('/book')
        }
      } else {
        // Swiped right to left
        if (currentPath === '/events') {
          router.push('/book')
        } else if (currentPath === '/book') {
          router.push('/events')
        } else if (currentPath === '/profile') {
          router.push('/book')
        } else if (currentPath === '/unguided-tour') {
          router.push('/book')
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

  // Calculate transform values
  const slideX = getContentSlide() * 100 // Convert to percentage
  const skewX = getSkewDirection() * 100 // Convert to degrees
  const blurAmount = getMotionBlur()
  const opacity = getOpacity()

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ 
        touchAction: isMobile ? 'pan-y' : 'auto',
        userSelect: 'text',
        WebkitUserSelect: 'text'
      }}
    >
      <div
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: opacity,
          transform: isDragging 
            ? `translateX(${slideX}%) skewX(${skewX}deg)` 
            : 'translateX(0%) skewX(0deg)',
          transition: isDragging 
            ? 'none' 
            : 'filter 0.3s ease-out, transform 0.3s ease-out, opacity 0.3s ease-out',
          willChange: isDragging ? 'transform, filter, opacity' : 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
} 