export const APP_NAME = "Fleet Management System";
export const APP_TAGLINE = "Enterprise Vehicle Management";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const AUTH_TOKEN_KEY = "fleetiq_token";
export const THEME_KEY = "fleetiq_theme";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 25, 50, 100],
};

export const ALERT_THRESHOLDS = {
  EXPIRY_STANDARD_DAYS: 30,
  EXPIRY_URGENT_DAYS: 7,
  SERVICE_STANDARD_DAYS: 30,
  SERVICE_URGENT_DAYS: 7,
  SERVICE_KM_THRESHOLD: 1000,
  SERVICE_KM_URGENT: 500,
};

export const VEHICLE_STATUS = {
  available: { label: "Available", tone: "success" },
  in_use: { label: "In Use", tone: "info" },
  maintenance: { label: "Maintenance", tone: "warning" },
  disposed: { label: "Disposed", tone: "destructive" },
} as const;

export const DRIVER_STATUS = {
  active: { label: "Active", tone: "success" },
  suspended: { label: "Suspended", tone: "destructive" },
} as const;

export const BOOKING_STATUS = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "info" },
  "in-use": { label: "In Use", tone: "info" },
  checked_in: { label: "In Use", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  rejected: { label: "Rejected", tone: "destructive" },
  cancelled: { label: "Cancelled", tone: "muted" },
} as const;

export const MAINTENANCE_STATUS = {
  scheduled: { label: "Scheduled", tone: "info" },
  in_progress: { label: "In Progress", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
} as const;

export const CLAIM_STATUS = {
  pending: { label: "Pending", tone: "muted" },
  in_review: { label: "In Review", tone: "warning" },
  approved: { label: "Approved", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  rejected: { label: "Rejected", tone: "destructive" },
} as const;

export const FINE_STATUS = {
  unpaid: { label: "Unpaid", tone: "destructive" },
  paid: { label: "Paid", tone: "success" },
  appealed: { label: "Appealed", tone: "warning" },
} as const;

export const DISPOSAL_STATUS = {
  pending_evaluation: { label: "Pending Evaluation", tone: "muted" },
  pending_approval: { label: "Pending Approval", tone: "warning" },
  approved: { label: "Approved", tone: "info" },
  executed: { label: "Executed", tone: "success" },
  rejected: { label: "Rejected", tone: "destructive" },
} as const;

export const DEPARTMENTS = ["Management", "Operations", "Finance", "HR", "IT", "IT Support", "EXCO", "Logistics", "Engineering"];
export const VEHICLE_TYPES = ["Car", "Sedan", "SUV", "Van", "Truck", "Pickup", "Bus"];
export const VEHICLE_BRANDS = ["Toyota", "Honda", "Proton", "Perodua", "Mercedes", "BMW", "Isuzu", "Mitsubishi"];
