"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface AppPreloaderProps {
  children: React.ReactNode
  loadingDuration?: number
}

export function AppPreloader({ 
  children, 
  loadingDuration = 2500 
}: AppPreloaderProps) {
  const [showLoader, setShowLoader] = useState(true)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we've already loaded in this session
    const hasLoadedBefore = sessionStorage.getItem('urbe-village-loaded')
    
    if (hasLoadedBefore) {
      setShowLoader(false)
      setHasLoaded(true)
      // Navigate to menu if already loaded
      router.push('/')
      return
    }

    // First time loading
    const timer = setTimeout(() => {
      setLoaderComplete(true)
      // Wait for the fade out animation to complete
      setTimeout(() => {
        setShowLoader(false)
        setHasLoaded(true)
        // Mark as loaded in session storage
        sessionStorage.setItem('urbe-village-loaded', 'true')
        // Navigate to menu page
        router.push('/')
      }, 500)
    }, loadingDuration)

    return () => clearTimeout(timer)
  }, [loadingDuration, router])

  // Don't render anything until we've determined the loading state
  if (!hasLoaded && !showLoader) {
    return null
  }

  return (
    <div className="relative min-h-screen">
      {/* Background with blur animation */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background1.png)' }}
        animate={{
          filter: showLoader ? 'blur(20px)' : 'blur(0px)'
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut"
        }}
      />
      
      {/* Only show children if not loading */}
      {!showLoader && (
        <div className="relative z-10">
          {children}
        </div>
      )}

      {/* Preloader Overlay */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-32 h-32 md:w-40 md:h-40"
            >
              <img
                src="/images/urbe_logo.jpg"
                alt="Urbe Village"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 