"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAvulsaRegistrations } from "../hooks/useAvulsaRegistrations";

export default function AvulsaByEvent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { data, isLoading, error } = useAvulsaRegistrations(
    eventId,
    page,
    pageSize
  );

  const goToCreate = () => {
    router.push(`/super/inscriptions/avulsa/create/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inscrições Avulsas
          </h1>
          <Button onClick={goToCreate}>Nova Inscrição Avulsa</Button>
        </div>

        {error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center text-red-600">
              {error instanceof Error
                ? error.message
                : "Erro ao carregar inscrições avulsas"}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2 w-1/2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.registrations.length > 0 ? (
          <div className="space-y-4">
            {data.registrations.map((r) => (
              <Card key={r.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{r.responsible}</h3>
                    <p className="text-sm text-muted-foreground">
                      {r.phone} •{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(r.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.paymentMethod} • {r.status.toUpperCase()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/super/inscriptions/avulsa/${r.id}`)
                    }
                  >
                    Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}

            {data.pageCount > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        href="#"
                      />
                    </PaginationItem>
                    {Array.from({ length: data.pageCount }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          href="#"
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage(Math.min(data.pageCount, page + 1))
                        }
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            Nenhuma inscrição avulsa encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
