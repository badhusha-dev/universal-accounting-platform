// API Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  businessName: string;
  businessType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentId?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Tenant Types
export interface CreateTenantRequest {
  businessName: string;
  businessType: string;
}

export interface CreateTenantResponse {
  tenant: Tenant;
  message: string;
}

// Business Types
export const BUSINESS_TYPES = [
  'Retail',
  'Restaurant', 
  'Freelancer',
  'School',
  'Logistics',
  'Hospital',
  'Construction',
  'Farm',
  'Events',
  'NGO'
] as const;

export type BusinessType = typeof BUSINESS_TYPES[number];

// API Error Types
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
