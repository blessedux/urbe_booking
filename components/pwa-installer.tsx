"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Share2 } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

export function PWAInstaller() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    console.log('🔍 PWA Debug: useEffect triggered', { 
      pathname, 
      isMobile, 
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches
    })
    
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)
    
    // Check if already in standalone mode (installed)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches
      setIsStandalone(standalone)
      setIsInstalled(standalone)
      console.log('🔍 PWA Debug: Standalone check:', standalone)
    }
    
    checkStandalone()
    
    // Only show on homepage
    if (pathname !== '/') {
      console.log('🔍 PWA Debug: Not on homepage, returning')
      return
    }

    // If already installed, don't show prompt
    if (isStandalone) {
      console.log('🔍 PWA Debug: App already installed')
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

    // Listen for beforeinstallprompt event (Chrome/Android)
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

    // For iOS, show the prompt after a delay if not already installed
    const showIOSPrompt = () => {
      if (isIOSDevice && !isStandalone) {
        console.log('🔍 PWA Debug: Showing iOS prompt')
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    // For Android/Chrome, wait for beforeinstallprompt
    const showAndroidPrompt = () => {
      if (!isIOSDevice && !isStandalone) {
        console.log('🔍 PWA Debug: Waiting for beforeinstallprompt event')
      }
    }

    // For iOS, show prompt immediately if conditions are met
    if (isIOSDevice && !isStandalone) {
      console.log('🔍 PWA Debug: iOS device detected, showing prompt immediately')
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 2000) // Show after 2 seconds for immediate feedback
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // Listen for custom force show event
    const handleForceShow = () => {
      console.log('🔍 PWA Debug: Force show event received')
      setShowInstallPrompt(true)
    }
    window.addEventListener('forceShowPWAPrompt', handleForceShow)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          // Show appropriate prompt based on platform
          if (isIOSDevice) {
            showIOSPrompt()
          } else {
            showAndroidPrompt()
          }
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
          // Still show prompt even if service worker fails
          if (isIOSDevice) {
            showIOSPrompt()
          }
        })
    } else {
      // For iOS, show prompt even without service worker
      if (isIOSDevice) {
        showIOSPrompt()
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('forceShowPWAPrompt', handleForceShow)
    }
  }, [pathname, isIOS, isStandalone])

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show detailed instructions
      const instructions = [
        '📱 To install Urbe Village on your iPhone:',
        '',
        '1️⃣ Tap the Share button (square with arrow up)',
        '2️⃣ Scroll down and tap "Add to Home Screen"',
        '3️⃣ Tap "Add" to confirm',
        '',
        'The app will then appear on your home screen!'
      ].join('\n')
      
      alert(instructions)
      setShowInstallPrompt(false)
      return
    }

    if (!deferredPrompt) {
      console.log('🔍 PWA Debug: No deferred prompt available')
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.log('🔍 PWA Debug: Install prompt error:', error)
      setShowInstallPrompt(false)
    }
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
    deferredPrompt: !!deferredPrompt,
    isIOS,
    isStandalone
  })
  
  if (!isMobile || pathname !== '/' || isInstalled || !showInstallPrompt) {
    console.log('🔍 PWA Debug: Not showing toast', { 
      notMobile: !isMobile, 
      notMenuPage: pathname !== '/', 
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
                {isIOS 
                  ? "Add to home screen for quick access"
                  : "Add to home screen for quick access and offline use"
                }
              </p>
              
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                {isIOS ? (
                  <>
                    <Share2 className="w-3 h-3 mr-1" />
                    Install
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 