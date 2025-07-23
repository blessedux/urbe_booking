"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DotLoader } from '@/components/ui/dot-loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Users, Star, Camera, Heart, Share2 } from 'lucide-react'
import { Preloader } from '@/components/preloader'
import { PageTransition } from '@/components/page-transition'
import { MobileSwipeNavigation } from '@/components/mobile-swipe-navigation'

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

// Mock tour data
const tours = [
  {
    id: 1,
    name: "Ancient Rome Discovery",
    description: "Explore the iconic Colosseum, Roman Forum, and Palatine Hill with expert guides",
    duration: "3 hours",
    groupSize: "Max 15 people",
    price: "€45",
    rating: 4.8,
    reviews: 127,
    image: "/images/colosseum.jpg",
    highlights: ["Colosseum", "Roman Forum", "Palatine Hill", "Expert Guide"],
    category: "Historical",
    difficulty: "Easy",
    language: "English"
  },
  {
    id: 2,
    name: "Vatican City & Museums",
    description: "Skip the line access to Vatican Museums, Sistine Chapel, and St. Peter's Basilica",
    duration: "4 hours",
    groupSize: "Max 20 people",
    price: "€65",
    rating: 4.9,
    reviews: 203,
    image: "/images/vatican.jpg",
    highlights: ["Vatican Museums", "Sistine Chapel", "St. Peter's Basilica", "Skip-the-line"],
    category: "Cultural",
    difficulty: "Easy",
    language: "English"
  },
  {
    id: 3,
    name: "Hidden Gems of Trastevere",
    description: "Discover the authentic side of Rome in the charming Trastevere neighborhood",
    duration: "2.5 hours",
    groupSize: "Max 12 people",
    price: "€35",
    rating: 4.7,
    reviews: 89,
    image: "/images/trastevere.jpg",
    highlights: ["Local Food", "Hidden Churches", "Authentic Atmosphere", "Local Guide"],
    category: "Food & Culture",
    difficulty: "Easy",
    language: "English"
  },
  {
    id: 4,
    name: "Rome by Night",
    description: "Experience the magic of Rome illuminated at night with a romantic evening tour",
    duration: "2 hours",
    groupSize: "Max 10 people",
    price: "€40",
    rating: 4.6,
    reviews: 156,
    image: "/images/rome-night.jpg",
    highlights: ["Trevi Fountain", "Piazza Navona", "Pantheon", "Evening Views"],
    category: "Evening",
    difficulty: "Easy",
    language: "English"
  },
  {
    id: 5,
    name: "Catacombs & Underground Rome",
    description: "Explore the mysterious underground world of ancient Rome's catacombs",
    duration: "3.5 hours",
    groupSize: "Max 18 people",
    price: "€55",
    rating: 4.5,
    reviews: 94,
    image: "/images/catacombs.jpg",
    highlights: ["Catacombs", "Underground Tunnels", "Ancient History", "Expert Guide"],
    category: "Historical",
    difficulty: "Moderate",
    language: "English"
  },
  {
    id: 6,
    name: "Art & Architecture Walk",
    description: "Discover Rome's most beautiful churches, palaces, and artistic masterpieces",
    duration: "3 hours",
    groupSize: "Max 15 people",
    price: "€50",
    rating: 4.7,
    reviews: 112,
    image: "/images/art-architecture.jpg",
    highlights: ["Baroque Churches", "Renaissance Art", "Architecture", "Art History"],
    category: "Art & Architecture",
    difficulty: "Easy",
    language: "English"
  }
]

export default function CityToursPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState<number[]>([])
  const [showUnguidedTour, setShowUnguidedTour] = useState(false)

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  const categories = [
    { id: 'all', name: 'All Tours' },
    { id: 'Historical', name: 'Historical' },
    { id: 'Cultural', name: 'Cultural' },
    { id: 'Food & Culture', name: 'Food & Culture' },
    { id: 'Evening', name: 'Evening' },
    { id: 'Art & Architecture', name: 'Art & Architecture' }
  ]

  const filteredTours = selectedCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory)

  const toggleFavorite = (tourId: number) => {
    setFavorites(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Discover Rome</h1>
            <p className="text-xl text-gray-600">Loading amazing tours for you...</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <DotLoader
              frames={loaderFrames}
              dotClassName="bg-red-500/15 [&.dot-loader-active]:bg-red-500 size-1.5 transition-all duration-200"
              duration={200}
              className="scale-150 gap-0.5"
            />
            <p className="text-sm text-gray-500">Preparing your adventure</p>
          </div>
        </div>
      </div>
    )
  }

  // If showing unguided tour, render with preloader
  if (showUnguidedTour) {
    return (
      <Preloader 
        isLoading={true} 
        onLoadingComplete={() => {
          // Navigate to unguided tour page
          window.location.href = '/unguided-tour'
        }}
        loadingDuration={2000}
      >
        <div className="min-h-screen">
          <Header />
          <div className="pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
              {/* Dummy content that will be blurred */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">City Tours</h1>
              </div>
            </div>
          </div>
        </div>
      </Preloader>
    )
  }

  return (
    <MobileSwipeNavigation>
      <PageTransition>
        <Header />
        
        <div className="pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Rome
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Experience the Eternal City through our carefully curated guided tours. 
                From ancient wonders to hidden gems, let our expert guides show you the real Rome.
              </p>
              
              {/* Unguided Tour CTA */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
                <h2 className="text-2xl font-bold mb-4">Want to Explore on Your Own?</h2>
                <p className="text-lg mb-6 opacity-90">
                  Discover Rome at your own pace with our interactive unguided tour experience.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-red-600 hover:bg-gray-100"
                  onClick={() => setShowUnguidedTour(true)}
                >
                  Start Unguided Tour
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Tours Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-red-400" />
                    </div>
                    
                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(tour.id)}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(tour.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>

                    {/* Share Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-12 bg-white/80 hover:bg-white"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </Button>

                    {/* Category Badge */}
                    <Badge className="absolute bottom-2 left-2 bg-red-500 text-white">
                      {tour.category}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl group-hover:text-red-600 transition-colors">
                        {tour.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{tour.price}</div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tour.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tour Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{tour.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{tour.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{tour.rating} ({tour.reviews})</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Highlights:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tour.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">
                        Book Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredTours.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
                <p className="text-gray-600 mb-4">Try selecting a different category</p>
                <Button onClick={() => setSelectedCategory('all')}>
                  View All Tours
                </Button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </PageTransition>
    </MobileSwipeNavigation>
  )
} 