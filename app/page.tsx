import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your transport overview</p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-xl border border-dashed border-border bg-card p-6">
          <p className="text-muted-foreground text-center">Dashboard coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
