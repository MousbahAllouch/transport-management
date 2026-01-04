import type { Client, Truck, Driver, Trip, Cost, Payment, ServiceEntry, ClientPurchase } from "./types"

// Mock Clients
export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Constructora San José",
    phone: "+1 555-0101",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "client-2",
    name: "Obras del Norte",
    phone: "+1 555-0102",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "client-3",
    name: "Pavimentos Express",
    phone: "+1 555-0103",
    createdAt: new Date("2024-03-10"),
  },
]

// Mock Trucks
export const mockTrucks: Truck[] = []

// Mock Drivers
export const mockDrivers: Driver[] = []

// Mock Trips (last 30 days of data)
export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    clientId: "client-1",
    truckId: "truck-1",
    driverId: "driver-1",
    date: new Date("2025-01-03"),
    serviceType: "material_transport",
    material: "Gravel",
    quantity: "20 tons",
    origin: "Quarry North",
    destination: "123 Industrial Ave",
    distance: 45,
    amount: 1200,
    tips: 50,
    collected: 1250,
    notes: "Delivered on time",
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "trip-2",
    clientId: "client-3",
    truckId: "truck-2",
    driverId: "driver-2",
    date: new Date("2025-01-03"),
    serviceType: "transport_only",
    origin: "Client Warehouse",
    destination: "789 Highway Road",
    distance: 32,
    amount: 800,
    tips: 30,
    collected: 830,
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "trip-3",
    clientId: "client-2",
    truckId: "truck-1",
    driverId: "driver-1",
    date: new Date("2025-01-02"),
    serviceType: "material_transport",
    material: "Sand",
    quantity: "18 tons",
    origin: "Sand Pit East",
    destination: "456 Construction Blvd",
    distance: 28,
    amount: 950,
    tips: 40,
    collected: 990,
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "trip-4",
    clientId: "client-4",
    truckId: "truck-2",
    driverId: "driver-2",
    date: new Date("2025-01-02"),
    serviceType: "material_transport",
    material: "Concrete blocks",
    quantity: "15 tons",
    origin: "Block Factory",
    destination: "321 Main Street",
    distance: 52,
    amount: 1400,
    tips: 60,
    collected: 1460,
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "trip-5",
    clientId: "client-1",
    truckId: "truck-1",
    driverId: "driver-1",
    date: new Date("2025-01-01"),
    serviceType: "transport_only",
    origin: "Client Site A",
    destination: "Client Site B",
    distance: 38,
    amount: 750,
    tips: 25,
    collected: 775,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "trip-6",
    clientId: "client-5",
    truckId: "truck-2",
    driverId: "driver-2",
    date: new Date("2025-01-01"),
    serviceType: "material_transport",
    material: "Gravel",
    quantity: "22 tons",
    origin: "Quarry South",
    destination: "654 Urban Plaza",
    distance: 41,
    amount: 1100,
    tips: 45,
    collected: 1145,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "trip-7",
    clientId: "client-4",
    truckId: "truck-1",
    driverId: "driver-1",
    date: new Date("2024-12-31"),
    serviceType: "material_transport",
    material: "Sand",
    quantity: "20 tons",
    origin: "Sand Pit West",
    destination: "321 Main Street",
    distance: 35,
    amount: 1050,
    tips: 35,
    collected: 1085,
    createdAt: new Date("2024-12-31"),
  },
  {
    id: "trip-8",
    clientId: "client-2",
    truckId: "truck-2",
    driverId: "driver-2",
    date: new Date("2024-12-31"),
    serviceType: "material_transport",
    material: "Crushed stone",
    quantity: "19 tons",
    origin: "Stone Crusher",
    destination: "456 Construction Blvd",
    distance: 29,
    amount: 980,
    tips: 40,
    collected: 1020,
    createdAt: new Date("2024-12-31"),
  },
]

