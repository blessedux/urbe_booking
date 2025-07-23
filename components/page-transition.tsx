"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={`min-h-screen relative ${className}`}
      initial={{ 
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95
      }}
      animate={{ 
        opacity: 1,
        filter: "blur(0px)",
        scale: 1
      }}
      exit={{ 
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth blur transition
        opacity: { duration: 0.4 },
        filter: { duration: 0.5 },
        scale: { duration: 0.4 }
      }}
    >
      {children}
    </motion.div>
  )
} 