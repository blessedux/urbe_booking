"use client"

import { Header } from '@/components/header'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { motion } from 'framer-motion'
import { DotLoader } from '@/components/ui/dot-loader'

// Animation frames for the dot loader - Pong game
const loaderFrames = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

export default function UnguidedTourPage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        {/* Permanent Pong Preloader with Background */}
        <motion.div 
          className="absolute inset-0 bg-gray-900 flex items-center justify-center z-30"
          initial={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Blurred background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-sm"
            style={{ backgroundImage: "url('/images/background1.png')" }}
          />
          
          {/* Big background title with 40% opacity */}
          <motion.h1 
            className="text-7xl md:text-9xl lg:text-[12rem] font-bold text-white/40 drop-shadow-lg absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            UNGUIDED TOURS
          </motion.h1>
          
          {/* Two-line title pushed to the left - no hover interaction */}
          <motion.div 
            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-6xl md:text-8xl lg:text-[10rem] font-black text-white/20 drop-shadow-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <div className="flex flex-col space-y-4">
              <span className="font-sans tracking-widest">
                UNGUIDED
              </span>
              <span className="font-sans tracking-widest">
                TOURS
              </span>
            </div>
          </motion.div>
          
          {/* Centered pong loader and city map loading */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            <DotLoader
              frames={loaderFrames}
              dotClassName="bg-white/80 [&.dot-loader-active]:bg-white size-1.5 transition-all duration-200"
              duration={200}
              className="scale-150 gap-0.5"
              isPlaying={true}
            />
            
            {/* Subtle city map loading */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-2 text-white/60 text-sm font-mono">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <span>LOADING CITY MAP</span>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 