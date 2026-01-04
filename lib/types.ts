// Core data types for the construction transport management system

export type ServiceType = "repair" | "diesel" | "driver_portion" | "material_transport" | "transport_only" | "both"
export type TruckStatus = "active" | "maintenance" | "inactive"
export type PaymentStatus = "pending" | "partial" | "paid"

export interface Client {
  id: string
  name: string
  phone: string
  createdAt: Date
}

export interface Truck {
  id: string
  name: string
  licensePlate: string
  model?: string
  capacity?: string
  status: TruckStatus
  assignedDriverId?: string
  createdAt: Date
}

export interface Driver {
  id: string
  name: string
  licenseNumber?: string
  email?: string
  phone?: string
  assignedTruckId: string | null
  createdAt: Date
}

export interface Trip {
  id: string
  clientId: string
  truckId: string
  driverId: string
  date: Date
  serviceType: "material_transport" | "transport_only"
  material?: string
  quantity?: string
  origin: string
  destination: string
  distance?: number
  amount: number
  tips: number
  collected: number
  notes?: string
  createdAt: Date
}

export interface Cost {
  id: string
  date: Date
  amount: number
  category: "diesel" | "maintenance" | "repairs" | "tires" | "oil" | "tolls" | "other"
  truckId?: string
  driverId?: string
  description: string
  createdAt: Date
}

export interface Payment {
  id: string
  clientId: string
  date: Date
  amount: number
  method: "cash" | "transfer" | "check"
  reference?: string
  notes?: string
  createdAt: Date
}

export interface DailyDriverSummary {
  driverId: string
  driverName: string
  truckId: string
  truckPlate: string
  date: Date
  totalTrips: number
  totalRevenue: number
  totalTips: number
  totalCollected: number
  totalDiesel: number
  netResult: number
}

export interface ServiceEntry {
  id: string
  serviceType: ServiceType
  truckId: string
  driverId: string
  amount: number
  date: Date
  // For repair
  description?: string
  // For diesel
  liters?: number
  createdAt: Date
}

export interface ClientPurchase {
  id: string
  clientId: string
  truckId: string
  driverId: string
  serviceType: "transport" | "goods"
  date: Date
  amount: number
  // For goods
  goodsType?: string
  description?: string
  createdAt: Date
}
