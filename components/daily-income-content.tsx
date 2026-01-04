"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Fuel,
  Route,
  User,
  Truck,
} from "lucide-react"
import {
  mockDrivers,
  mockTrips,
  mockCosts,
  mockTrucks,
  getClientById,
  getTruckById,
} from "@/lib/mock-data"
import type { Driver, Trip, Cost } from "@/lib/types"

interface DriverDailyData {
  driver: Driver
  truck: string
  trips: Trip[]
  costs: Cost[]
  totalRevenue: number
  totalTips: number
  totalCollected: number
  dieselCosts: number
  driverPortion: number
  ownerProfit: number
  netProfit: number
}

export function DailyIncomeContent() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null)

  // Calculate data for each driver for the selected date
  const driverDailyData = useMemo(() => {
    const date = new Date(selectedDate)
    const data: DriverDailyData[] = []

    mockDrivers.forEach((driver) => {
      const truck = getTruckById(driver.assignedTruckId || "")

      // Get trips for this driver on this date
      const driverTrips = mockTrips.filter(
        (t) => t.driverId === driver.id && t.date.toDateString() === date.toDateString()
      )

      // Get costs (diesel) for this driver on this date
      const driverCosts = mockCosts.filter(
        (c) =>
          c.driverId === driver.id &&
          c.date.toDateString() === date.toDateString() &&
          c.category === "diesel"
      )

      const totalRevenue = driverTrips.reduce((acc, t) => acc + t.amount, 0)
      const totalTips = driverTrips.reduce((acc, t) => acc + t.tips, 0)
      const totalCollected = driverTrips.reduce((acc, t) => acc + t.collected, 0)
      const dieselCosts = driverCosts.reduce((acc, c) => acc + c.amount, 0)

      // Calculate driver portion (assuming 30% of revenue as driver's share)
      // You can adjust this percentage based on your business model
      const driverPortionPercentage = 0.3
      const driverPortion = totalRevenue * driverPortionPercentage

      // Owner profit = Revenue + Tips - Diesel - Driver Portion
      const ownerProfit = totalRevenue + totalTips - dieselCosts - driverPortion

      // Net profit = Revenue + Tips - Diesel
      const netProfit = totalRevenue + totalTips - dieselCosts

      data.push({
        driver,
        truck: truck?.licensePlate || "N/A",
        trips: driverTrips,
        costs: driverCosts,
        totalRevenue,
        totalTips,
        totalCollected,
        dieselCosts,
        driverPortion,
        ownerProfit,
        netProfit,
      })
    })

    return data
  }, [selectedDate])

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    return driverDailyData.reduce(
      (acc, data) => ({
        revenue: acc.revenue + data.totalRevenue,
        tips: acc.tips + data.totalTips,
        collected: acc.collected + data.totalCollected,
        diesel: acc.diesel + data.dieselCosts,
        driverPortions: acc.driverPortions + data.driverPortion,
        ownerProfit: acc.ownerProfit + data.ownerProfit,
        netProfit: acc.netProfit + data.netProfit,
        trips: acc.trips + data.trips.length,
      }),
      { revenue: 0, tips: 0, collected: 0, diesel: 0, driverPortions: 0, ownerProfit: 0, netProfit: 0, trips: 0 }
    )
  }, [driverDailyData])

  const toggleDriver = (driverId: string) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId)
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Daily Income</h1>
        <p className="text-muted-foreground text-sm">Driver accounting and profit tracking</p>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="date" className="text-sm font-medium whitespace-nowrap">
              Select Date
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-12 text-base bg-secondary max-w-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${dailyTotals.revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{dailyTotals.trips} trips</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Owner Profit</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${dailyTotals.ownerProfit.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">After driver portions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Fuel className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-muted-foreground">Total Diesel</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${dailyTotals.diesel.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Fuel expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-purple-500" />
              <p className="text-xs text-muted-foreground">Driver Portions</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${dailyTotals.driverPortions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total to drivers</p>
          </CardContent>
        </Card>
      </div>

      {/* Driver Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Drivers</h2>
        {driverDailyData.map((data) => (
          <Card
            key={data.driver.id}
            className={`transition-all ${
              expandedDriver === data.driver.id ? "border-primary" : ""
            }`}
          >
            <CardContent className="p-0">
              {/* Driver Header - Clickable */}
              <button
                onClick={() => toggleDriver(data.driver.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{data.driver.name}</p>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{data.truck}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Owner Profit</p>
                    <p
                      className={`font-bold ${
                        data.ownerProfit >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      ${data.ownerProfit.toLocaleString()}
                    </p>
                  </div>
                  {expandedDriver === data.driver.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedDriver === data.driver.id && (
                <div className="px-4 pb-4 space-y-4">
                  <Separator />

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                      <p className="text-lg font-semibold text-green-500">
                        ${data.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tips</p>
                      <p className="text-lg font-semibold text-green-500">
                        +${data.totalTips.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Diesel Cost</p>
                      <p className="text-lg font-semibold text-orange-500">
                        -${data.dieselCosts.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Driver Portion (30%)</p>
                      <p className="text-lg font-semibold text-purple-500">
                        -${data.driverPortion.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <Card className="bg-accent/30">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-medium">${data.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-600">
                        <span className="text-sm">+ Tips</span>
                        <span className="font-medium">+${data.totalTips.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-orange-600">
                        <span className="text-sm">- Diesel</span>
                        <span className="font-medium">-${data.dieselCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-purple-600">
                        <span className="text-sm">- Driver Portion (30%)</span>
                        <span className="font-medium">-${data.driverPortion.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Owner Profit</span>
                        <span className={data.ownerProfit >= 0 ? "text-green-500" : "text-red-500"}>
                          ${data.ownerProfit.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trips List */}
                  {data.trips.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        Trips ({data.trips.length})
                      </h3>
                      <div className="space-y-2">
                        {data.trips.map((trip) => {
                          const client = getClientById(trip.clientId)
                          return (
                            <div
                              key={trip.id}
                              className="p-3 bg-secondary rounded-lg flex justify-between items-start"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">{client?.name || "Unknown"}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {trip.origin} → {trip.destination}
                                </p>
                                {trip.material && (
                                  <p className="text-xs text-muted-foreground">
                                    {trip.material} {trip.quantity && `(${trip.quantity})`}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-500">
                                  ${trip.amount.toLocaleString()}
                                </p>
                                {trip.tips > 0 && (
                                  <p className="text-xs text-green-400">+${trip.tips} tip</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Diesel Costs */}
                  {data.costs.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        Diesel Expenses ({data.costs.length})
                      </h3>
                      <div className="space-y-2">
                        {data.costs.map((cost) => (
                          <div
                            key={cost.id}
                            className="p-3 bg-secondary rounded-lg flex justify-between items-center"
                          >
                            <p className="text-sm">{cost.description}</p>
                            <p className="font-semibold text-orange-500">
                              ${cost.amount.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Activity Message */}
                  {data.trips.length === 0 && data.costs.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-sm">No activity for this date</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Drivers Message */}
      {driverDailyData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No drivers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
