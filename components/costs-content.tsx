"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Fuel, Wrench, CircleDot } from "lucide-react"
import { mockCosts, mockTrucks, mockDrivers, getTruckById, getDriverById } from "@/lib/mock-data"
import type { Cost } from "@/lib/types"
import { CostFormDialog } from "./cost-form-dialog"
import { StatsCard } from "./stats-card"
import { DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const categoryIcons: Record<string, typeof Fuel> = {
  diesel: Fuel,
  maintenance: Wrench,
  repairs: Wrench,
  tires: CircleDot,
  oil: CircleDot,
  tolls: CircleDot,
  other: CircleDot,
}

const categoryColors: Record<string, string> = {
  diesel: "bg-chart-1/20 text-chart-1",
  maintenance: "bg-chart-2/20 text-chart-2",
  repairs: "bg-destructive/20 text-destructive",
  tires: "bg-chart-3/20 text-chart-3",
  oil: "bg-chart-4/20 text-chart-4",
  tolls: "bg-chart-5/20 text-chart-5",
  other: "bg-muted text-muted-foreground",
}

export function CostsContent() {
  const [costs, setCosts] = useState<Cost[]>(mockCosts)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCost, setEditingCost] = useState<Cost | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterTruck, setFilterTruck] = useState<string>("all")

  const filteredCosts = costs.filter((cost) => {
    if (filterCategory !== "all" && cost.category !== filterCategory) return false
    if (filterTruck !== "all" && cost.truckId !== filterTruck) return false
    return true
  })

  const totalCosts = filteredCosts.reduce((acc, c) => acc + c.amount, 0)
  const dieselCosts = filteredCosts.filter((c) => c.category === "diesel").reduce((acc, c) => acc + c.amount, 0)
  const maintenanceCosts = filteredCosts
    .filter((c) => c.category === "maintenance" || c.category === "repairs")
    .reduce((acc, c) => acc + c.amount, 0)
  const otherCosts = totalCosts - dieselCosts - maintenanceCosts

  const columns = [
    {
      key: "date",
      header: "Date",
      cell: (cost: Cost) => {
        const Icon = categoryIcons[cost.category] || CircleDot
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Icon className="h-5 w-5 text-destructive" />
            </div>
            <span>{cost.date.toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      key: "category",
      header: "Category",
      cell: (cost: Cost) => (
        <Badge variant="secondary" className={categoryColors[cost.category]}>
          {cost.category.charAt(0).toUpperCase() + cost.category.slice(1)}
        </Badge>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (cost: Cost) => <span className="max-w-[200px] truncate">{cost.description}</span>,
    },
    {
      key: "truck",
      header: "Truck",
      cell: (cost: Cost) => {
        if (!cost.truckId) return <span className="text-muted-foreground">-</span>
        const truck = getTruckById(cost.truckId)
        return <span>{truck?.licensePlate}</span>
      },
    },
    {
      key: "driver",
      header: "Driver",
      cell: (cost: Cost) => {
        if (!cost.driverId) return <span className="text-muted-foreground">-</span>
        const driver = getDriverById(cost.driverId)
        return <span>{driver?.name}</span>
      },
    },
    {
      key: "amount",
      header: "Amount",
      cell: (cost: Cost) => <span className="font-medium text-destructive">${cost.amount.toLocaleString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (cost: Cost) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingCost(cost)
              setDialogOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(cost.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const handleAddCost = (data: Omit<Cost, "id" | "createdAt">) => {
    if (editingCost) {
      setCosts(costs.map((c) => (c.id === editingCost.id ? { ...c, ...data } : c)))
    } else {
      const cost: Cost = {
        ...data,
        id: `cost-${Date.now()}`,
        createdAt: new Date(),
      }
      setCosts([cost, ...costs])
    }
    setDialogOpen(false)
    setEditingCost(undefined)
  }

  const handleDelete = () => {
    if (deleteId) {
      setCosts(costs.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Costs</h1>
          <p className="text-muted-foreground">Track all expenses and costs</p>
        </div>
        <Button
          onClick={() => {
            setEditingCost(undefined)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Costs"
          value={`$${totalCosts.toLocaleString()}`}
          icon={DollarSign}
          className="border-l-2 border-l-destructive"
        />
        <StatsCard title="Diesel / Fuel" value={`$${dieselCosts.toLocaleString()}`} icon={Fuel} />
        <StatsCard title="Maintenance & Repairs" value={`$${maintenanceCosts.toLocaleString()}`} icon={Wrench} />
        <StatsCard title="Other Expenses" value={`$${otherCosts.toLocaleString()}`} icon={CircleDot} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="diesel">Diesel / Fuel</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="repairs">Repairs</SelectItem>
            <SelectItem value="tires">Tires</SelectItem>
            <SelectItem value="oil">Oil</SelectItem>
            <SelectItem value="tolls">Tolls</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterTruck} onValueChange={setFilterTruck}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by truck" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trucks</SelectItem>
            {mockTrucks.map((truck) => (
              <SelectItem key={truck.id} value={truck.id}>
                {truck.licensePlate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredCosts} columns={columns} />

      <CostFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingCost(undefined)
        }}
        onSubmit={handleAddCost}
        initialData={editingCost}
        trucks={mockTrucks}
        drivers={mockDrivers}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense record? This action cannot be undone.
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