// Mock Costs
export const mockCosts: Cost[] = [
  {
    id: "cost-1",
    date: new Date("2025-01-03"),
    amount: 350,
    category: "diesel",
    truckId: "truck-1",
    driverId: "driver-1",
    description: "Full tank refill",
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "cost-2",
    date: new Date("2025-01-03"),
    amount: 320,
    category: "diesel",
    truckId: "truck-2",
    driverId: "driver-2",
    description: "Full tank refill",
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "cost-3",
    date: new Date("2025-01-02"),
    amount: 180,
    category: "diesel",
    truckId: "truck-1",
    driverId: "driver-1",
    description: "Partial refill",
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "cost-4",
    date: new Date("2025-01-01"),
    amount: 450,
    category: "maintenance",
    truckId: "truck-1",
    description: "Oil change and filter replacement",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "cost-5",
    date: new Date("2024-12-30"),
    amount: 1200,
    category: "tires",
    truckId: "truck-2",
    description: "New front tires",
    createdAt: new Date("2024-12-30"),
  },
  {
    id: "cost-6",
    date: new Date("2024-12-28"),
    amount: 85,
    category: "tolls",
    truckId: "truck-1",
    description: "Highway tolls - December",
    createdAt: new Date("2024-12-28"),
  },
  {
    id: "cost-7",
    date: new Date("2024-12-25"),
    amount: 2500,
    category: "repairs",
    truckId: "truck-2",
    description: "Brake system repair",
    createdAt: new Date("2024-12-25"),
  },
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    clientId: "client-1",
    date: new Date("2025-01-02"),
    amount: 5000,
    method: "transfer",
    reference: "TRF-2025-001",
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "payment-2",
    clientId: "client-4",
    date: new Date("2025-01-01"),
    amount: 8000,
    method: "check",
    reference: "CHK-4521",
    notes: "Monthly payment",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "payment-3",
    clientId: "client-3",
    date: new Date("2024-12-28"),
    amount: 3000,
    method: "cash",
    notes: "Partial payment",
    createdAt: new Date("2024-12-28"),
  },
  {
    id: "payment-4",
    clientId: "client-2",
    date: new Date("2024-12-20"),
    amount: 10000,
    method: "transfer",
    reference: "TRF-2024-089",
    createdAt: new Date("2024-12-20"),
  },
]

// Mock Client Purchases
export const mockClientPurchases: ClientPurchase[] = [
  {
    id: "purchase-1",
    clientId: "client-1",
    truckId: "truck-1",
    driverId: "driver-1",
    serviceType: "goods",
    date: new Date("2025-01-03"),
    amount: 1200,
    goodsType: "Gravel",
    description: "20 tons of gravel for foundation",
    createdAt: new Date("2025-01-03"),
  },
  {
    id: "purchase-2",
    clientId: "client-1",
    truckId: "truck-2",
    driverId: "driver-2",
    serviceType: "transport",
    date: new Date("2025-01-02"),
    amount: 800,
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "purchase-3",
    clientId: "client-2",
    truckId: "truck-1",
    driverId: "driver-1",
    serviceType: "goods",
    date: new Date("2025-01-01"),
    amount: 950,
    goodsType: "Sand",
    description: "18 tons of sand",
    createdAt: new Date("2025-01-01"),
  },
]

// Mock Client Payments
export const mockClientPayments: Payment[] = [
  {
    id: "payment-1",
    clientId: "client-1",
    date: new Date("2025-01-02"),
    amount: 1500,
    method: "cash",
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "payment-2",
    clientId: "client-1",
    date: new Date("2024-12-28"),
    amount: 500,
    method: "transfer",
    createdAt: new Date("2024-12-28"),
  },
]

// Mock Service Entries
export const mockServiceEntries: ServiceEntry[] = []

// Helper functions to get related data
export function getClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id)
}

export function getTruckById(id: string): Truck | undefined {
  return mockTrucks.find((t) => t.id === id)
}

export function getDriverById(id: string): Driver | undefined {
  return mockDrivers.find((d) => d.id === id)
}

export function getPurchasesByClient(clientId: string): ClientPurchase[] {
  return mockClientPurchases.filter((p) => p.clientId === clientId)
}

export function getPaymentsByClient(clientId: string): Payment[] {
  return mockClientPayments.filter((p) => p.clientId === clientId)
}

export function getTripsByDriver(driverId: string): Trip[] {
  return mockTrips.filter((t) => t.driverId === driverId)
}

export function getTripsByTruck(truckId: string): Trip[] {
  return mockTrips.filter((t) => t.truckId === truckId)
}

export function getCostsByTruck(truckId: string): Cost[] {
  return mockCosts.filter((c) => c.truckId === truckId)
}
