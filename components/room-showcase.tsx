"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ROOMS } from "@/data/rooms"
import { BookingCalendar } from "./booking-calendar"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Card = ({
  className,
  image,
  children,
}: {
  className?: string
  image?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "w-[350px] cursor-pointer h-[400px] overflow-hidden bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.02)] border border-gray-200/80",
        className
      )}
    >
      {image && (
        <div className="relative h-72 rounded-xl shadow-lg overflow-hidden w-[calc(100%-1rem)] mx-2 mt-2">
          <img
            src={image}
            alt="card"
            className="object-cover mt-0 w-full h-full"
          />
        </div>
      )}
      {children && (
        <div className="px-4 p-2 flex flex-col gap-y-2">{children}</div>
      )}
    </div>
  )
}

interface CardData {
  image: string
  title: string
  description: string
}

const StackedCardsInteraction = ({
  cards,
  spreadDistance = 40,
  rotationAngle = 5,
  animationDelay = 0.1,
  onCardClick,
  selectedRoomIndex,
  currentCardIndex,
  onPreviousCard,
  onNextCard,
}: {
  cards: CardData[]
  spreadDistance?: number
  rotationAngle?: number
  animationDelay?: number
  onCardClick?: (index: number) => void
  selectedRoomIndex?: number | null
  currentCardIndex: number
  onPreviousCard: () => void
  onNextCard: () => void
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Auto-animation timer - trigger once after 1.5s on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedRoomIndex === null) {
        setIsAnimating(true)
        // Don't reset isAnimating back to false - keep cards spread out
      }
    }, 1500) // Trigger once after 1.5 seconds

    return () => clearTimeout(timer)
  }, [selectedRoomIndex])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onNextCard()
    }
    if (isRightSwipe) {
      onPreviousCard()
    }
  }

  // Limit to maximum of 3 cards
  const limitedCards = cards.slice(0, 3)

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-[350px] h-[400px]">
        {limitedCards.map((card, index) => {
          const isFirst = index === 0
          const isSelected = selectedRoomIndex !== null && selectedRoomIndex === index
          const isCurrentCard = index === currentCardIndex

          let xOffset = 0
          let rotation = 0

          if (limitedCards.length > 1) {
            // First card stays in place
            // Second card goes left
            // Third card goes right
            if (index === 1) {
              xOffset = -spreadDistance
              rotation = -rotationAngle
            } else if (index === 2) {
              xOffset = spreadDistance
              rotation = rotationAngle
            }
          }

          return (
            <motion.div
              key={index}
              className={cn("absolute", isFirst ? "z-10" : "z-0")}
              initial={{ x: 0, rotate: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{
                x: isAnimating && !isSelected ? xOffset : 0,
                rotate: isAnimating && !isSelected ? rotation : 0,
                y: isSelected ? -50 : 0,
                opacity: 1,
                scale: isSelected ? 0.9 : 1,
                filter: isSelected ? "blur(1px)" : "blur(0px)",
                zIndex: isSelected ? 20 : (isFirst ? 10 : 0),
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: index * animationDelay,
                type: "spring",
              }}
              {...(isCurrentCard && {
                onClick: () => !isSelected && onCardClick?.(index),
              })}
            >
              <Card
                className={isCurrentCard ? "z-10 cursor-pointer" : "z-0"}
                image={card.image}
              >
                <h2 className="text-2xl font-bold text-gray-900">{card.title}</h2>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function RoomBooking() {
  const router = useRouter()
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Convert our rooms data to the format expected by StackedCardsInteraction
  const galleryItems = ROOMS.map(room => ({
    image: room.image || `https://via.placeholder.com/800/600/dc2626/ffffff?text=${encodeURIComponent(room.name)}`,
    title: room.name,
    description: room.description
  }))

  const handleRoomSelect = (roomIndex: number) => {
    setSelectedRoomIndex(roomIndex)
  }

  const handleBackToGallery = () => {
    setSelectedRoomIndex(null)
  }

  const handleBookingComplete = (bookingId: string) => {
    // Redirect to confirmation page immediately
    router.push(`/confirmation/${bookingId}`)
  }

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
  }

  // Global click handler to close calendar when clicking outside
  useEffect(() => {
    const handleGlobalClick = (event: Event) => {
      if (selectedRoomIndex !== null && calendarRef.current) {
        // Check if click is outside the calendar
        if (!calendarRef.current.contains(event.target as Node)) {
          handleBackToGallery()
        }
      }
    }

    if (selectedRoomIndex !== null) {
      document.addEventListener('mousedown', handleGlobalClick)
      document.addEventListener('touchstart', handleGlobalClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick)
      document.removeEventListener('touchstart', handleGlobalClick)
    }
  }, [selectedRoomIndex])

  const selectedRoom = selectedRoomIndex !== null ? ROOMS[selectedRoomIndex] : null

  return (
    <section className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/images/background1.png)' }}>
      <div className="container mx-auto px-4">
        {/* Gallery and Calendar Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="h-96 md:h-[500px] lg:h-[600px] relative">
            
            {/* Background Room Image for Calendar - Fade out on confirmation */}
            {selectedRoom && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[350px] h-[400px] relative">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover rounded-2xl opacity-20"
                  />
                </div>
              </motion.div>
            )}
            
            {/* Gallery View - Always visible */}
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                opacity: 1 
              }}
              transition={{ duration: 0.3 }}
              style={{ 
                pointerEvents: 'auto' 
              }}
            >
              <StackedCardsInteraction
                cards={galleryItems}
                spreadDistance={30}
                rotationAngle={3}
                animationDelay={0.05}
                onCardClick={handleRoomSelect}
                selectedRoomIndex={selectedRoomIndex}
                currentCardIndex={currentCardIndex}
                onPreviousCard={handlePreviousCard}
                onNextCard={handleNextCard}
              />
            </motion.div>

            {/* Calendar View - Overlays on top */}
            {selectedRoomIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute inset-0 z-30"
              >
                <div ref={calendarRef}>
                  <BookingCalendar
                    selectedRoomIndex={selectedRoomIndex}
                    onBack={handleBackToGallery}
                    onBookingComplete={handleBookingComplete}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 