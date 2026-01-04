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
import type { Cost, Truck, Driver } from "@/lib/types"

type CostCategory = "diesel" | "maintenance" | "repairs" | "tires" | "oil" | "tolls" | "other"

interface CostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (cost: Omit<Cost, "id" | "createdAt">) => void
  initialData?: Cost
  trucks: Truck[]
  drivers: Driver[]
}

export function CostFormDialog({ open, onOpenChange, onSubmit, initialData, trucks, drivers }: CostFormDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: 0,
    category: "diesel" as CostCategory,
    truckId: undefined as string | undefined,
    driverId: undefined as string | undefined,
    description: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        amount: initialData.amount,
        category: initialData.category,
        truckId: initialData.truckId,
        driverId: initialData.driverId,
        description: initialData.description,
      })
    } else {
      setFormData({
        date: new Date(),
        amount: 0,
        category: "diesel",
        truckId: undefined,
        driverId: undefined,
        description: "",
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
          <DialogTitle>{initialData ? "Edit Expense" : "Add New Expense"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update expense details" : "Record a new cost or expense"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.toISOString().split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  className="bg-secondary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="bg-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: CostCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel / Fuel</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repairs">Repairs</SelectItem>
                  <SelectItem value="tires">Tires</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="tolls">Tolls</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="truck">Truck (Optional)</Label>
              <Select
                value={formData.truckId || "none"}
                onValueChange={(value) => setFormData({ ...formData, truckId: value === "none" ? undefined : value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not assigned</SelectItem>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="driver">Driver (Optional)</Label>
              <Select
                value={formData.driverId || "none"}
                onValueChange={(value) => setFormData({ ...formData, driverId: value === "none" ? undefined : value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not assigned</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-secondary"
                placeholder="Brief description of the expense"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {initialData ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
