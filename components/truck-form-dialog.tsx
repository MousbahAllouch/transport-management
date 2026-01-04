"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Truck, TruckStatus, Driver } from "@/lib/types"

interface TruckFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (truck: Omit<Truck, "id" | "createdAt">) => void
  initialData?: Truck
  drivers: Driver[]
}

export function TruckFormDialog({ open, onOpenChange, onSubmit, initialData, drivers }: TruckFormDialogProps) {
  const [formData, setFormData] = useState({
    licensePlate: "",
    model: "",
    capacity: "",
    status: "active" as TruckStatus,
    assignedDriverId: null as string | null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        licensePlate: initialData.licensePlate,
        model: initialData.model,
        capacity: initialData.capacity,
        status: initialData.status,
        assignedDriverId: initialData.assignedDriverId,
      })
    } else {
      setFormData({
        licensePlate: "",
        model: "",
        capacity: "",
        status: "active",
        assignedDriverId: null,
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Truck" : "Add New Truck"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update truck information" : "Enter the details for the new truck"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="bg-secondary"
                placeholder="TRK-003"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="bg-secondary"
                placeholder="Volvo FH16"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="bg-secondary"
                placeholder="25 tons"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TruckStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="driver">Assigned Driver</Label>
              <Select
                value={formData.assignedDriverId || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedDriverId: value === "none" ? null : value })
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {initialData ? "Save Changes" : "Add Truck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
