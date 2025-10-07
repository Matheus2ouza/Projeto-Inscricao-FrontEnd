"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
  if (!ctx?.loading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-spin rounded-full border-8 border-t-indigo-500 border-b-purple-500 border-x-gray-200 h-20 w-20"></div>
    </div>
  );
}
