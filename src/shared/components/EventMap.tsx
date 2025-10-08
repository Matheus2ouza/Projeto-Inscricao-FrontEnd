// shared/components/EventMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface EventMapProps {
  lat: number;
  lng: number;
  height?: string;
  zoom?: number;
  markerTitle?: string;
}

const EventMap: React.FC<EventMapProps> = ({
  lat,
  lng,
  height = "400px",
  zoom = 15,
  markerTitle = "Local do evento",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Chave da API do Google Maps não configurada");
      setError("Mapa não disponível");
      setLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        setLoading(true);

        setOptions({
          key: apiKey,
          libraries: ["places"],
        });

        const { Map } = await importLibrary("maps");
        const { Marker } = await importLibrary("marker");

        if (!mapRef.current) return;

        const mapInstance = new Map(mapRef.current, {
          center: { lat, lng },
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        const markerInstance = new Marker({
          position: { lat, lng },
          map: mapInstance,
          title: markerTitle,
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      } catch (err) {
        console.error("Erro ao carregar Google Maps:", err);
        setError("Erro ao carregar o mapa");
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, [lat, lng, zoom, markerTitle]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapRef} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default EventMap;
