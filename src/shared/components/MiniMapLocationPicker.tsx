"use client";

import React, { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface MiniMapLocationPickerProps {
  initialPosition?: { lat: number; lng: number };
  initialAddress?: string;
  onChange: (data: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

const DEFAULT_POSITION = { lat: -23.55052, lng: -46.633308 };

export default function MiniMapLocationPicker({
  initialPosition,
  initialAddress,
  onChange,
  className,
}: MiniMapLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null); // Referência para o input de busca
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [address, setAddress] = useState(initialAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para reposicionar o .pac-container
  const positionPacContainer = () => {
    const pacContainer = document.querySelector(
      ".pac-container"
    ) as HTMLElement;
    if (pacContainer && searchInputRef.current) {
      const inputRect = searchInputRef.current.getBoundingClientRect();
      pacContainer.style.position = "absolute";
      pacContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
      pacContainer.style.left = `${inputRect.left + window.scrollX}px`;
      pacContainer.style.width = `${inputRect.width}px`;
      pacContainer.style.zIndex = "10000";
    }
  };

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Chave da API do Google Maps não configurada");
      return;
    }

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          libraries: ["places"],
        });

        const { Map } = await importLibrary("maps");
        const { Marker } = await importLibrary("marker");
        const { SearchBox } = await importLibrary("places");

        if (!mapRef.current) return;

        const mapInstance = new Map(mapRef.current, {
          center: initialPosition || DEFAULT_POSITION,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#000000" }],
            },
          ],
        });

        const markerInstance = new Marker({
          position: initialPosition || DEFAULT_POSITION,
          map: mapInstance,
          draggable: true,
        });

        // Create search input element
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Buscar endereço...";
        searchInput.style.padding = "12px 16px";
        searchInput.style.border = "2px solid #e5e7eb";
        searchInput.style.borderRadius = "8px";
        searchInput.style.boxShadow =
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        searchInput.style.width = "320px";
        searchInput.style.maxWidth = "calc(100% - 24px)";
        searchInput.style.fontSize = "14px";
        searchInput.style.outline = "none";
        searchInput.style.backgroundColor = "white";
        searchInput.style.color = "#111827";
        searchInput.style.fontFamily = "inherit";
        searchInput.style.zIndex = "1000";
        searchInput.style.position = "relative";

        // Atribuir o input à referência
        searchInputRef.current = searchInput;

        const searchContainer = document.createElement("div");
        searchContainer.style.margin = "12px";
        searchContainer.style.zIndex = "1000";
        searchContainer.style.position = "relative";
        searchContainer.appendChild(searchInput);

        mapInstance.controls[google.maps.ControlPosition.TOP_LEFT].push(
          searchContainer
        );

        const searchBoxInstance = new SearchBox(searchInput);

        searchBoxInstance.addListener("places_changed", () => {
          const places = searchBoxInstance.getPlaces();

          if (!places || places.length === 0) return;

          const place = places[0];

          if (!place.geometry?.location) {
            setError("Local não encontrado");
            return;
          }

          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          mapInstance.setCenter(location);
          mapInstance.setZoom(17);
          markerInstance.setPosition(location);

          const newAddress = place.formatted_address || place.name || "";
          setAddress(newAddress);

          onChange({
            lat: location.lat,
            lng: location.lng,
            address: newAddress,
          });

          setError(null);
        });

        mapInstance.addListener("bounds_changed", () => {
          searchBoxInstance.setBounds(
            mapInstance.getBounds() as google.maps.LatLngBounds
          );
        });

        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;

          const location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          markerInstance.setPosition(location);
          reverseGeocode(location, mapInstance, markerInstance);
        });

        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition();
          if (!position) return;

          const location = {
            lat: position.lat(),
            lng: position.lng(),
          };

          reverseGeocode(location, mapInstance, markerInstance);
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setSearchBox(searchBoxInstance);

        if (initialPosition && !initialAddress) {
          reverseGeocode(initialPosition, mapInstance, markerInstance);
        }

        // Configurar o posicionamento inicial do .pac-container
        setTimeout(() => {
          positionPacContainer();
        }, 100);

        // Adicionar listeners para redimensionamento e rolagem
        window.addEventListener("resize", positionPacContainer);
        window.addEventListener("scroll", positionPacContainer);
      } catch (err) {
        console.error("Erro ao carregar Google Maps:", err);
        setError("Erro ao carregar o mapa");
      } finally {
        setLoading(false);
      }
    };

    initMap();

    return () => {
      window.removeEventListener("resize", positionPacContainer);
      window.removeEventListener("scroll", positionPacContainer);
    };
  }, [initialPosition, initialAddress, onChange]);

  const reverseGeocode = (
    location: { lat: number; lng: number },
    mapInstance: google.maps.Map,
    markerInstance: google.maps.Marker
  ) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const newAddress = results[0].formatted_address;
        setAddress(newAddress);
        onChange({
          lat: location.lat,
          lng: location.lng,
          address: newAddress,
        });
      } else {
        setAddress("");
        onChange({
          lat: location.lat,
          lng: location.lng,
          address: "",
        });
      }
      setError(null);
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    if (marker) {
      const position = marker.getPosition();
      if (position) {
        onChange({
          lat: position.lat(),
          lng: position.lng(),
          address: newAddress,
        });
      }
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`p-4 bg-red-100 text-red-700 rounded-lg ${className}`}>
        Erro: Chave da API do Google Maps não configurada. Configure
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no arquivo .env.local
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={mapRef}
        className="w-full h-64 rounded-lg border border-border mb-4 relative"
      />
      <div className="space-y-2">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Endereço completo do evento"
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white text-foreground"
        />
        {loading && (
          <div className="text-xs text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
            Carregando mapa...
          </div>
        )}
        {error && (
          <div className="text-xs text-red-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Use a busca no mapa ou clique para definir a localização
        </p>
      </div>
      <style jsx global>{`
        .pac-container {
          z-index: 10000 !important;
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          background: white !important;
        }
        .pac-item {
          padding: 8px 12px !important;
          border-bottom: 1px solid #f3f4f6 !important;
          cursor: pointer !important;
          font-size: 14px !important;
          color: #111827 !important;
        }
        .pac-item:hover {
          background-color: #f9fafb !important;
        }
        .pac-item-query {
          font-size: 14px !important;
          color: #111827 !important;
          font-weight: 500 !important;
        }
        .pac-matched {
          font-weight: 600 !important;
          color: #2563eb !important;
        }
        .pac-icon {
          margin-top: 2px !important;
        }
      `}</style>
    </div>
  );
}
