"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Route } from "lucide-react"
import {
  mockTrips,
  mockClients,
  mockDrivers,
  mockTrucks,
  getClientById,
  getDriverById,
  getTruckById,
} from "@/lib/mock-data"
import type { Trip } from "@/lib/types"
import { TripFormDialog } from "./trip-form-dialog"
import { StatsCard } from "./stats-card"
import { DollarSign, TrendingUp, Truck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TripsContent() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>()
  const [filterDriver, setFilterDriver] = useState<string>("all")
  const [filterClient, setFilterClient] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")

  const filteredTrips = trips.filter((trip) => {
    if (filterDriver !== "all" && trip.driverId !== filterDriver) return false
    if (filterClient !== "all" && trip.clientId !== filterClient) return false
    if (filterService !== "all" && trip.serviceType !== filterService) return false
    return true
  })

  const totalRevenue = filteredTrips.reduce((acc, t) => acc + t.amount, 0)
  const totalTips = filteredTrips.reduce((acc, t) => acc + t.tips, 0)
  const totalCollected = filteredTrips.reduce((acc, t) => acc + t.collected, 0)

  const columns = [
    {
      key: "date",
      header: "Date",
      cell: (trip: Trip) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Route className="h-5 w-5 text-chart-2" />
          </div>
          <span>{trip.date.toLocaleDateString()}</span>
        </div>
      ),
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
      key: "serviceType",
      header: "Service",
      cell: (trip: Trip) => (
        <Badge
          variant="secondary"
          className={
            trip.serviceType === "material_transport" ? "bg-chart-1/20 text-chart-1" : "bg-chart-2/20 text-chart-2"
          }
        >
          {trip.serviceType === "material_transport" ? "Material" : "Transport"}
        </Badge>
      ),
    },
    {
      key: "route",
      header: "Route",
      cell: (trip: Trip) => (
        <div className="max-w-[200px]">
          <p className="text-sm truncate">{trip.origin}</p>
          <p className="text-xs text-muted-foreground truncate">→ {trip.destination}</p>
        </div>
      ),
    },
    {
      key: "driver",
      header: "Driver / Truck",
      cell: (trip: Trip) => {
        const driver = getDriverById(trip.driverId)
        const truck = getTruckById(trip.truckId)
        return (
          <div>
            <p className="text-sm">{driver?.name}</p>
            <p className="text-xs text-muted-foreground">{truck?.licensePlate}</p>
          </div>
        )
      },
    },
    {
      key: "amount",
      header: "Amount",
      cell: (trip: Trip) => <span className="font-medium">${trip.amount.toLocaleString()}</span>,
    },
    {
      key: "tips",
      header: "Tips",
      cell: (trip: Trip) => <span className="text-success">${trip.tips}</span>,
    },
    {
      key: "collected",
      header: "Collected",
      cell: (trip: Trip) => <span className="font-medium">${trip.collected.toLocaleString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (trip: Trip) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditingTrip(trip)
            setDialogOpen(true)
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const handleAddTrip = (data: Omit<Trip, "id" | "createdAt">) => {
    if (editingTrip) {
      setTrips(trips.map((t) => (t.id === editingTrip.id ? { ...t, ...data } : t)))
    } else {
      const trip: Trip = {
        ...data,
        id: `trip-${Date.now()}`,
        createdAt: new Date(),
      }
      setTrips([trip, ...trips])
    }
    setDialogOpen(false)
    setEditingTrip(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trips</h1>
          <p className="text-muted-foreground">Track all transport jobs</p>
        </div>
        <Button
          onClick={() => {
            setEditingTrip(undefined)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Trip
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Trips" value={filteredTrips.length} icon={Truck} />
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatsCard
          title="Tips Earned"
          value={`$${totalTips.toLocaleString()}`}
          icon={TrendingUp}
          className="border-l-2 border-l-success"
        />
        <StatsCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} icon={DollarSign} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterDriver} onValueChange={setFilterDriver}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by driver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            {mockDrivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="material_transport">Material + Transport</SelectItem>
            <SelectItem value="transport_only">Transport Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredTrips} columns={columns} />

      <TripFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingTrip(undefined)
        }}
        onSubmit={handleAddTrip}
        initialData={editingTrip}
        clients={mockClients}
        drivers={mockDrivers}
        trucks={mockTrucks}
      />
    </div>
  )
}
