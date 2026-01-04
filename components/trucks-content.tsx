"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { mockTrucks, mockDrivers, getTripsByTruck, getCostsByTruck } from "@/lib/mock-data"
import type { Truck, TruckStatus } from "@/lib/types"
import { TruckFormDialog } from "./truck-form-dialog"
import { StatsCard } from "./stats-card"
import { TruckIcon, Wrench, AlertCircle, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusColors: Record<TruckStatus, string> = {
  active: "bg-success/20 text-success",
  maintenance: "bg-warning/20 text-warning",
  inactive: "bg-muted text-muted-foreground",
}

export function TrucksContent() {
  const [trucks, setTrucks] = useState<Truck[]>(mockTrucks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState<Truck | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const activeTrucks = trucks.filter((t) => t.status === "active").length
  const maintenanceTrucks = trucks.filter((t) => t.status === "maintenance").length
  const inactiveTrucks = trucks.filter((t) => t.status === "inactive").length

  const columns = [
    {
      key: "licensePlate",
      header: "License Plate",
      cell: (truck: Truck) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <TruckIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">{truck.licensePlate}</span>
        </div>
      ),
    },
    {
      key: "model",
      header: "Model",
      cell: (truck: Truck) => truck.model,
    },
    {
      key: "capacity",
      header: "Capacity",
      cell: (truck: Truck) => truck.capacity,
    },
    {
      key: "driver",
      header: "Assigned Driver",
      cell: (truck: Truck) => {
        const driver = mockDrivers.find((d) => d.id === truck.assignedDriverId)
        return driver ? <span>{driver.name}</span> : <span className="text-muted-foreground">Unassigned</span>
      },
    },
    {
      key: "trips",
      header: "Total Trips",
      cell: (truck: Truck) => getTripsByTruck(truck.id).length,
    },
    {
      key: "costs",
      header: "Total Costs",
      cell: (truck: Truck) => {
        const costs = getCostsByTruck(truck.id)
        const total = costs.reduce((acc, c) => acc + c.amount, 0)
        return <span>${total.toLocaleString()}</span>
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (truck: Truck) => (
        <Badge variant="secondary" className={statusColors[truck.status]}>
          {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (truck: Truck) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingTruck(truck)
              setDialogOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(truck.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const handleAddTruck = (data: Omit<Truck, "id" | "createdAt">) => {
    if (editingTruck) {
      setTrucks(trucks.map((t) => (t.id === editingTruck.id ? { ...t, ...data } : t)))
    } else {
      const truck: Truck = {
        ...data,
        id: `truck-${Date.now()}`,
        createdAt: new Date(),
      }
      setTrucks([...trucks, truck])
    }
    setDialogOpen(false)
    setEditingTruck(undefined)
  }

  const handleDelete = () => {
    if (deleteId) {
      setTrucks(trucks.filter((t) => t.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setEditingTruck(undefined)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Truck
        </Button>
      </div>

      <DataTable data={trucks} columns={columns} searchKey="licensePlate" searchPlaceholder="Search by plate..." />

      <TruckFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingTruck(undefined)
        }}
        onSubmit={handleAddTruck}
        initialData={editingTruck}
        drivers={mockDrivers}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Truck</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this truck from your fleet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
