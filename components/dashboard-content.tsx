"use client"

import { StatsCard } from "./stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Truck, Route, Users } from "lucide-react"
import {
  mockClients,
  mockTrucks,
  mockDrivers,
  mockTrips,
  mockCosts,
  getClientById,
  getDriverById,
  getTruckById,
} from "@/lib/mock-data"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Calculate summary stats
const totalRevenue = mockTrips.reduce((acc, t) => acc + t.amount, 0)
const totalCosts = mockCosts.reduce((acc, c) => acc + c.amount, 0)
const netProfit = totalRevenue - totalCosts
const totalTrips = mockTrips.length
const activeTrucks = mockTrucks.filter((t) => t.status === "active").length
const totalClients = mockClients.length
const outstandingBalance = mockClients.reduce((acc, c) => acc + (c.totalBilled - c.totalPaid), 0)

// Chart data
const revenueData = [
  { name: "Dec 25", revenue: 2100, costs: 350 },
  { name: "Dec 26", revenue: 1800, costs: 280 },
  { name: "Dec 27", revenue: 2400, costs: 420 },
  { name: "Dec 28", revenue: 1950, costs: 185 },
  { name: "Dec 29", revenue: 2200, costs: 310 },
  { name: "Dec 30", revenue: 2600, costs: 1200 },
  { name: "Dec 31", revenue: 2030, costs: 300 },
  { name: "Jan 1", revenue: 1850, costs: 450 },
  { name: "Jan 2", revenue: 2350, costs: 180 },
  { name: "Jan 3", revenue: 2000, costs: 670 },
]

const tripsPerDriver = mockDrivers.map((driver) => {
  const driverTrips = mockTrips.filter((t) => t.driverId === driver.id)
  return {
    name: driver.name.split(" ")[0],
    trips: driverTrips.length,
    revenue: driverTrips.reduce((acc, t) => acc + t.amount, 0),
  }
})

export function DashboardContent() {
  const recentTrips = mockTrips.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your transport operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          description="vs last month"
        />
        <StatsCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
          description="vs last month"
        />
        <StatsCard title="Total Trips" value={totalTrips} icon={Route} description="This month" />
        <StatsCard
          title="Outstanding Balance"
          value={`$${outstandingBalance.toLocaleString()}`}
          icon={Users}
          description="From all clients"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue vs Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
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
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    stroke="var(--destructive)"
                    fillOpacity={0.2}
                    fill="var(--destructive)"
                    name="Costs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance by Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tripsPerDriver}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="trips" fill="var(--chart-2)" name="Trips" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats & Recent Trips */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTrucks.map((truck) => {
              const driver = getDriverById(truck.assignedDriverId || "")
              return (
                <div key={truck.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{truck.licensePlate}</p>
                      <p className="text-xs text-muted-foreground">{driver?.name || "Unassigned"}</p>
                    </div>
                  </div>
                  <Badge
                    variant={truck.status === "active" ? "default" : "secondary"}
                    className={truck.status === "active" ? "bg-success/20 text-success hover:bg-success/30" : ""}
                  >
                    {truck.status}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => {
                const client = getClientById(trip.clientId)
                const driver = getDriverById(trip.driverId)
                const truck = getTruckById(trip.truckId)
                return (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Route className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {driver?.name} • {truck?.licensePlate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${trip.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{trip.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
