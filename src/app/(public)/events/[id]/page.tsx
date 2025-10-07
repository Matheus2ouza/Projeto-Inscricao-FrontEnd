import axiosInstance from "@/shared/lib/apiClient";
import Image from "next/image";

type EventDetail = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl: string;
  regionName: string;
  createdAt: string;
  updatedAt: string;
};

async function getEventById(params: { id: string }): Promise<EventDetail> {
  const { data } = await axiosInstance.get<EventDetail>(`/events/me`, {
    params: { id: params.id },
  });
  console.log("retorno do eventById");
  console.log(data);
  return data;
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params);
  console.log(event);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="relative w-full aspect-[3/1.1]">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {event.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Região {event.regionName}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Início</p>
                <p className="font-medium">
                  {new Date(event.startDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Término</p>
                <p className="font-medium">
                  {new Date(event.endDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Participantes</p>
                <p className="font-medium">{event.quantityParticipants}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-xs text-muted-foreground">Arrecadação</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(event.amountCollected)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-muted-foreground">Atualizado em</p>
                <p className="font-medium">
                  {new Date(event.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
