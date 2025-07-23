"use client"

import { Header } from '@/components/header'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { Globe, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
}

export default function ProfilePage() {
  const limoneProfile: ProfileCardProps = {
    name: "limone.eth",
    role: "Cofounder & product @builders_garden   Hosting a web3 hub in rome @urbeEth @ETHRome 🇮🇹🐺",
    status: "online",
    avatar: "/images/limoneT_eth.jpg",
  }

  return (
    <PageTransition>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>
      
      <Header />
      
      <MobileSwipeNavigation>
        {/* Centered Profile Card */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <ProfileCard {...limoneProfile} />
        </div>
      </MobileSwipeNavigation>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </PageTransition>
  )
}

function ProfileCard({ name, role, status, avatar, tags = [], isVerified, followers }: ProfileCardProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Function to parse role text and make @mentions clickable
  const parseRoleText = (text: string) => {
    const mentionRegex = /@(\w+)/g
    const parts = text.split(mentionRegex)
    const result = []
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text
        result.push(parts[i])
      } else {
        // @mention
        const mention = parts[i]
        const twitterUrl = `https://x.com/${mention}`
        result.push(
          <a
            key={i}
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 transition-colors duration-300 underline decoration-blue-300/50 hover:decoration-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            @{mention}
          </a>
        )
      }
    }
    
    return result
  }

  // Listen for touch events to add rotation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      
      const touch = e.touches[0]
      const centerX = window.innerWidth / 2
      const deltaX = touch.clientX - centerX
      
      // Calculate rotation based on touch position (opposite direction)
      const maxRotation = 8 // Reduced maximum rotation in degrees
      const rotationAmount = -(deltaX / centerX) * maxRotation
      setRotation(rotationAmount)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      setRotation(0)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 w-80 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[20px_20px_40px_rgba(0,0,0,0.2),-20px_-20px_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2"
      style={{
        transform: `rotateY(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >


      {/* Profile Photo with enhanced hover effects */}
      <div className="mb-4 flex justify-center relative z-10">
        <a 
          href="https://x.com/limone_eth" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative group-hover:animate-pulse">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-8px_-8px_16px_rgba(255,255,255,0.15)] group-hover:scale-110">
              <img
                src={avatar}
                alt={name}
                className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl hidden">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
            {/* Glowing ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
          </div>
        </a>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-blue-300">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/80 transition-colors duration-300 group-hover:text-white/90">
          {parseRoleText(role)}
        </p>


      </div>



      {/* Social Icons */}
      <div className="mt-6 flex justify-center gap-6 relative z-10">
        <a 
          href="https://x.com/limone_eth" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110"
          aria-label="X (Twitter)"
        >
          <svg 
            className="h-5 w-5" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a 
          href="https://www.limone.lol/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110"
          aria-label="Website"
        >
          <Globe className="h-5 w-5" />
        </a>
        <a 
          href="https://t.me/limone_eth" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110"
          aria-label="Telegram"
        >
          <Send className="h-5 w-5" />
        </a>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-blue-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
} 