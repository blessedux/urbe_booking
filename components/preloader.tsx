"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface PreloaderProps {
  children: React.ReactNode
  isLoading: boolean
  onLoadingComplete: () => void
  loadingDuration?: number
}

export const Preloader = ({ 
  children, 
  isLoading, 
  onLoadingComplete, 
  loadingDuration = 3000 
}: PreloaderProps) => {
  const [showLoader, setShowLoader] = useState(false)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null)
  const maxTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
      setLoaderComplete(false)
      
      // Simulate loading time
      loadingTimeout.current = setTimeout(() => {
        setLoaderComplete(true)
        // Wait for fade out animation to complete
        setTimeout(() => {
          setShowLoader(false)
          onLoadingComplete()
        }, 500)
      }, loadingDuration)

      // Max 5 seconds window
      maxTimeout.current = setTimeout(() => {
        setLoaderComplete(true)
        setShowLoader(false)
        onLoadingComplete()
      }, 5000)

      return () => {
        if (loadingTimeout.current) clearTimeout(loadingTimeout.current)
        if (maxTimeout.current) clearTimeout(maxTimeout.current)
      }
    }
  }, [isLoading, loadingDuration, onLoadingComplete])

  return (
    <div className="relative min-h-screen">
      {/* Background - same as homepage */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background1.png)' }}
      />
      
      {/* Content with blur effect when loading */}
      <motion.div
        className="relative z-10"
        animate={{
          filter: showLoader ? 'blur(8px)' : 'blur(0px)',
          opacity: showLoader ? 0.3 : 1
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {children}
      </motion.div>

      {/* Preloader Overlay */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <motion.h1 
                className="text-[8vw] md:text-[14vw] font-bold text-white/20 drop-shadow-lg absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                Unguided Tours
              </motion.h1>
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <DotLoader
                  frames={loaderFrames}
                  dotClassName="bg-white/15 [&.dot-loader-active]:bg-white size-1.5 transition-all duration-200"
                  duration={200}
                  className="scale-150 gap-0.5"
                  isPlaying={!loaderComplete}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 