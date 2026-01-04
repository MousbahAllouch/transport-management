"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, UserCircle } from "lucide-react"
import { mockDrivers, mockTrucks, getTripsByDriver } from "@/lib/mock-data"
import type { Driver } from "@/lib/types"
import { DriverFormDialog } from "./driver-form-dialog"
import { StatsCard } from "./stats-card"
import Link from "next/link"
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

export function DriversContent() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const assignedDrivers = drivers.filter((d) => d.assignedTruckId).length

  const columns = [
    {
      key: "name",
      header: "Driver",
      cell: (driver: Driver) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{driver.name}</p>
            <p className="text-xs text-muted-foreground">{driver.licenseNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (driver: Driver) => (
        <div className="space-y-1">
          <p className="text-sm">{driver.email}</p>
          <p className="text-xs text-muted-foreground">{driver.phone}</p>
        </div>
      ),
    },
    {
      key: "truck",
      header: "Assigned Truck",
      cell: (driver: Driver) => {
        const truck = mockTrucks.find((t) => t.id === driver.assignedTruckId)
        return truck ? (
          <span className="font-medium">{truck.licensePlate}</span>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )
      },
    },
    {
      key: "trips",
      header: "Total Trips",
      cell: (driver: Driver) => getTripsByDriver(driver.id).length,
    },
    {
      key: "revenue",
      header: "Total Revenue",
      cell: (driver: Driver) => {
        const trips = getTripsByDriver(driver.id)
        const total = trips.reduce((acc, t) => acc + t.amount, 0)
        return <span className="font-medium">${total.toLocaleString()}</span>
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (driver: Driver) => (
        <div className="flex items-center gap-2">
          <Link href={`/drivers/${driver.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingDriver(driver)
              setDialogOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(driver.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const handleAddDriver = (data: Omit<Driver, "id" | "createdAt">) => {
    if (editingDriver) {
      setDrivers(drivers.map((d) => (d.id === editingDriver.id ? { ...d, ...data } : d)))
    } else {
      const driver: Driver = {
        ...data,
        id: `driver-${Date.now()}`,
        createdAt: new Date(),
      }
      setDrivers([...drivers, driver])
    }
    setDialogOpen(false)
    setEditingDriver(undefined)
  }

  const handleDelete = () => {
    if (deleteId) {
      setDrivers(drivers.filter((d) => d.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setEditingDriver(undefined)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      <DataTable data={drivers} columns={columns} searchKey="name" searchPlaceholder="Search drivers..." />

      <DriverFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingDriver(undefined)
        }}
        onSubmit={handleAddDriver}
        initialData={editingDriver}
        trucks={mockTrucks}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this driver? This action cannot be undone.
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
