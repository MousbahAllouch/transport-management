import { DashboardLayout } from "@/components/dashboard-layout"
import { DriverDetailContent } from "@/components/driver-detail-content"

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <DashboardLayout>
      <DriverDetailContent driverId={id} />
    </DashboardLayout>
  )
}
