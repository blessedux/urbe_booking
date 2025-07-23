import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return
      }

      // Check screen width
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      
      // Check user agent for mobile devices
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Consider it mobile if any of these conditions are true
      const mobile = isSmallScreen || isMobileUserAgent || hasTouchScreen
      
      console.log('🔍 Mobile Detection:', {
        screenWidth: window.innerWidth,
        isSmallScreen,
        isMobileUserAgent,
        hasTouchScreen,
        userAgent: navigator.userAgent,
        result: mobile
      })
      
      setIsMobile(mobile)
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        checkIsMobile()
      }
      
      mql.addEventListener("change", onChange)
      checkIsMobile()
      
      return () => mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
