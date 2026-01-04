// API Client for Transport Management System

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.error?.message || error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Drivers API
export const driversApi = {
  getAll: () => apiRequest<any[]>('/drivers'),
  getById: (id: string) => apiRequest<any>(`/drivers/${id}`),
  create: (data: any) => apiRequest<any>('/drivers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/drivers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/drivers/${id}`, {
    method: 'DELETE',
  }),
};

// Trucks API
export const trucksApi = {
  getAll: () => apiRequest<any[]>('/trucks'),
  getById: (id: string) => apiRequest<any>(`/trucks/${id}`),
  create: (data: any) => apiRequest<any>('/trucks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/trucks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/trucks/${id}`, {
    method: 'DELETE',
  }),
};

// Clients API
export const clientsApi = {
  getAll: () => apiRequest<any[]>('/clients'),
  getById: (id: string) => apiRequest<any>(`/clients/${id}`),
  create: (data: any) => apiRequest<any>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// Trips API
export const tripsApi = {
  getAll: (params?: { date?: string; driver_id?: string; client_id?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<any[]>(`/trips${query}`);
  },
  getById: (id: string) => apiRequest<any>(`/trips/${id}`),
  create: (data: any) => apiRequest<any>('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/trips/${id}`, {
    method: 'DELETE',
  }),
};

// Costs API
export const costsApi = {
  getAll: (params?: { date?: string; driver_id?: string; truck_id?: string; category?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<any[]>(`/costs${query}`);
  },
  getById: (id: string) => apiRequest<any>(`/costs/${id}`),
  create: (data: any) => apiRequest<any>('/costs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/costs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/costs/${id}`, {
    method: 'DELETE',
  }),
};

// Payments API
export const paymentsApi = {
  getAll: (params?: { client_id?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<any[]>(`/payments${query}`);
  },
  getById: (id: string) => apiRequest<any>(`/payments/${id}`),
  create: (data: any) => apiRequest<any>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<any>(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<any>(`/payments/${id}`, {
    method: 'DELETE',
  }),
};
