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
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

    console.log('🔍 PWA Debug: useEffect triggered', { 
      pathname, 
      isMobile, 
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches
    })
    
    // More strict mobile detection for PWA
    const isStrictMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      const isTouchOnly = 'ontouchstart' in window && !('onmousemove' in window)
      
      // Only consider it mobile if it's a mobile user agent AND small screen
      const strictMobile = isMobileUA && isSmallScreen
      
      console.log('🔍 PWA Strict Mobile Detection:', {
        userAgent: navigator.userAgent,
        isMobileUA,
        screenWidth: window.innerWidth,
        isSmallScreen,
        isTouchOnly,
        strictMobile
      })
      
      return strictMobile
    }
    
    // Check if user has previously dismissed the prompt
    const previouslyDismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (previouslyDismissed) {
      setHasBeenDismissed(true)
      console.log('🔍 PWA Debug: User previously dismissed PWA prompt')
      return
    }
    
    // Only proceed if it's actually a mobile device
    if (!isStrictMobile()) {
      console.log('🔍 PWA Debug: Not a mobile device, not showing PWA prompt')
      return
    }
    
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

    // If already dismissed, don't show prompt
    if (hasBeenDismissed) {
      console.log('🔍 PWA Debug: Prompt already dismissed')
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
      // For iOS, try to use Web Share API to open share sheet
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Urbe Village',
            text: 'Add Urbe Village to your home screen for quick access',
            url: window.location.href
          })
          console.log('Share successful')
          setShowInstallPrompt(false)
        } catch (error) {
          console.log('Share failed or was cancelled:', error)
          // Fallback to visual guide if share fails
          setShowIOSGuide(true)
          setShowInstallPrompt(false)
        }
      } else {
        // Fallback to visual guide if Web Share API is not supported
        setShowIOSGuide(true)
        setShowInstallPrompt(false)
      }
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
    setHasBeenDismissed(true)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
    console.log('🔍 PWA Debug: Prompt dismissed, will not show again this session')
  }

  const handleCloseIOSGuide = () => {
    setShowIOSGuide(false)
  }

  // Debug function to reset dismissed state (for testing)
  const resetDismissedState = () => {
    localStorage.removeItem('pwa-prompt-dismissed')
    setHasBeenDismissed(false)
    console.log('🔍 PWA Debug: Dismissed state reset for testing')
  }

  // Expose reset function globally for testing
  if (typeof window !== 'undefined') {
    (window as any).resetPWAPrompt = resetDismissedState
  }

  // Only show on mobile, menu page and when conditions are met
  const isStrictMobile = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false
    }
    
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
    const isSmallScreen = window.innerWidth <= 768
    return isMobileUA && isSmallScreen
  }
  
  console.log('🔍 PWA Debug: Render check', { 
    isMobile, 
    isStrictMobile: isStrictMobile(),
    pathname, 
    isInstalled, 
    showInstallPrompt,
    hasBeenDismissed,
    deferredPrompt: !!deferredPrompt,
    isIOS,
    isStandalone
  })
  
  if (!isStrictMobile() || pathname !== '/' || isInstalled || !showInstallPrompt || hasBeenDismissed) {
    console.log('🔍 PWA Debug: Not showing toast', { 
      notMobile: !isStrictMobile(), 
      notMenuPage: pathname !== '/', 
      alreadyInstalled: isInstalled, 
      noPrompt: !showInstallPrompt,
      dismissed: hasBeenDismissed
    })
    return null
  }
  
  console.log('🔍 PWA Debug: Showing toast!')

  return (
    <>
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
                    ? "Tap to open share menu and add to home screen"
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
                      Share & Install
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

      {/* iOS Installation Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseIOSGuide}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-red-600" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Add to Home Screen
                </h3>
                
                <p className="text-sm text-gray-600 mb-6">
                  Follow these steps to install Urbe Village on your iPhone:
                </p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tap the Share button</p>
                      <p className="text-xs text-gray-500">Look for the square with arrow up icon</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Scroll and tap "Add to Home Screen"</p>
                      <p className="text-xs text-gray-500">It's in the bottom row of the share menu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tap "Add" to confirm</p>
                      <p className="text-xs text-gray-500">The app will appear on your home screen</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleCloseIOSGuide}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 