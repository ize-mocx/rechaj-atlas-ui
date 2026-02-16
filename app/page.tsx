"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import { Map, type MapHandle, type MapMarker } from "@/components/ui/map"
import { SidebarPanel, type SelectedLocation } from "@/components/sidebar-panel"
import { riders, type Rider } from "@/lib/riders"

const ROUTE_SOURCE_ID = "rider-route"
const ROUTE_LAYER_ID = "rider-route-line"

const stationMarkers: MapMarker[] = [
  // Retrofit Stations (orange) — 5 total
  { id: "ret-1", longitude: 3.3500, latitude: 6.4920, color: "#e67e22", popup: "Retrofit Station — Surulere" },
  { id: "ret-2", longitude: 3.3758, latitude: 6.5985, color: "#e67e22", popup: "Retrofit Station — Ikeja" },
  { id: "ret-3", longitude: 3.5145, latitude: 6.5892, color: "#e67e22", popup: "Retrofit Station — Ikorodu" },
  { id: "ret-4", longitude: 3.2015, latitude: 6.6823, color: "#e67e22", popup: "Retrofit Station — Sango Ota" },
  { id: "ret-5", longitude: 3.3725, latitude: 6.8432, color: "#e67e22", popup: "Retrofit Station — Mowe" },

  // Swap Stations (blue) — 8 total
  { id: "swp-1", longitude: 3.3790, latitude: 6.4900, color: "#2980b9", popup: "Swap Station — Ebute Metta" },
  { id: "swp-2", longitude: 3.3625, latitude: 6.5124, color: "#2980b9", popup: "Swap Station — Maryland" },
  { id: "swp-3", longitude: 3.4580, latitude: 6.4340, color: "#2980b9", popup: "Swap Station — Lekki Phase 1" },
  { id: "swp-4", longitude: 3.2830, latitude: 6.4670, color: "#2980b9", popup: "Swap Station — Festac" },
  { id: "swp-5", longitude: 3.2925, latitude: 6.5852, color: "#2980b9", popup: "Swap Station — Egbeda" },
  { id: "swp-6", longitude: 3.5080, latitude: 6.6150, color: "#2980b9", popup: "Swap Station — Ikorodu Town" },
  { id: "swp-7", longitude: 3.2125, latitude: 6.6512, color: "#2980b9", popup: "Swap Station — Ota" },
  { id: "swp-8", longitude: 3.3912, latitude: 6.7585, color: "#2980b9", popup: "Swap Station — RCCG Camp" },

  // Charge Stations (green) — 10 total
  { id: "chg-1", longitude: 3.3860, latitude: 6.5050, color: "#27ae60", popup: "Charge Station — Sabo Yaba" },
  { id: "chg-2", longitude: 3.3412, latitude: 6.5215, color: "#27ae60", popup: "Charge Station — Ikeja Along" },
  { id: "chg-3", longitude: 3.4330, latitude: 6.4520, color: "#27ae60", popup: "Charge Station — Ikoyi" },
  { id: "chg-4", longitude: 3.2920, latitude: 6.4680, color: "#27ae60", popup: "Charge Station — Amuwo Odofin" },
  { id: "chg-5", longitude: 3.2685, latitude: 6.6185, color: "#27ae60", popup: "Charge Station — Command" },
  { id: "chg-6", longitude: 3.5185, latitude: 6.5612, color: "#27ae60", popup: "Charge Station — Ijede" },
  { id: "chg-7", longitude: 3.2085, latitude: 6.6285, color: "#27ae60", popup: "Charge Station — Atan Ota" },
  { id: "chg-8", longitude: 3.3485, latitude: 6.7785, color: "#27ae60", popup: "Charge Station — Warewa" },
  { id: "chg-9", longitude: 3.4085, latitude: 6.8285, color: "#27ae60", popup: "Charge Station — Loburo" },
  { id: "chg-10", longitude: 3.3550, latitude: 6.5530, color: "#27ae60", popup: "Charge Station — Ilupeju Ind" },

  // Depots (purple) — 8 total
  { id: "dep-1", longitude: 3.3412, latitude: 6.4912, color: "#8e44ad", popup: "Depot — Surulere Central" },
  { id: "dep-2", longitude: 3.3785, latitude: 6.5512, color: "#8e44ad", popup: "Depot — Ikeja GRA" },
  { id: "dep-3", longitude: 3.3170, latitude: 6.4540, color: "#8e44ad", popup: "Depot — Mile 2 Hub" },
  { id: "dep-4", longitude: 3.4580, latitude: 6.4400, color: "#8e44ad", popup: "Depot — Lekki Depot" },
  { id: "dep-5", longitude: 3.5312, latitude: 6.5412, color: "#8e44ad", popup: "Depot — Ikorodu Depot" },
  { id: "dep-6", longitude: 3.2285, latitude: 6.6185, color: "#8e44ad", popup: "Depot — Iyana Ipaja Hub" },
  { id: "dep-7", longitude: 3.3412, latitude: 6.7685, color: "#8e44ad", popup: "Depot — Mowe Depot" },
  { id: "dep-8", longitude: 3.2185, latitude: 6.6985, color: "#8e44ad", popup: "Depot — Ota Depot" },

  // Production Facilities (red) — 3 total
  { id: "prd-1", longitude: 3.2912, latitude: 6.6785, color: "#c0392b", popup: "Production Facility — Agbara Industrial" },
  { id: "prd-2", longitude: 3.3585, latitude: 6.8585, color: "#c0392b", popup: "Production Facility — Sagamu Industrial Zone" },
  { id: "prd-3", longitude: 3.4185, latitude: 6.6012, color: "#c0392b", popup: "Production Facility — Ojota Manufacturing" },
]

