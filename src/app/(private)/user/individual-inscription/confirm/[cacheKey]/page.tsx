import IndividualInscriptionConfirmation from "@/features/individualInscription/components/IndividualInscriptionConfirmation";

export default async function IndividualInscriptionConfirmationPage({
  params,
}: {
  params: Promise<{ cacheKey: string }>;
}) {
  const { cacheKey } = await params;

  return <IndividualInscriptionConfirmation cacheKey={cacheKey} />;
}
