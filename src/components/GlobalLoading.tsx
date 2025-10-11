"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx)
    throw new Error(
      "useGlobalLoading deve ser usado dentro do GlobalLoadingProvider"
    );
  return ctx;
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      <GlobalLoading />
    </LoadingContext.Provider>
  );
}

function GlobalLoading() {
  const ctx = useContext(LoadingContext);

  // Bloqueia scroll quando loading está ativo
  useEffect(() => {
    if (ctx?.loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [ctx?.loading]);

  if (!ctx?.loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative">
        <Spinner
          variant="infinite"
          size={160}
          className="text-white drop-shadow-lg"
        />
      </div>
    </div>
  );
}
