"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { analysisInscriptionsKeys } from "../hooks/useAnalysisInscriptionsQuery";

interface DeletedInscriptionsContextType {
  markAsDeleted: (inscriptionId: string) => void;
  isDeleted: (inscriptionId: string) => boolean;
  clearDeleted: () => void;
  removeFromDeleted: (inscriptionId: string) => void;
}

const DeletedInscriptionsContext = createContext<DeletedInscriptionsContextType | null>(null);

interface DeletedInscriptionsProviderProps {
  children: ReactNode;
}

export function DeletedInscriptionsProvider({ children }: DeletedInscriptionsProviderProps) {
  const queryClient = useQueryClient();
  const deletedInscriptionsRef = useRef<Set<string>>(new Set());
  const [, forceUpdate] = useState({});

  const markAsDeleted = useCallback((inscriptionId: string) => {
    console.log("Marcando inscrição como deletada:", inscriptionId);
    deletedInscriptionsRef.current.add(inscriptionId);

    // Forçar re-render
    forceUpdate({});

    // Remover dados da inscrição de todos os caches
    queryClient.removeQueries({
      queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
    });

    // Cancelar queries em andamento
    queryClient.cancelQueries({
      queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
    });
  }, [queryClient]);

  const isDeleted = useCallback((inscriptionId: string) => {
    const deleted = deletedInscriptionsRef.current.has(inscriptionId);
    console.log("Verificando se inscrição foi deletada:", inscriptionId, deleted);
    return deleted;
  }, []);

  const clearDeleted = useCallback(() => {
    deletedInscriptionsRef.current.clear();
    forceUpdate({});
  }, []);

  const removeFromDeleted = useCallback((inscriptionId: string) => {
    deletedInscriptionsRef.current.delete(inscriptionId);
    forceUpdate({});
  }, []);

  return (
    <DeletedInscriptionsContext.Provider
      value={{
        markAsDeleted,
        isDeleted,
        clearDeleted,
        removeFromDeleted,
      }}
    >
      {children}
    </DeletedInscriptionsContext.Provider>
  );
}

export function useDeletedInscriptions() {
  const context = useContext(DeletedInscriptionsContext);
  if (!context) {
    throw new Error("useDeletedInscriptions must be used within a DeletedInscriptionsProvider");
  }
  return context;
}
