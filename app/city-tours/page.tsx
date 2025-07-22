"use client"

import { UnguidedCityTour } from '@/components/luma-events'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function CityToursPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Explore Rome
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the Eternal City through our curated tours and collect exclusive POAPs along the way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Unguided Tour
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-300 transition-colors">
              View All Tours
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <UnguidedCityTour />
      </main>

      <Footer />
    </div>
  )
} 