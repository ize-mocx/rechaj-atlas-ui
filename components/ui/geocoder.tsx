"use client"

import { useEffect, useRef } from "react"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

import { cn } from "@/lib/utils"

interface GeocoderResult {
  longitude: number
  latitude: number
  placeName: string
  address?: string
}

interface GeocoderProps {
  onResult: (result: GeocoderResult) => void
  placeholder?: string
  className?: string
  countries?: string
  language?: string
}

function Geocoder({
  onResult,
  placeholder = "Search address...",
  className,
  countries = "ng",
  language = "en",
}: GeocoderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const geocoderRef = useRef<MapboxGeocoder | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN")
      return
    }

    const geocoder = new MapboxGeocoder({
      accessToken: token,
      placeholder,
      countries,
      language,
    })

    geocoder.addTo(containerRef.current)

    geocoder.on("result", (e: { result: MapboxGeocoder.Result }) => {
      const { result } = e
      onResult({
        longitude: result.center[0],
        latitude: result.center[1],
        placeName: result.place_name,
        address: result.address,
      })
    })

    geocoderRef.current = geocoder

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      geocoderRef.current = null
    }
    // Only initialize once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className={cn(className)} />
}

export { Geocoder }
export type { GeocoderResult }
