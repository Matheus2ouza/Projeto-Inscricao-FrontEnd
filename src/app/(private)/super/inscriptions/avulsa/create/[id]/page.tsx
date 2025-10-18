"use client";

import CreateAvulsaForm from "@/features/avulsa/components/CreateAvulsaForm";
import { useParams } from "next/navigation";

export default function CreateAvulsaPage() {
  const params = useParams();
  const eventId = params.id as string;

  return <CreateAvulsaForm eventId={eventId} />;
}
