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
  isAnimating = false,
}: {
  className?: string
  image?: string
  children?: React.ReactNode
  isAnimating?: boolean
}) => {
  return (
    <div
      className={cn(
        "w-[350px] cursor-pointer h-[400px] overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] select-none",
        className
      )}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {image && (
        <div className="relative h-72 rounded-xl shadow-lg overflow-hidden w-[calc(100%-1rem)] mx-2 mt-2">
          <motion.img
            src={image}
            alt="card"
            className="object-cover mt-0 w-full h-full"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      )}
      {children && (
        <motion.div 
          className="px-4 p-2 flex flex-col gap-y-2"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
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
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isContentAnimating, setIsContentAnimating] = useState(false)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 80

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

  // Content animation effect when currentCardIndex changes
  useEffect(() => {
    setIsContentAnimating(true)
    const timer = setTimeout(() => {
      setIsContentAnimating(false)
    }, 300) // Match the animation duration
    return () => clearTimeout(timer)
  }, [currentCardIndex])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    console.log("Drag start triggered")
    if (selectedRoomIndex !== null) return // Don't allow dragging when calendar is open
    
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragCurrentX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || selectedRoomIndex !== null) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragCurrentX(clientX)
    setDragOffset(dragStartX - clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging || selectedRoomIndex !== null) return
    
    setIsDragging(false)
    
    // Determine swipe direction and navigate
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        // Swiped left - go to next card
        onNextCard()
      } else {
        // Swiped right - go to previous card
        onPreviousCard()
      }
    }
    
    // Reset drag state
    setDragOffset(0)
  }

  const handleEdgeClick = (direction: 'left' | 'right') => {
    console.log("Edge click triggered:", direction)
    if (selectedRoomIndex !== null) return // Don't allow navigation when calendar is open
    
    if (direction === 'left') {
      console.log("Calling onPreviousCard")
      onPreviousCard()
    } else {
      console.log("Calling onNextCard")
      onNextCard()
    }
  }

  // Limit to maximum of 3 cards
  const limitedCards = cards.slice(0, 3)

  return (
    <div 
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none rounded-3xl backdrop-blur-sm bg-white/5"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Left Edge Click Area */}
      <div 
        className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer"
        onClick={() => handleEdgeClick('left')}
      />
      
      {/* Right Edge Click Area */}
      <div 
        className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer"
        onClick={() => handleEdgeClick('right')}
      />
      
      {/* Center Cards Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="relative w-[350px] h-[400px]">
        {limitedCards.map((card, index) => {
          const isFirst = index === 0
          const isSelected = selectedRoomIndex !== null && selectedRoomIndex === index
          const isCurrentCard = index === currentCardIndex

          // Calculate the correct card indices for each position
          const totalCards = cards.length
          let cardIndex = currentCardIndex
          
          if (index === 1) {
            // Left card - previous card
            cardIndex = currentCardIndex === 0 ? totalCards - 1 : currentCardIndex - 1
          } else if (index === 2) {
            // Right card - next card
            cardIndex = currentCardIndex === totalCards - 1 ? 0 : currentCardIndex + 1
          }
          // index === 0 is center card - uses currentCardIndex

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
              key={`${index}-${currentCardIndex}`}
              className={cn("absolute", isFirst ? "z-10" : "z-0")}
              initial={{ x: 0, rotate: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{
                x: isAnimating && !isSelected ? xOffset : (isDragging ? dragOffset * 0.1 : 0),
                rotate: isAnimating && !isSelected ? rotation : 0,
                y: isSelected ? -50 : 0,
                opacity: 1,
                scale: isSelected ? 0.9 : 1,
                filter: isSelected ? "blur(1px)" : (selectedRoomIndex !== null ? "blur(2px)" : "blur(0px)"),
                zIndex: isSelected ? 20 : (isFirst ? 10 : 0),
              }}
              transition={{
                duration: isDragging ? 0 : 0.3,
                ease: "easeInOut",
                delay: index * animationDelay,
                type: "spring",
              }}
              layout={false}
              onClick={() => !isSelected && !isDragging && onCardClick?.(currentCardIndex)}
            >
              <Card
                className={isCurrentCard ? "z-10 cursor-pointer" : "z-0"}
                image={cards[cardIndex].image}
                isAnimating={isFirst && isContentAnimating}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {cards[cardIndex].title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {cards[cardIndex].description}
                </p>
              </Card>
            </motion.div>
          )
        })}
        </div>
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
    console.log("handlePreviousCard called, current index:", currentCardIndex)
    setCurrentCardIndex((prev) => {
      const newIndex = prev === 0 ? galleryItems.length - 1 : prev - 1
      console.log("Setting new index to:", newIndex)
      return newIndex
    })
  }

  const handleNextCard = () => {
    console.log("handleNextCard called, current index:", currentCardIndex)
    setCurrentCardIndex((prev) => {
      const newIndex = prev === galleryItems.length - 1 ? 0 : prev + 1
      console.log("Setting new index to:", newIndex)
      return newIndex
    })
  }

  // Track currentCardIndex changes
  useEffect(() => {
    console.log("currentCardIndex changed to:", currentCardIndex)
  }, [currentCardIndex])

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