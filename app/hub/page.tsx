"use client"

import { Header } from '@/components/header'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'
import { motion } from 'framer-motion'
import { ExternalLink, MapPin, Globe } from 'lucide-react'

export default function HubPage() {
  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        <div className="relative z-10 min-h-screen pt-20 pb-10">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Urbe Hub
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Your co-working space in the heart of Rome
            </p>
          </motion.div>

          {/* Location Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto px-4 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl md:text-3xl font-semibold text-white">Location</h2>
              </div>
              <p className="text-white/90 text-lg mb-4">
                Via del Corso, 123<br />
                00186 Roma RM, Italy
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://maps.google.com/maps?q=Urbe+Hub&z=17&t=m&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="https://urbevillage.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto px-4 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center">
                Find Us
              </h3>
              <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-lg mb-2">Urbe Hub</p>
                    <p className="text-sm text-white/70 mb-4">Rome, Italy</p>
                    <a 
                      href="https://maps.google.com/maps?q=Urbe+Hub,Rome,Italy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in Google Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Website Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl md:text-3xl font-semibold text-white">Visit Our Website</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="text-white/90 text-lg mb-4">
                    Discover more about Urbe Village, our services, and the vibrant community we're building in Rome.
                  </p>
                  <a 
                    href="https://urbevillage.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-medium"
                  >
                    Explore Website
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                <div className="relative">
                  <div className="bg-white/20 rounded-xl p-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Globe className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">urbevillage.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 