const legend = [
  { label: "Retrofit Station", color: "#e67e22" },
  { label: "Swap Station", color: "#2980b9" },
  { label: "Charge Station", color: "#27ae60" },
  { label: "Depot", color: "#8e44ad" },
  { label: "Production Facility", color: "#c0392b" },
  { label: "Rider (Active)", color: "#3498db" },
  { label: "Rider (Offline)", color: "#95a5a6" },
  { label: "Rider (Issue)", color: "#e74c3c" },
]

const stationManagers: Record<string, string> = {
  "ret-1": "Tunde Afolabi", "ret-2": "Ngozi Okafor", "ret-3": "Emeka Uche",
  "ret-4": "Yusuf Ibrahim", "ret-5": "Aisha Bello",
  "swp-1": "Kemi Adeyemi", "swp-2": "Chidi Nnadi", "swp-3": "Funke Olowu",
  "swp-4": "Bola Osei", "swp-5": "Olu Bankole", "swp-6": "Halima Musa",
  "swp-7": "Dayo Akintola", "swp-8": "Sade Ogundipe",
  "chg-1": "Ibrahim Lawal", "chg-2": "Amara Onyeka", "chg-3": "Tosin Balogun",
  "chg-4": "Uche Nwachukwu", "chg-5": "Rasheed Amoo", "chg-6": "Folake Odunsi",
  "chg-7": "Grace Ekpo", "chg-8": "Segun Fasasi", "chg-9": "Bukola Taiwo",
  "chg-10": "Maryam Garba",
  "dep-1": "Adewale Johnson", "dep-2": "Chioma Ibe", "dep-3": "Femi Oladipo",
  "dep-4": "Nkechi Azubuike", "dep-5": "Rotimi Salami", "dep-6": "Patience Okoro",
  "dep-7": "Wale Dosunmu", "dep-8": "Hadiza Suleiman",
  "prd-1": "Babatunde Makinde", "prd-2": "Obiageli Chukwu", "prd-3": "Lanre Shittu",
}

function clearRoute(map: mapboxgl.Map, waypointMarkers: mapboxgl.Marker[]) {
  if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
  if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
  waypointMarkers.forEach((m) => m.remove())
  waypointMarkers.length = 0
}

