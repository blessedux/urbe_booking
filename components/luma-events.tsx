"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Gift, Smartphone, Trophy } from "lucide-react"

export function UnguidedCityTour() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unguided City Tour
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Rome at your own pace and collect exclusive POAPs along the way
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* How It Works */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Visit Spots</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Discover hidden gems and iconic locations throughout Rome. Each spot offers a unique POAP to collect.
              </p>
            </CardContent>
          </Card>

          {/* Collect POAPs */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Collect POAPs</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Use your smartphone to scan NFC stickers at each location and collect digital proof of attendance tokens.
              </p>
            </CardContent>
          </Card>

          {/* Get Rewards */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Collect all POAPs and receive exclusive rewards at ETH Rome. Complete the tour for special recognition.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-red-50 to-purple-50 border-red-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    POAP Collection at Events
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Don't miss out on POAPs during the conference! Tap your phone on NFC stickers at various IRL events to collect additional tokens.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-red-600" />
                      <span>Exclusive event POAPs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                      <span>Easy NFC tap collection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span>Special rewards for completion</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Start?
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Begin your journey through Rome and start collecting POAPs today!
                    </p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Start Tour
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 