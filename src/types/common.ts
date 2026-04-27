export type ID = string;

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type UserRole = "admin" | "user";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Activity {
  id: ID;
  type: string;
  message: string;
  user: string;
  timestamp: string;
}
