import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientDetailContent } from "@/components/client-detail-content"

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <DashboardLayout>
      <ClientDetailContent clientId={id} />
    </DashboardLayout>
  )
}
