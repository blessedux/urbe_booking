"use client"

import { Header } from '@/components/header'
import { Component as FlipLinks } from '@/components/ui/flip-links'
import { motion } from 'framer-motion'

export default function MenuPage() {
  return (
    <motion.div 
      className="relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background1.png)' }}
      />
      
      <Header />
      
      {/* Menu Content */}
      <div className="relative z-10 min-h-screen">
        <FlipLinks />
      </div>
    </motion.div>
  )
} 