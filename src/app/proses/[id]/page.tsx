import { ProcessRunner } from "@/components/proses/runner";

export default async function ProsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProcessRunner id={id} />;
}
