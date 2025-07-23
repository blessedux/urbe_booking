"use client"

import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

interface Landmark {
  name: string
  coordinates: [number, number]
  description: string
  glow: string
}

const landmarks: Landmark[] = [
  {
    name: "Colosseum",
    coordinates: [12.4924, 41.8902],
    description: "Ancient amphitheater, symbol of Imperial Rome",
    glow: "#ff6b6b",
  },
  {
    name: "Vatican City",
    coordinates: [12.4534, 41.9029],
    description: "Smallest independent state, home to St. Peter's Basilica",
    glow: "#4ecdc4",
  },
  {
    name: "Trevi Fountain",
    coordinates: [12.4833, 41.9009],
    description: "Baroque fountain, famous for coin tossing tradition",
    glow: "#45b7d1",
  },
  {
    name: "Pantheon",
    coordinates: [12.4769, 41.8986],
    description: "Ancient Roman temple, architectural marvel",
    glow: "#96ceb4",
  },
  {
    name: "Roman Forum",
    coordinates: [12.4853, 41.8925],
    description: "Ancient plaza, center of Roman public life",
    glow: "#feca57",
  },
]

interface RomeMapProps {
  className?: string
}

export default function RomeMap({ className = "" }: RomeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null)
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [forceShowTimeout, setForceShowTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Set a timeout to force show the map after 5 seconds
    const timeout = setTimeout(() => {
      setMapLoaded(true)
    }, 5000)
    setForceShowTimeout(timeout)

    try {
      // Use the custom BlessedUX style with isometric view
      const customStyle = "mapbox://styles/blessedux/cmdfjjmsw02td01s433ja1qwk"
      
      if (!mapContainer.current) {
        throw new Error("Map container is not available")
      }
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: customStyle,
        center: [12.4964, 41.9028], // Rome center
        zoom: 13,
        pitch: 45, // Isometric angle
        bearing: -17.6, // Slight rotation for better perspective
        antialias: true,
        maxZoom: 18,
        minZoom: 10,
        failIfMajorPerformanceCaveat: false,
      })

      map.current.on("load", () => {
        try {
          // Add 3D terrain and buildings for isometric Rome experience
          
          // Add terrain source
          map.current!.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          })

          // Add 3D terrain
          map.current!.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 })

          // Add sky layer for atmosphere
          map.current!.addLayer({
            id: "sky",
            type: "sky",
            paint: {
              "sky-type": "atmosphere",
              "sky-atmosphere-sun": [0.0, 0.0],
              "sky-atmosphere-sun-intensity": 15,
            },
          })

          // Add 3D buildings with cyberpunk glow
          map.current!.addLayer({
            id: "add-3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 12,
            paint: {
              "fill-extrusion-color": ["case", ["boolean", ["feature-state", "hover"], false], "#00ffff", "#1a1a2e"],
              "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 12, 0, 12.05, ["get", "height"]],
              "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 12, 0, 12.05, ["get", "min_height"]],
              "fill-extrusion-opacity": 0.8,
              "fill-extrusion-ambient-occlusion-intensity": 0.3,
              "fill-extrusion-ambient-occlusion-radius": 3,
            },
          })
          
          // Add landmarks with custom markers
          landmarks.forEach((landmark) => {
            // Create custom marker element
            const markerEl = document.createElement("div")
            markerEl.className = "landmark-marker"
            markerEl.style.cssText = `
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${landmark.glow};
              border: 2px solid rgba(255, 255, 255, 0.8);
              box-shadow: 0 0 20px ${landmark.glow}, 0 0 40px ${landmark.glow}40;
              cursor: pointer;
              animation: pulse 2s infinite;
            `

            // Add pulsing animation
            const style = document.createElement("style")
            style.textContent = `
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
              }
            `
            document.head.appendChild(style)

            new mapboxgl.Marker(markerEl).setLngLat(landmark.coordinates).addTo(map.current!)

            markerEl.addEventListener("click", () => {
              setSelectedLandmark(landmark)
              map.current?.flyTo({
                center: landmark.coordinates,
                zoom: 16,
                pitch: 60,
                duration: 2000,
              })
            })
          })

          // Add navigation controls
          map.current!.addControl(new mapboxgl.NavigationControl(), "top-right")

          setMapLoaded(true)
          if (forceShowTimeout) clearTimeout(forceShowTimeout)
        } catch (error) {
          console.error("Error setting up map features:", error)
          setMapLoaded(true) // Still show map even if features fail
        }
      })

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapLoaded(true) // Show map even on error
      })

    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoaded(true) // Show map even on error
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      if (loadingTimeout) clearTimeout(loadingTimeout)
      if (forceShowTimeout) clearTimeout(forceShowTimeout)
    }
  }, [loadingTimeout, forceShowTimeout])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Preloader */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            {/* Pong Dot Loader */}
            <div className="flex space-x-2 mb-6">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            
            {/* Faded Background Title */}
            <div className="relative">
              <div className="text-4xl font-bold text-white/20 tracking-wider mb-2 transition-all duration-500 hover:text-white/40">
                UNGUIDED TOURS
              </div>
              <div className="text-sm text-cyan-400/60 font-mono">
                <div className="text-xs opacity-70">ROME.NEURAL</div>
                <div className="text-xs opacity-70">ISOMETRIC MESH</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ opacity: mapLoaded ? 1 : 0, transition: "opacity 1s ease-in-out" }}
      />

      {/* Landmark Info Panel */}
      {selectedLandmark && (
        <div className="absolute top-6 left-6 z-20 bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-cyan-500/30 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{selectedLandmark.name}</h3>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-300">{selectedLandmark.description}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2 border border-cyan-500/30">
          <p className="text-xs text-cyan-400 font-mono">DRAG TO EXPLORE • CLICK MARKERS • ISOMETRIC ROME ACTIVE</p>
        </div>
      </div>
    </div>
  )
} 