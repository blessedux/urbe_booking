"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from "framer-motion"

interface TestCard {
  id: number
  title: string
  color: string
  description: string
}

const testCards: TestCard[] = [
  { 
    id: 1, 
    title: "Meeting Room", 
    color: "bg-red-500",
    description: "Perfect for team meetings and presentations"
  },
  { 
    id: 2, 
    title: "Hot Desk Area", 
    color: "bg-blue-500",
    description: "Flexible workspace for individual work"
  },
  { 
    id: 3, 
    title: "Focus Room", 
    color: "bg-green-500",
    description: "Quiet space for deep work and concentration"
  },
  { 
    id: 4, 
    title: "Conference Room", 
    color: "bg-purple-500",
    description: "Large space for conferences and events"
  },
  { 
    id: 5, 
    title: "Private Office", 
    color: "bg-yellow-500",
    description: "Dedicated private workspace"
  },
]

// Card component for the Framer Motion animation
const Card = ({
  className,
  color,
  children,
}: {
  className?: string
  color: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={`w-[350px] cursor-pointer h-[400px] overflow-hidden rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.02)] border-0 select-none ${color} ${className}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {children && (
        <div className="px-4 p-2 flex flex-col gap-y-2 h-full flex items-center justify-center text-white">
          {children}
        </div>
      )}
    </div>
  )
}

// Stacked Cards Animation Component (from room showcase)
const StackedCardsAnimation = ({
  cards,
  spreadDistance = 40,
  rotationAngle = 5,
  animationDelay = 0.1,
  onCardClick,
  currentCardIndex,
  onPreviousCard,
  onNextCard,
}: {
  cards: TestCard[]
  spreadDistance?: number
  rotationAngle?: number
  animationDelay?: number
  onCardClick?: (index: number) => void
  currentCardIndex: number
  onPreviousCard: () => void
  onNextCard: () => void
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  const minSwipeDistance = 80

  // Auto-animation timer - trigger once after 1.5s on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragCurrentX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragCurrentX(clientX)
    setDragOffset(dragStartX - clientX)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        onNextCard()
      } else {
        onPreviousCard()
      }
    }
    
    setDragOffset(0)
  }

  const handleEdgeClick = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      onPreviousCard()
    } else {
      onNextCard()
    }
  }

  const limitedCards = cards.slice(0, 3)

  return (
    <div 
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none border-2 border-white rounded-3xl"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Left Edge Click Area */}
      <div 
        className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer bg-red-500/10"
        onClick={() => handleEdgeClick('left')}
      />
      
      {/* Right Edge Click Area */}
      <div 
        className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer bg-blue-500/10"
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
          const isCurrentCard = index === currentCardIndex

          let xOffset = 0
          let rotation = 0

          if (limitedCards.length > 1) {
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
              className={isFirst ? "z-10" : "z-0"}
              initial={{ x: 0, rotate: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{
                x: isAnimating ? xOffset : (isDragging ? dragOffset * 0.1 : 0),
                rotate: isAnimating ? rotation : 0,
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                zIndex: isFirst ? 10 : 0,
              }}
              transition={{
                duration: isDragging ? 0 : 0.3,
                ease: "easeInOut",
                delay: index * animationDelay,
                type: "spring",
              }}
              layout={false}
              {...(isCurrentCard && {
                onClick: () => !isDragging && onCardClick?.(index),
              })}
            >
              <Card
                className={isCurrentCard ? "z-10 cursor-pointer" : "z-0"}
                color={card.color}
              >
                <h2 className="text-2xl font-bold text-center">{card.title}</h2>
                <p className="text-sm text-center opacity-90">{card.description}</p>
                <div className="text-xs opacity-75 text-center mt-2">
                  Card {card.id} of {cards.length}
                </div>
              </Card>
            </motion.div>
          )
        })}
        </div>
      </div>
    </div>
  )
}

// Original CSS-based carousel component
const CSSCarousel = () => {
  const cardStackRef = useRef<HTMLDivElement>(null)
  const isSwiping = useRef(false)
  const startX = useRef(0)
  const currentX = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: testCards.length }, (_, i) => i)
  )

  const getDurationFromCSS = useCallback((
    variableName: string,
    element?: HTMLElement | null
  ): number => {
    const targetElement = element || document.documentElement
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim()
    if (!value) return 0
    if (value.endsWith("ms")) return parseFloat(value)
    if (value.endsWith("s")) return parseFloat(value) * 1000
    return parseFloat(value) || 0
  }, [])

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return []
    return [...cardStackRef.current.querySelectorAll('.image-card')] as HTMLElement[]
  }, [])

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards()
    return cards[0] || null
  }, [getCards])

  const updatePositions = useCallback(() => {
    const cards = getCards()
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString())
      card.style.setProperty('--swipe-x', '0px')
      card.style.setProperty('--swipe-rotate', '0deg')
      card.style.opacity = '1'
    })
  }, [getCards])

  const applySwipeStyles = useCallback((deltaX: number) => {
    const card = getActiveCard()
    if (!card) return
    card.style.setProperty('--swipe-x', `${deltaX}px`)
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`)
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString()
  }, [getActiveCard])

  const handleStart = useCallback((clientX: number) => {
    if (isSwiping.current) return
    isSwiping.current = true
    startX.current = clientX
    currentX.current = clientX
    const card = getActiveCard()
    if (card) card.style.transition = 'none'
  }, [getActiveCard])

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }

    const deltaX = currentX.current - startX.current
    const threshold = 50
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current)
    const card = getActiveCard()

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX)
        card.style.setProperty('--swipe-x', `${direction * 300}px`)
        card.style.setProperty('--swipe-rotate', `${direction * 20}deg`)

        setTimeout(() => {
          if (getActiveCard() === card) {
            card.style.setProperty('--swipe-rotate', `${-direction * 20}deg`)
          }
        }, duration * 0.5)

        setTimeout(() => {
          setCardOrder(prev => {
            if (prev.length === 0) return []
            return [...prev.slice(1), prev[0]]
          })
        }, duration)
      } else {
        applySwipeStyles(0)
      }
    }

    isSwiping.current = false
    startX.current = 0
    currentX.current = 0
  }, [getDurationFromCSS, getActiveCard, applySwipeStyles])

  const handleMove = useCallback((clientX: number) => {
    if (!isSwiping.current) return
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    animationFrameId.current = requestAnimationFrame(() => {
      currentX.current = clientX
      const deltaX = currentX.current - startX.current
      applySwipeStyles(deltaX)

      if (Math.abs(deltaX) > 50) {
        handleEnd()
      }
    })
  }, [applySwipeStyles, handleEnd])

  useEffect(() => {
    const cardStackElement = cardStackRef.current
    if (!cardStackElement) return

    const handlePointerDown = (e: PointerEvent) => {
      handleStart(e.clientX)
    }
    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX)
    }
    const handlePointerUp = (e: PointerEvent) => {
      handleEnd()
    }

    cardStackElement.addEventListener('pointerdown', handlePointerDown)
    cardStackElement.addEventListener('pointermove', handlePointerMove)
    cardStackElement.addEventListener('pointerup', handlePointerUp)

    return () => {
      cardStackElement.removeEventListener('pointerdown', handlePointerDown)
      cardStackElement.removeEventListener('pointermove', handlePointerMove)
      cardStackElement.removeEventListener('pointerup', handlePointerUp)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleStart, handleMove, handleEnd])

  useEffect(() => {
    updatePositions()
  }, [cardOrder, updatePositions])

  const cardWidth = 320
  const cardHeight = 400

  return (
    <section
      className="relative grid place-content-center select-none mx-auto"
      ref={cardStackRef}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        touchAction: 'none',
        transformStyle: 'preserve-3d',
        '--card-perspective': '700px',
        '--card-z-offset': '12px',
        '--card-y-offset': '7px',
        '--card-max-z-index': testCards.length.toString(),
        '--card-swap-duration': '0.3s',
      } as React.CSSProperties}
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${testCards[originalIndex].id}-${originalIndex}`}
          className="image-card absolute cursor-grab active:cursor-grabbing
                     place-self-center rounded-xl shadow-2xl overflow-hidden 
                     will-change-transform border-0"
          style={{
            '--i': (displayIndex + 1).toString(),
            zIndex: testCards.length - displayIndex,
            width: cardWidth,
            height: cardHeight,
            transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`
          } as React.CSSProperties}
        >
          <div 
            className={`w-full h-full ${testCards[originalIndex].color} flex flex-col items-center justify-center text-white p-6`}
          >
            <h2 className="text-3xl font-bold mb-4 text-center">{testCards[originalIndex].title}</h2>
            <p className="text-lg opacity-90 text-center mb-6">{testCards[originalIndex].description}</p>
            <div className="text-sm opacity-75 text-center">
              <p>Card {originalIndex + 1} of {testCards.length}</p>
              {displayIndex === 0 && (
                <div className="mt-4 text-lg animate-pulse">
                  ← Swipe to navigate →
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export function SwipeTest() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [activeAnimation, setActiveAnimation] = useState<'css' | 'framer'>('css')

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => {
      const newIndex = prev === 0 ? testCards.length - 1 : prev - 1
      return newIndex
    })
  }

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => {
      const newIndex = prev === testCards.length - 1 ? 0 : prev + 1
      return newIndex
    })
  }

  const handleCardClick = (index: number) => {
    console.log('Card clicked:', index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Card Animation Tests</h1>
        
        {/* Animation Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveAnimation('css')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeAnimation === 'css' 
                  ? 'bg-white text-orange-500' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              CSS Carousel
            </button>
            <button
              onClick={() => setActiveAnimation('framer')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeAnimation === 'framer' 
                  ? 'bg-white text-orange-500' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Framer Motion
            </button>
          </div>
        </div>

        {/* Animation Container */}
        <div className="h-96 md:h-[500px] lg:h-[600px] relative">
          {activeAnimation === 'css' ? (
            <CSSCarousel />
          ) : (
            <StackedCardsAnimation
              cards={testCards}
              spreadDistance={30}
              rotationAngle={3}
              animationDelay={0.05}
              onCardClick={handleCardClick}
              currentCardIndex={currentCardIndex}
              onPreviousCard={handlePreviousCard}
              onNextCard={handleNextCard}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-white/90">
          <p className="text-lg font-semibold mb-2">How to navigate:</p>
          <div className="space-y-1 text-sm">
            <p>• <strong>Desktop:</strong> Drag the card left/right</p>
            <p>• <strong>Mobile:</strong> Swipe left/right on the card</p>
            <p>• <strong>Edges:</strong> Click left/right edges of the container</p>
            <p>• <strong>Minimum swipe:</strong> 50px (CSS) / 80px (Framer)</p>
            <p>• <strong>Current:</strong> {activeAnimation === 'css' ? 'CSS Carousel' : 'Framer Motion'} animation</p>
          </div>
        </div>
      </div>
    </div>
  )
} 