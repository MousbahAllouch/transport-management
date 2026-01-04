"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DriversContent } from "./drivers-content"
import { TrucksContent } from "./trucks-content"
import { UserCircle, Truck } from "lucide-react"

export function FleetContent() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Fleet Management</h1>
        <p className="text-muted-foreground text-sm">Manage your drivers and trucks</p>
      </div>

      {/* Tabs for Drivers and Trucks */}
      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="trucks" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Trucks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <DriversContent />
        </TabsContent>

        <TabsContent value="trucks">
          <TrucksContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
