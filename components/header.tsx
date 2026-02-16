"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  IconBell,
  IconLogout,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { riders } from "@/lib/riders"

interface SearchItem {
  id: string
  name: string
  type: "station" | "rider"
  longitude: number
  latitude: number
}

const stations: SearchItem[] = [
  { id: "ret-1", name: "Retrofit Station — Surulere", type: "station", longitude: 3.3500, latitude: 6.4920 },
  { id: "ret-2", name: "Retrofit Station — Ikeja", type: "station", longitude: 3.3758, latitude: 6.5985 },
  { id: "ret-3", name: "Retrofit Station — Ikorodu", type: "station", longitude: 3.5145, latitude: 6.5892 },
  { id: "ret-4", name: "Retrofit Station — Sango Ota", type: "station", longitude: 3.2015, latitude: 6.6823 },
  { id: "ret-5", name: "Retrofit Station — Mowe", type: "station", longitude: 3.3725, latitude: 6.8432 },
  { id: "swp-1", name: "Swap Station — Ebute Metta", type: "station", longitude: 3.3790, latitude: 6.4900 },
  { id: "swp-2", name: "Swap Station — Maryland", type: "station", longitude: 3.3625, latitude: 6.5124 },
  { id: "swp-3", name: "Swap Station — Lekki Phase 1", type: "station", longitude: 3.4580, latitude: 6.4340 },
  { id: "swp-4", name: "Swap Station — Festac", type: "station", longitude: 3.2830, latitude: 6.4670 },
  { id: "swp-5", name: "Swap Station — Egbeda", type: "station", longitude: 3.2925, latitude: 6.5852 },
  { id: "swp-6", name: "Swap Station — Ikorodu Town", type: "station", longitude: 3.5080, latitude: 6.6150 },
  { id: "swp-7", name: "Swap Station — Ota", type: "station", longitude: 3.2125, latitude: 6.6512 },
  { id: "swp-8", name: "Swap Station — RCCG Camp", type: "station", longitude: 3.3912, latitude: 6.7585 },
  { id: "chg-1", name: "Charge Station — Sabo Yaba", type: "station", longitude: 3.3860, latitude: 6.5050 },
  { id: "chg-2", name: "Charge Station — Ikeja Along", type: "station", longitude: 3.3412, latitude: 6.5215 },
  { id: "chg-3", name: "Charge Station — Ikoyi", type: "station", longitude: 3.4330, latitude: 6.4520 },
  { id: "chg-4", name: "Charge Station — Amuwo Odofin", type: "station", longitude: 3.2920, latitude: 6.4680 },
  { id: "chg-5", name: "Charge Station — Command", type: "station", longitude: 3.2685, latitude: 6.6185 },
  { id: "chg-6", name: "Charge Station — Ijede", type: "station", longitude: 3.5185, latitude: 6.5612 },
  { id: "chg-7", name: "Charge Station — Atan Ota", type: "station", longitude: 3.2085, latitude: 6.6285 },
  { id: "chg-8", name: "Charge Station — Warewa", type: "station", longitude: 3.3485, latitude: 6.7785 },
  { id: "chg-9", name: "Charge Station — Loburo", type: "station", longitude: 3.4085, latitude: 6.8285 },
  { id: "chg-10", name: "Charge Station — Ilupeju Ind", type: "station", longitude: 3.3550, latitude: 6.5530 },
  { id: "dep-1", name: "Depot — Surulere Central", type: "station", longitude: 3.3412, latitude: 6.4912 },
  { id: "dep-2", name: "Depot — Ikeja GRA", type: "station", longitude: 3.3785, latitude: 6.5512 },
  { id: "dep-3", name: "Depot — Mile 2 Hub", type: "station", longitude: 3.3170, latitude: 6.4540 },
  { id: "dep-4", name: "Depot — Lekki Depot", type: "station", longitude: 3.4580, latitude: 6.4400 },
  { id: "dep-5", name: "Depot — Ikorodu Depot", type: "station", longitude: 3.5312, latitude: 6.5412 },
  { id: "dep-6", name: "Depot — Iyana Ipaja Hub", type: "station", longitude: 3.2285, latitude: 6.6185 },
  { id: "dep-7", name: "Depot — Mowe Depot", type: "station", longitude: 3.3412, latitude: 6.7685 },
  { id: "dep-8", name: "Depot — Ota Depot", type: "station", longitude: 3.2185, latitude: 6.6985 },
  { id: "prd-1", name: "Production Facility — Agbara Industrial", type: "station", longitude: 3.2912, latitude: 6.6785 },
  { id: "prd-2", name: "Production Facility — Sagamu Industrial Zone", type: "station", longitude: 3.3585, latitude: 6.8585 },
  { id: "prd-3", name: "Production Facility — Ojota Manufacturing", type: "station", longitude: 3.4185, latitude: 6.6012 },
]

const riderSearchItems: SearchItem[] = riders.map((r) => ({
  id: r.id,
  name: r.name,
  type: "rider",
  longitude: r.longitude,
  latitude: r.latitude,
}))

function Header() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const lowerQuery = query.toLowerCase().trim()

  const filteredStations = lowerQuery
    ? stations.filter((s) => s.name.toLowerCase().includes(lowerQuery))
    : []

  const filteredRiders = lowerQuery
    ? riderSearchItems.filter((r) => r.name.toLowerCase().includes(lowerQuery))
    : []

  const hasResults = filteredStations.length > 0 || filteredRiders.length > 0

  const handleSelect = useCallback((item: SearchItem) => {
    window.dispatchEvent(
      new CustomEvent("search-navigate", {
        detail: {
          id: item.id,
          type: item.type,
          longitude: item.longitude,
          latitude: item.latitude,
        },
      })
    )
    setQuery("")
    setOpen(false)
    inputRef.current?.blur()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Rechaj Atlas" className="w-20" />
        <Badge className="text-sm font-medium">Atlas</Badge>
      </div>

      <div ref={containerRef} className="relative">
        <div className="flex items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1">
          <IconSearch className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => { if (query.trim()) setOpen(true) }}
            placeholder="Search stations & riders..."
            className="w-[240px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {open && hasResults && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredStations.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Stations
                  </div>
                  {filteredStations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
              {filteredRiders.length > 0 && (
                <div>
                  {filteredStations.length > 0 && (
                    <div className="mx-1 my-1 h-px bg-border" />
                  )}
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Riders
                  </div>
                  {filteredRiders.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Live
          </span>
        </div>
        <Separator orientation="vertical" className="h-10" />
        <button className="relative inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <IconBell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <Separator orientation="vertical" className="h-10" />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-accent">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              AO
            </div>
            <span className="text-sm font-medium">Admin</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconUser className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconSettings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <IconLogout className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { Header };
