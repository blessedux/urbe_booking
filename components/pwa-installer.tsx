"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

export function PWAInstaller() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    console.log('🔍 PWA Debug: useEffect triggered', { 
      pathname, 
      isMobile, 
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches
    })
    
    // Only show on menu page
    if (pathname !== '/menu') {
      console.log('🔍 PWA Debug: Not on menu page, returning')
      return
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('🔍 PWA Debug: App already installed')
      setIsInstalled(true)
      return
    }
    
    console.log('🔍 PWA Debug: Setting up event listeners')

    // Check PWA installation criteria
    const checkPWACriteria = () => {
      console.log('🔍 PWA Debug: Checking installation criteria...')
      
      // Check if service worker is registered
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log('🔍 PWA Debug: Service worker registrations:', registrations.length)
        })
      }
      
      // Check if manifest is accessible
      fetch('/manifest.json')
        .then(response => {
          console.log('🔍 PWA Debug: Manifest accessible:', response.ok)
          return response.json()
        })
        .then(manifest => {
          console.log('🔍 PWA Debug: Manifest content:', {
            name: manifest.name,
            short_name: manifest.short_name,
            icons: manifest.icons?.length || 0
          })
        })
        .catch(error => {
          console.log('🔍 PWA Debug: Manifest error:', error)
        })
    }
    
    checkPWACriteria()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🔍 PWA Debug: beforeinstallprompt event received!', e)
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [pathname])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  // Only show on mobile, menu page and when conditions are met
  console.log('🔍 PWA Debug: Render check', { 
    isMobile, 
    pathname, 
    isInstalled, 
    showInstallPrompt,
    deferredPrompt: !!deferredPrompt
  })
  
  if (!isMobile || pathname !== '/menu' || isInstalled || !showInstallPrompt) {
    console.log('🔍 PWA Debug: Not showing toast', { 
      notMobile: !isMobile, 
      notMenuPage: pathname !== '/menu', 
      alreadyInstalled: isInstalled, 
      noPrompt: !showInstallPrompt 
    })
    return null
  }
  
  console.log('🔍 PWA Debug: Showing toast!')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-4 relative">
          {/* Close button positioned on the right edge */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <div className="flex-shrink-0">
              <img 
                src="/icons/icon-72x72.png" 
                alt="Urbe Village" 
                className="w-12 h-12 rounded-lg"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Install Urbe Village
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Add to home screen for quick access and offline use
              </p>
              
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 