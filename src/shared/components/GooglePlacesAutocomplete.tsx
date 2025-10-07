"use client";

import React, { useEffect, useRef } from "react";

type GooglePlacesAutocompleteProps = {
  placeholder?: string;
  onSelect: (payload: { lat: number; lng: number; address?: string }) => void;
  className?: string;
};

declare global {
  interface Window {
    google?: any;
  }
}

// Função para carregar a Extended Component Library
function loadExtendedComponents(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();

    // Verifica se já está carregado
    if (customElements.get("gmpx-place-picker")) {
      return resolve();
    }

    const existingScript = document.querySelector(
      'script[src^="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Falha ao carregar Google Maps Extended Components"));
    document.head.appendChild(script);
  });
}

export default function GooglePlacesAutocomplete({
  placeholder = "Buscar endereço",
  onSelect,
  className,
}: GooglePlacesAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let placePicker: any;

    const initializePlacePicker = async () => {
      try {
        await loadExtendedComponents();

        if (!containerRef.current) return;

        // Limpa o container
        containerRef.current.innerHTML = "";

        // Cria o place picker
        placePicker = document.createElement("gmpx-place-picker");
        placePicker.setAttribute("placeholder", placeholder);

        if (className) {
          placePicker.className = className;
        }

        // Adiciona event listener
        placePicker.addEventListener("gmpx-placechange", () => {
          const place = placePicker.value;

          if (place?.location) {
            onSelect({
              lat: place.location.lat(),
              lng: place.location.lng(),
              address: place.formattedAddress || place.displayName,
            });
          }
        });

        containerRef.current.appendChild(placePicker);
      } catch (error) {
        console.error("Erro ao inicializar place picker:", error);
      }
    };

    initializePlacePicker();

    return () => {
      // Cleanup se necessário
    };
  }, [placeholder, className, onSelect]);

  return <div ref={containerRef} />;
}
