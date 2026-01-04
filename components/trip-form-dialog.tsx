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
import { Textarea } from "@/components/ui/textarea"
import type { Trip, Client, Driver, Truck } from "@/lib/types"

interface TripFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (trip: Omit<Trip, "id" | "createdAt">) => void
  initialData?: Trip
  clients: Client[]
  drivers: Driver[]
  trucks: Truck[]
}

export function TripFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  clients,
  drivers,
  trucks,
}: TripFormDialogProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    truckId: "",
    driverId: "",
    date: new Date(),
    serviceType: "material_transport" as "material_transport" | "transport_only",
    material: "",
    quantity: "",
    origin: "",
    destination: "",
    distance: 0,
    amount: 0,
    tips: 0,
    collected: 0,
    notes: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId,
        truckId: initialData.truckId,
        driverId: initialData.driverId,
        date: initialData.date,
        serviceType: initialData.serviceType,
        material: initialData.material || "",
        quantity: initialData.quantity || "",
        origin: initialData.origin,
        destination: initialData.destination,
        distance: initialData.distance || 0,
        amount: initialData.amount,
        tips: initialData.tips,
        collected: initialData.collected,
        notes: initialData.notes || "",
      })
    } else {
      setFormData({
        clientId: "",
        truckId: "",
        driverId: "",
        date: new Date(),
        serviceType: "material_transport",
        material: "",
        quantity: "",
        origin: "",
        destination: "",
        distance: 0,
        amount: 0,
        tips: 0,
        collected: 0,
        notes: "",
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Trip" : "Record New Trip"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update trip details" : "Enter the details for this transport job"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver">Driver</Label>
                <Select
                  value={formData.driverId}
                  onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="truck">Truck</Label>
                <Select
                  value={formData.truckId}
                  onValueChange={(value) => setFormData({ ...formData, truckId: value })}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Select truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id}>
                        {truck.licensePlate} - {truck.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value: "material_transport" | "transport_only") =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material_transport">Material + Transport</SelectItem>
                  <SelectItem value="transport_only">Transport Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.serviceType === "material_transport" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="bg-secondary"
                    placeholder="Gravel, Sand, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="bg-secondary"
                    placeholder="20 tons"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="bg-secondary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="bg-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="tips">Tips ($)</Label>
                <Input
                  id="tips"
                  type="number"
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: Number(e.target.value) })}
                  className="bg-secondary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collected">Collected ($)</Label>
                <Input
                  id="collected"
                  type="number"
                  value={formData.collected}
                  onChange={(e) => setFormData({ ...formData, collected: Number(e.target.value) })}
                  className="bg-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-secondary"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {initialData ? "Save Changes" : "Record Trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
