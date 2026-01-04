"use client"

import { getDriverById, getTruckById, getTripsByDriver, mockCosts, getClientById } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Award as IdCard, Truck, DollarSign, Route, Fuel } from "lucide-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import type { Trip, Cost } from "@/lib/types"
import { StatsCard } from "./stats-card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function DriverDetailContent({ driverId }: { driverId: string }) {
  const driver = getDriverById(driverId)
  const trips = getTripsByDriver(driverId)
  const driverCosts = mockCosts.filter((c) => c.driverId === driverId)
  const truck = driver?.assignedTruckId ? getTruckById(driver.assignedTruckId) : null

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Driver not found</p>
        <Link href="/drivers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drivers
          </Button>
        </Link>
      </div>
    )
  }

  const totalRevenue = trips.reduce((acc, t) => acc + t.amount, 0)
  const totalTips = trips.reduce((acc, t) => acc + t.tips, 0)
  const totalCollected = trips.reduce((acc, t) => acc + t.collected, 0)
  const totalDiesel = driverCosts.filter((c) => c.category === "diesel").reduce((acc, c) => acc + c.amount, 0)

  // Group trips by date for chart
  const tripsByDate = trips.reduce(
    (acc, trip) => {
      const date = trip.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, trips: 0 }
      }
      acc[date].revenue += trip.amount
      acc[date].trips += 1
      return acc
    },
    {} as Record<string, { date: string; revenue: number; trips: number }>,
  )
  const chartData = Object.values(tripsByDate).slice(-7)

  const tripColumns = [
    {
      key: "date",
      header: "Date",
      cell: (trip: Trip) => trip.date.toLocaleDateString(),
    },
    {
      key: "client",
      header: "Client",
      cell: (trip: Trip) => {
        const client = getClientById(trip.clientId)
        return <span className="font-medium">{client?.name}</span>
      },
    },
    {
      key: "route",
      header: "Route",
      cell: (trip: Trip) => (
        <span className="text-sm">
          {trip.origin} → {trip.destination}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (trip: Trip) => <span className="font-medium">${trip.amount.toLocaleString()}</span>,
    },
    {
      key: "tips",
      header: "Tips",
      cell: (trip: Trip) => <span className="text-success">${trip.tips.toLocaleString()}</span>,
    },
    {
      key: "collected",
      header: "Collected",
      cell: (trip: Trip) => <span className="font-medium">${trip.collected.toLocaleString()}</span>,
    },
  ]

  const costColumns = [
    {
      key: "date",
      header: "Date",
      cell: (cost: Cost) => cost.date.toLocaleDateString(),
    },
    {
      key: "category",
      header: "Category",
      cell: (cost: Cost) => (
        <Badge variant="outline" className="capitalize">
          {cost.category}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (cost: Cost) => <span className="text-destructive font-medium">${cost.amount.toLocaleString()}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (cost: Cost) => cost.description,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/drivers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{driver.name}</h1>
          {truck && (
            <Badge variant="secondary" className="mt-1">
              Assigned to {truck.licensePlate}
            </Badge>
          )}
        </div>
      </div>

      {/* Driver Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{driver.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{driver.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <IdCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">License</p>
                <p className="text-sm font-medium">{driver.licenseNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Truck</p>
                <p className="text-sm font-medium">{truck?.licensePlate || "Unassigned"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Trips" value={trips.length} icon={Route} />
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatsCard
          title="Tips Received"
          value={`$${totalTips.toLocaleString()}`}
          icon={DollarSign}
          className="border-l-2 border-l-success"
        />
        <StatsCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} icon={DollarSign} />
        <StatsCard
          title="Diesel Costs"
          value={`$${totalDiesel.toLocaleString()}`}
          icon={Fuel}
          className="border-l-2 border-l-destructive"
        />
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDriverRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  fillOpacity={1}
                  fill="url(#colorDriverRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Trip History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={trips} columns={tripColumns} pageSize={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={driverCosts} columns={costColumns} pageSize={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
