// Local Storage Manager for Transport System
// This allows the app to work immediately without database
// Data persists across browser sessions

import type { Driver, Truck, Client, Trip, Cost, Payment } from './types';

const STORAGE_KEYS = {
  DRIVERS: 'transport_drivers',
  TRUCKS: 'transport_trucks',
  CLIENTS: 'transport_clients',
  TRIPS: 'transport_trips',
  COSTS: 'transport_costs',
  PAYMENTS: 'transport_payments',
};

// Helper to parse dates from JSON
function reviveDates(key: string, value: any) {
  if (key === 'date' || key === 'createdAt' || key === 'updated_at') {
    return value ? new Date(value) : value;
  }
  return value;
}

// Generic storage functions
function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, reviveDates) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Drivers
export const driversStorage = {
  getAll: (): Driver[] => getItems<Driver>(STORAGE_KEYS.DRIVERS),
  save: (drivers: Driver[]) => setItems(STORAGE_KEYS.DRIVERS, drivers),
  add: (driver: Omit<Driver, 'id' | 'createdAt'>): Driver => {
    const drivers = driversStorage.getAll();
    const newDriver: Driver = {
      ...driver,
      id: `driver-${Date.now()}`,
      createdAt: new Date(),
    };
    drivers.push(newDriver);
    driversStorage.save(drivers);
    return newDriver;
  },
  update: (id: string, updates: Partial<Driver>): Driver | null => {
    const drivers = driversStorage.getAll();
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) return null;
    drivers[index] = { ...drivers[index], ...updates };
    driversStorage.save(drivers);
    return drivers[index];
  },
  delete: (id: string): boolean => {
    const drivers = driversStorage.getAll();
    const filtered = drivers.filter(d => d.id !== id);
    if (filtered.length === drivers.length) return false;
    driversStorage.save(filtered);
    return true;
  },
};

// Trucks
export const trucksStorage = {
  getAll: (): Truck[] => getItems<Truck>(STORAGE_KEYS.TRUCKS),
  save: (trucks: Truck[]) => setItems(STORAGE_KEYS.TRUCKS, trucks),
  add: (truck: Omit<Truck, 'id' | 'createdAt'>): Truck => {
    const trucks = trucksStorage.getAll();
    const newTruck: Truck = {
      ...truck,
      id: `truck-${Date.now()}`,
      createdAt: new Date(),
    };
    trucks.push(newTruck);
    trucksStorage.save(trucks);
    return newTruck;
  },
  update: (id: string, updates: Partial<Truck>): Truck | null => {
    const trucks = trucksStorage.getAll();
    const index = trucks.findIndex(t => t.id === id);
    if (index === -1) return null;
    trucks[index] = { ...trucks[index], ...updates };
    trucksStorage.save(trucks);
    return trucks[index];
  },
  delete: (id: string): boolean => {
    const trucks = trucksStorage.getAll();
    const filtered = trucks.filter(t => t.id !== id);
    if (filtered.length === trucks.length) return false;
    trucksStorage.save(filtered);
    return true;
  },
};

// Clients
export const clientsStorage = {
  getAll: (): Client[] => getItems<Client>(STORAGE_KEYS.CLIENTS),
  save: (clients: Client[]) => setItems(STORAGE_KEYS.CLIENTS, clients),
  add: (client: Omit<Client, 'id' | 'createdAt'>): Client => {
    const clients = clientsStorage.getAll();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date(),
    };
    clients.push(newClient);
    clientsStorage.save(clients);
    return newClient;
  },
  update: (id: string, updates: Partial<Client>): Client | null => {
    const clients = clientsStorage.getAll();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    clients[index] = { ...clients[index], ...updates };
    clientsStorage.save(clients);
    return clients[index];
  },
  delete: (id: string): boolean => {
    const clients = clientsStorage.getAll();
    const filtered = clients.filter(c => c.id !== id);
    if (filtered.length === clients.length) return false;
    clientsStorage.save(filtered);
    return true;
  },
};

// Trips
export const tripsStorage = {
  getAll: (): Trip[] => getItems<Trip>(STORAGE_KEYS.TRIPS),
  save: (trips: Trip[]) => setItems(STORAGE_KEYS.TRIPS, trips),
  add: (trip: Omit<Trip, 'id' | 'createdAt'>): Trip => {
    const trips = tripsStorage.getAll();
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      createdAt: new Date(),
    };
    trips.push(newTrip);
    tripsStorage.save(trips);
    return newTrip;
  },
  update: (id: string, updates: Partial<Trip>): Trip | null => {
    const trips = tripsStorage.getAll();
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) return null;
    trips[index] = { ...trips[index], ...updates };
    tripsStorage.save(trips);
    return trips[index];
  },
  delete: (id: string): boolean => {
    const trips = tripsStorage.getAll();
    const filtered = trips.filter(t => t.id !== id);
    if (filtered.length === trips.length) return false;
    tripsStorage.save(filtered);
    return true;
  },
};

// Costs
export const costsStorage = {
  getAll: (): Cost[] => getItems<Cost>(STORAGE_KEYS.COSTS),
  save: (costs: Cost[]) => setItems(STORAGE_KEYS.COSTS, costs),
  add: (cost: Omit<Cost, 'id' | 'createdAt'>): Cost => {
    const costs = costsStorage.getAll();
    const newCost: Cost = {
      ...cost,
      id: `cost-${Date.now()}`,
      createdAt: new Date(),
    };
    costs.push(newCost);
    costsStorage.save(costs);
    return newCost;
  },
  update: (id: string, updates: Partial<Cost>): Cost | null => {
    const costs = costsStorage.getAll();
    const index = costs.findIndex(c => c.id === id);
    if (index === -1) return null;
    costs[index] = { ...costs[index], ...updates };
    costsStorage.save(costs);
    return costs[index];
  },
  delete: (id: string): boolean => {
    const costs = costsStorage.getAll();
    const filtered = costs.filter(c => c.id !== id);
    if (filtered.length === costs.length) return false;
    costsStorage.save(filtered);
    return true;
  },
};

// Payments
export const paymentsStorage = {
  getAll: (): Payment[] => getItems<Payment>(STORAGE_KEYS.PAYMENTS),
  save: (payments: Payment[]) => setItems(STORAGE_KEYS.PAYMENTS, payments),
  add: (payment: Omit<Payment, 'id' | 'createdAt'>): Payment => {
    const payments = paymentsStorage.getAll();
    const newPayment: Payment = {
      ...payment,
      id: `payment-${Date.now()}`,
      createdAt: new Date(),
    };
    payments.push(newPayment);
    paymentsStorage.save(payments);
    return newPayment;
  },
  update: (id: string, updates: Partial<Payment>): Payment | null => {
    const payments = paymentsStorage.getAll();
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) return null;
    payments[index] = { ...payments[index], ...updates };
    paymentsStorage.save(payments);
    return payments[index];
  },
  delete: (id: string): boolean => {
    const payments = paymentsStorage.getAll();
    const filtered = payments.filter(p => p.id !== id);
    if (filtered.length === payments.length) return false;
    paymentsStorage.save(filtered);
    return true;
  },
};
