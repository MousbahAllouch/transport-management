"use client"

import { useState, useEffect } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, UserCircle, Loader2 } from "lucide-react"
import { driversApi, trucksApi, tripsApi } from "@/lib/api"
import type { Driver } from "@/lib/types"
import { DriverFormDialog } from "./driver-form-dialog"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export function DriversContent() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  // Load drivers and trucks on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [driversData, trucksData] = await Promise.all([
        driversApi.getAll(),
        trucksApi.getAll()
      ])
      setDrivers(driversData)
      setTrucks(trucksData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load drivers. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
            <p className="text-xs text-muted-foreground">{driver.licenseNumber || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (driver: Driver) => (
        <div className="space-y-1">
          <p className="text-sm">{driver.email || 'N/A'}</p>
          <p className="text-xs text-muted-foreground">{driver.phone || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: "truck",
      header: "Assigned Truck",
      cell: (driver: Driver) => {
        const truck = trucks.find((t) => t.id === driver.assignedTruckId)
        return truck ? (
          <span className="font-medium">{truck.license_plate}</span>
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )
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

  const handleAddDriver = async (data: Omit<Driver, "id" | "createdAt">) => {
    try {
      const payload = {
        name: data.name,
        license_number: data.licenseNumber,
        email: data.email,
        phone: data.phone,
        assigned_truck_id: data.assignedTruckId
      }

      if (editingDriver) {
        await driversApi.update(editingDriver.id, payload)
        toast({
          title: "Success",
          description: "Driver updated successfully"
        })
      } else {
        await driversApi.create(payload)
        toast({
          title: "Success",
          description: "Driver added successfully"
        })
      }

      await loadData()
      setDialogOpen(false)
      setEditingDriver(undefined)
    } catch (error) {
      console.error('Error saving driver:', error)
      toast({
        title: "Error",
        description: "Failed to save driver. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await driversApi.delete(deleteId)
      toast({
        title: "Success",
        description: "Driver deleted successfully"
      })
      await loadData()
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast({
        title: "Error",
        description: "Failed to delete driver. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
        trucks={trucks}
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
