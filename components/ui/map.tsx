"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Rider } from "@/lib/riders";

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  color?: string;
  popup?: string;
}

export interface MapHandle {
  resize: () => void;
  getMap: () => mapboxgl.Map | null;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  riders?: Rider[];
  className?: string;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onRiderClick?: (rider: Rider) => void;
}

function MarkerPopup({ marker }: { marker: MapMarker }) {
  const parts = marker.popup?.split(" — ") || [];
  const type = parts[0] || "Location";
  const name = parts[1] || marker.id;

  return (
    <Card size="sm" className="w-56 border-none shadow-none">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <span
            className="inline-block size-3 shrink-0 rounded-full"
            style={{ backgroundColor: marker.color }}
          />
          <CardTitle className="text-xs">{type}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{name}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{marker.longitude.toFixed(4)}, {marker.latitude.toFixed(4)}</span>
        </div>
        <Badge variant="outline" className="w-fit">Active</Badge>
      </CardContent>
    </Card>
  );
}

const statusLabels: Record<Rider["status"], string> = {
  "en-route": "En Route",
  idle: "Idle",
  charging: "Charging",
  inactive: "Inactive",
  "technical-issue": "Technical Issue",
};

const statusVariants: Record<Rider["status"], "default" | "secondary" | "outline" | "destructive"> = {
  "en-route": "default",
  idle: "secondary",
  charging: "outline",
  inactive: "secondary",
  "technical-issue": "destructive",
};

function RiderPopup({ rider }: { rider: Rider }) {
  return (
    <Card size="sm" className="w-56 border-none shadow-none">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <span className="inline-block size-3 shrink-0 rounded-full bg-[#3498db]" />
          <CardTitle className="text-xs">Rider</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{rider.name}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{rider.longitude.toFixed(4)}, {rider.latitude.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[rider.status]} className="w-fit">
            {statusLabels[rider.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {rider.routeHistory.length} stops
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

const Map = forwardRef<MapHandle, MapProps>(function Map({
  center = [3.3792, 6.5244],
  zoom = 10,
  markers = [],
  riders = [],
  className,
  onMapClick,
  onMarkerClick,
  onRiderClick,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const riderMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    resize: () => mapRef.current?.resize(),
    getMap: () => mapRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => setIsLoaded(true));

    if (onMapClick) {
      map.on("click", (e) => {
        onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
    // Only initialize once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync station markers
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const el = document.createElement("div");
      const color = markerData.color || "#3b82f6";
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(<MarkerPopup marker={markerData} />);

      const popup = new mapboxgl.Popup({
        offset: 12,
        closeButton: true,
        closeOnClick: true,
        maxWidth: "none",
        className: "map-custom-popup",
      }).setDOMContent(popupNode);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([markerData.longitude, markerData.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      if (onMarkerClick) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerClick(markerData);
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded, onMarkerClick]);

  // Sync rider markers
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    riderMarkersRef.current.forEach((m) => m.remove());
    riderMarkersRef.current = [];

    riders.forEach((rider) => {
      const el = document.createElement("div");
      el.className = "rider-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      const color =
        rider.status === "inactive"
          ? "#9ca3af"
          : rider.status === "technical-issue"
            ? "#ef4444"
            : "#3498db";
      el.style.backgroundColor = color;
      el.style.border = "3px solid white";
      el.style.boxShadow = `0 0 0 2px ${color}, 0 2px 6px rgba(0,0,0,0.3)`;
      el.style.cursor = "pointer";

      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(<RiderPopup rider={rider} />);

      const popup = new mapboxgl.Popup({
        offset: 14,
        closeButton: true,
        closeOnClick: true,
        maxWidth: "none",
        className: "map-custom-popup",
      }).setDOMContent(popupNode);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([rider.longitude, rider.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onRiderClick?.(rider);
      });

      riderMarkersRef.current.push(marker);
    });
  }, [riders, isLoaded, onRiderClick]);

  return <div ref={containerRef} className={cn("h-96 w-full", className)} />;
});

export { Map };
