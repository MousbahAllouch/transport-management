"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockTrucks, mockDrivers } from "@/lib/mock-data"
import { Wrench, Fuel, User, CheckCircle, ChevronLeft } from "lucide-react"

type ServiceType = "repair" | "diesel" | "driver_portion" | null

export function InputContent() {
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [truckId, setTruckId] = useState("")
  const [driverId, setDriverId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [liters, setLiters] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entry = {
      id: `entry-${Date.now()}`,
      serviceType,
      truckId,
      driverId,
      amount: Number.parseFloat(amount),
      date: new Date(date),
      description: serviceType === "repair" ? description : undefined,
      liters: serviceType === "diesel" ? Number.parseFloat(liters) : undefined,
      createdAt: new Date(),
    }

    console.log("New service entry:", entry)
    setSubmitted(true)

    setTimeout(() => {
      setServiceType(null)
      setTruckId("")
      setDriverId("")
      setAmount("")
      setDate("")
      setDescription("")
      setLiters("")
      setSubmitted(false)
    }, 2000)
  }

  const resetForm = () => {
    setServiceType(null)
    setTruckId("")
    setDriverId("")
    setAmount("")
    setDate("")
    setDescription("")
    setLiters("")
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Saved!</h2>
          <p className="text-muted-foreground mt-1">Entry recorded successfully</p>
        </div>
      </div>
    )
  }

  if (!serviceType) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Add Entry</h1>
          <p className="text-muted-foreground text-sm mt-1">Select service type</p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setServiceType("repair")}
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 active:bg-primary/10 transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/20">
              <Wrench className="h-7 w-7 text-orange-500" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground text-lg">Repair</span>
              <p className="text-muted-foreground text-sm">Record repair costs</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setServiceType("diesel")}
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 active:bg-primary/10 transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20">
              <Fuel className="h-7 w-7 text-blue-500" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground text-lg">Filling Diesel</span>
              <p className="text-muted-foreground text-sm">Record fuel purchases</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setServiceType("driver_portion")}
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 active:bg-primary/10 transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/20">
              <User className="h-7 w-7 text-green-500" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground text-lg">Driver Portion</span>
              <p className="text-muted-foreground text-sm">Record driver payments</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  const serviceLabels = {
    repair: { title: "Repair", icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/20" },
    diesel: { title: "Filling Diesel", icon: Fuel, color: "text-blue-500", bg: "bg-blue-500/20" },
    driver_portion: { title: "Driver Portion", icon: User, color: "text-green-500", bg: "bg-green-500/20" },
  }

  const currentService = serviceLabels[serviceType]
  const ServiceIcon = currentService.icon

  return (
    <div className="flex flex-col gap-5">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${currentService.bg}`}>
            <ServiceIcon className={`h-5 w-5 ${currentService.color}`} />
          </div>
          <h1 className="text-lg font-bold text-foreground">{currentService.title}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Truck Selection */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="truck" className="text-sm font-medium">
            Truck
          </Label>
          <Select value={truckId} onValueChange={setTruckId} required>
            <SelectTrigger id="truck" className="h-12 text-base">
              <SelectValue placeholder="Select truck" />
            </SelectTrigger>
            <SelectContent>
              {mockTrucks.map((truck) => (
                <SelectItem key={truck.id} value={truck.id} className="py-3">
                  {truck.name} ({truck.licensePlate})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Driver Selection */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="driver" className="text-sm font-medium">
            Driver
          </Label>
          <Select value={driverId} onValueChange={setDriverId} required>
            <SelectTrigger id="driver" className="h-12 text-base">
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              {mockDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id} className="py-3">
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount - always shown */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount ($)
          </Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        {/* Liters - only for diesel */}
        {serviceType === "diesel" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="liters" className="text-sm font-medium">
              Liters
            </Label>
            <Input
              id="liters"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              className="h-12 text-lg"
              required
            />
          </div>
        )}

        {/* Description - only for repair */}
        {serviceType === "repair" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the repair..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-base"
              required
            />
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>

        {/* Submit Button - large and prominent */}
        <Button type="submit" className="h-14 text-lg font-semibold mt-2">
          Save Entry
        </Button>
      </form>
    </div>
  )
}
