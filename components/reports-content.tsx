"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatsCard } from "./stats-card"
import { DollarSign, TrendingUp, TrendingDown, Truck, Users, Route } from "lucide-react"
import {
  mockTrips,
  mockCosts,
  mockClients,
  mockDrivers,
  mockTrucks,
  getDriverById,
  getClientById,
} from "@/lib/mock-data"
import type { DailyDriverSummary, Trip } from "@/lib/types"
import { DataTable } from "./data-table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function ReportsContent() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [filterDriver, setFilterDriver] = useState<string>("all")
  const [filterTruck, setFilterTruck] = useState<string>("all")
  const [filterClient, setFilterClient] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  // Filter data by date range and filters
  const filteredTrips = useMemo(() => {
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    return mockTrips.filter((trip) => {
      const tripDate = new Date(trip.date)
      if (tripDate < startDate || tripDate > endDate) return false
      if (filterDriver !== "all" && trip.driverId !== filterDriver) return false
      if (filterTruck !== "all" && trip.truckId !== filterTruck) return false
      if (filterClient !== "all" && trip.clientId !== filterClient) return false
      return true
    })
  }, [dateRange, filterDriver, filterTruck, filterClient])

  const filteredCosts = useMemo(() => {
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    return mockCosts.filter((cost) => {
      const costDate = new Date(cost.date)
      if (costDate < startDate || costDate > endDate) return false
      if (filterTruck !== "all" && cost.truckId !== filterTruck) return false
      return true
    })
  }, [dateRange, filterTruck])

  // Calculate totals
  const totalRevenue = filteredTrips.reduce((acc, t) => acc + t.amount, 0)
  const totalTips = filteredTrips.reduce((acc, t) => acc + t.tips, 0)
  const totalCosts = filteredCosts.reduce((acc, c) => acc + c.amount, 0)
  const netProfit = totalRevenue + totalTips - totalCosts
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0

  // Revenue over time chart
  const revenueByDate = useMemo(() => {
    const grouped: Record<string, { date: string; revenue: number; costs: number }> = {}
    filteredTrips.forEach((trip) => {
      const date = trip.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!grouped[date]) grouped[date] = { date, revenue: 0, costs: 0 }
      grouped[date].revenue += trip.amount
    })
    filteredCosts.forEach((cost) => {
      const date = cost.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!grouped[date]) grouped[date] = { date, revenue: 0, costs: 0 }
      grouped[date].costs += cost.amount
    })
    return Object.values(grouped).slice(-14)
  }, [filteredTrips, filteredCosts])

  // Revenue by client
  const revenueByClient = useMemo(() => {
    const grouped: Record<string, { name: string; value: number }> = {}
    filteredTrips.forEach((trip) => {
      const client = getClientById(trip.clientId)
      const name = client?.name || "Unknown"
      if (!grouped[name]) grouped[name] = { name, value: 0 }
      grouped[name].value += trip.amount
    })
    return Object.values(grouped).sort((a, b) => b.value - a.value)
  }, [filteredTrips])

  // Costs by category
  const costsByCategory = useMemo(() => {
    const grouped: Record<string, { name: string; value: number }> = {}
    filteredCosts.forEach((cost) => {
      const name = cost.category.charAt(0).toUpperCase() + cost.category.slice(1)
      if (!grouped[name]) grouped[name] = { name, value: 0 }
      grouped[name].value += cost.amount
    })
    return Object.values(grouped).sort((a, b) => b.value - a.value)
  }, [filteredCosts])

  // Daily driver summary
  const dailyDriverSummaries = useMemo(() => {
    const date = new Date(selectedDate)
    const summaries: DailyDriverSummary[] = []

    mockDrivers.forEach((driver) => {
      const truck = mockTrucks.find((t) => t.id === driver.assignedTruckId)
      const driverTrips = mockTrips.filter(
        (t) => t.driverId === driver.id && t.date.toDateString() === date.toDateString(),
      )
      const driverCosts = mockCosts.filter(
        (c) => c.driverId === driver.id && c.date.toDateString() === date.toDateString() && c.category === "diesel",
      )

      const totalRevenue = driverTrips.reduce((acc, t) => acc + t.amount, 0)
      const totalTips = driverTrips.reduce((acc, t) => acc + t.tips, 0)
      const totalCollected = driverTrips.reduce((acc, t) => acc + t.collected, 0)
      const totalDiesel = driverCosts.reduce((acc, c) => acc + c.amount, 0)

      summaries.push({
        driverId: driver.id,
        driverName: driver.name,
        truckId: truck?.id || "",
        truckPlate: truck?.licensePlate || "N/A",
        date,
        totalTrips: driverTrips.length,
        totalRevenue,
        totalTips,
        totalCollected,
        totalDiesel,
        netResult: totalRevenue + totalTips - totalDiesel,
      })
    })

    return summaries
  }, [selectedDate])

  const summaryColumns = [
    {
      key: "driver",
      header: "Driver",
      cell: (summary: DailyDriverSummary) => (
        <div>
          <p className="font-medium">{summary.driverName}</p>
          <p className="text-xs text-muted-foreground">{summary.truckPlate}</p>
        </div>
      ),
    },
    {
      key: "trips",
      header: "Trips",
      cell: (summary: DailyDriverSummary) => summary.totalTrips,
    },
    {
      key: "revenue",
      header: "Revenue",
      cell: (summary: DailyDriverSummary) => (
        <span className="font-medium">${summary.totalRevenue.toLocaleString()}</span>
      ),
    },
    {
      key: "tips",
      header: "Tips",
      cell: (summary: DailyDriverSummary) => (
        <span className="text-success">${summary.totalTips.toLocaleString()}</span>
      ),
    },
    {
      key: "collected",
      header: "Collected",
      cell: (summary: DailyDriverSummary) => <span>${summary.totalCollected.toLocaleString()}</span>,
    },
    {
      key: "diesel",
      header: "Diesel",
      cell: (summary: DailyDriverSummary) => (
        <span className="text-destructive">${summary.totalDiesel.toLocaleString()}</span>
      ),
    },
    {
      key: "netResult",
      header: "Net Result",
      cell: (summary: DailyDriverSummary) => (
        <span className={summary.netResult >= 0 ? "text-success font-medium" : "text-destructive font-medium"}>
          ${summary.netResult.toLocaleString()}
        </span>
      ),
    },
  ]

  // Driver trips for selected date
  const driverTripsForDate = useMemo(() => {
    const date = new Date(selectedDate)
    return mockTrips.filter((t) => t.date.toDateString() === date.toDateString())
  }, [selectedDate])

  const tripColumns = [
    {
      key: "driver",
      header: "Driver",
      cell: (trip: Trip) => getDriverById(trip.driverId)?.name,
    },
    {
      key: "client",
      header: "Client",
      cell: (trip: Trip) => getClientById(trip.clientId)?.name,
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
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Financial overview and daily summaries</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Profit Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-[150px] bg-secondary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-[150px] bg-secondary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Driver</Label>
                  <Select value={filterDriver} onValueChange={setFilterDriver}>
                    <SelectTrigger className="w-[150px] bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Drivers</SelectItem>
                      {mockDrivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Truck</Label>
                  <Select value={filterTruck} onValueChange={setFilterTruck}>
                    <SelectTrigger className="w-[150px] bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trucks</SelectItem>
                      {mockTrucks.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Client</Label>
                  <Select value={filterClient} onValueChange={setFilterClient}>
                    <SelectTrigger className="w-[150px] bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {mockClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
            <StatsCard
              title="Tips Earned"
              value={`$${totalTips.toLocaleString()}`}
              icon={TrendingUp}
              className="border-l-2 border-l-success"
            />
            <StatsCard
              title="Total Costs"
              value={`$${totalCosts.toLocaleString()}`}
              icon={TrendingDown}
              className="border-l-2 border-l-destructive"
            />
            <StatsCard
              title="Net Profit"
              value={`$${netProfit.toLocaleString()}`}
              icon={DollarSign}
              className={netProfit >= 0 ? "border-l-2 border-l-success" : "border-l-2 border-l-destructive"}
            />
            <StatsCard title="Profit Margin" value={`${profitMargin}%`} icon={TrendingUp} />
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Revenue vs Costs Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueByDate}>
                      <defs>
                        <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
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
                        stroke="var(--chart-3)"
                        fillOpacity={1}
                        fill="url(#colorRevenueReport)"
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
                <CardTitle className="text-sm font-medium">Revenue by Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByClient.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Costs Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costsByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Trips</span>
                  </div>
                  <span className="font-medium">{filteredTrips.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Active Clients</span>
                  </div>
                  <span className="font-medium">{new Set(filteredTrips.map((t) => t.clientId)).size}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Trucks Used</span>
                  </div>
                  <span className="font-medium">{new Set(filteredTrips.map((t) => t.truckId)).size}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Avg Trip Value</span>
                  </div>
                  <span className="font-medium">
                    ${filteredTrips.length > 0 ? Math.round(totalRevenue / filteredTrips.length).toLocaleString() : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Avg Tips/Trip</span>
                  </div>
                  <span className="font-medium text-success">
                    ${filteredTrips.length > 0 ? Math.round(totalTips / filteredTrips.length) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          {/* Date Selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Label htmlFor="summaryDate">Select Date</Label>
                <Input
                  id="summaryDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[200px] bg-secondary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Daily totals */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Daily Revenue"
              value={`$${dailyDriverSummaries.reduce((acc, s) => acc + s.totalRevenue, 0).toLocaleString()}`}
              icon={DollarSign}
            />
            <StatsCard
              title="Total Tips"
              value={`$${dailyDriverSummaries.reduce((acc, s) => acc + s.totalTips, 0).toLocaleString()}`}
              icon={TrendingUp}
              className="border-l-2 border-l-success"
            />
            <StatsCard
              title="Total Diesel"
              value={`$${dailyDriverSummaries.reduce((acc, s) => acc + s.totalDiesel, 0).toLocaleString()}`}
              icon={TrendingDown}
              className="border-l-2 border-l-destructive"
            />
            <StatsCard
              title="Net Result"
              value={`$${dailyDriverSummaries.reduce((acc, s) => acc + s.netResult, 0).toLocaleString()}`}
              icon={DollarSign}
              className="border-l-2 border-l-chart-3"
            />
          </div>

          {/* Driver Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Driver Summary for {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={dailyDriverSummaries.map((s, i) => ({ ...s, id: `summary-${i}` }))}
                columns={summaryColumns}
              />
            </CardContent>
          </Card>

          {/* Trips for the day */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Trips on {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {driverTripsForDate.length > 0 ? (
                <DataTable data={driverTripsForDate} columns={tripColumns} />
              ) : (
                <p className="text-center py-8 text-muted-foreground">No trips recorded for this date</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