async function fetchAndDrawRoute(
  map: mapboxgl.Map,
  waypoints: [number, number][],
  waypointMarkers: mapboxgl.Marker[]
) {
  // Mapbox Directions API supports up to 25 waypoints
  const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";")
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`

  const res = await fetch(url)
  const data = await res.json()

  if (!data.routes?.[0]) {
    console.error("No route returned from Directions API")
    return
  }

  const geometry = data.routes[0].geometry

  // Add route line source + layer
  map.addSource(ROUTE_SOURCE_ID, {
    type: "geojson",
    data: { type: "Feature", properties: {}, geometry },
  })

  map.addLayer({
    id: ROUTE_LAYER_ID,
    type: "line",
    source: ROUTE_SOURCE_ID,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#e74c3c", "line-width": 4, "line-opacity": 0.8 },
  })

  // Add numbered waypoint markers
  waypoints.forEach(([lng, lat], i) => {
    const el = document.createElement("div")
    el.className = "route-waypoint-marker"
    el.textContent = String(i + 1)

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(map)

    waypointMarkers.push(marker)
  })
}

export default function Page() {
  const mapHandleRef = useRef<MapHandle>(null)
  const waypointMarkersRef = useRef<mapboxgl.Marker[]>([])
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    const map = mapHandleRef.current?.getMap()
    if (!map) return

    const parts = marker.popup?.split(" — ") || []
    const type = parts[0] || "Location"
    const name = parts[1] || marker.id

    setSelectedLocation({
      id: marker.id,
      name,
      type,
      latitude: marker.latitude,
      longitude: marker.longitude,
      manager: stationManagers[marker.id] || "Unassigned",
      color: marker.color || "#3b82f6",
    })

    map.flyTo({ center: [marker.longitude, marker.latitude], zoom: 14 })
  }, [])

  const handleRiderClick = useCallback((rider: Rider) => {
    const map = mapHandleRef.current?.getMap()
    if (!map) return

    const riderColor =
      rider.status === "technical-issue"
        ? "#e74c3c"
        : rider.status === "inactive"
          ? "#95a5a6"
          : "#3498db"

    setSelectedLocation({
      id: rider.id,
      name: rider.name,
      type: "Rider",
      latitude: rider.latitude,
      longitude: rider.longitude,
      manager: "N/A",
      color: riderColor,
    })

    map.flyTo({ center: [rider.longitude, rider.latitude], zoom: 14 })
    clearRoute(map, waypointMarkersRef.current)
    fetchAndDrawRoute(map, rider.routeHistory, waypointMarkersRef.current)
  }, [])

  const handleMapClick = useCallback(() => {
    const map = mapHandleRef.current?.getMap()
    if (!map) return

    setSelectedLocation(null)
    clearRoute(map, waypointMarkersRef.current)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedLocation(null)
  }, [])

  useEffect(() => {
    function onSearchNavigate(e: Event) {
      const { id, type } = (e as CustomEvent).detail
      if (type === "rider") {
        const rider = riders.find((r) => r.id === id)
        if (rider) handleRiderClick(rider)
      } else {
        const marker = stationMarkers.find((m) => m.id === id)
        if (marker) handleMarkerClick(marker)
      }
    }
    window.addEventListener("search-navigate", onSearchNavigate)
    return () => window.removeEventListener("search-navigate", onSearchNavigate)
  }, [handleMarkerClick, handleRiderClick])

  return (
    <div className="flex h-full w-full">
      <div className="relative min-w-0 flex-1">
        <Map
          ref={mapHandleRef}
          center={[3.35, 6.6]}
          zoom={9.5}
          markers={stationMarkers}
          riders={riders}
          onMarkerClick={handleMarkerClick}
          onRiderClick={handleRiderClick}
          onMapClick={handleMapClick}
          className="h-full w-full"
        />
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 bg-background/90 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="inline-block size-3 shrink-0 rounded-full border-2 border-white"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <SidebarPanel
        selectedLocation={selectedLocation}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
