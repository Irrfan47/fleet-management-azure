import { AuditFields, ID } from "./common";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed";
export type MaintenanceType = "service" | "repair" | "inspection";

export interface Maintenance extends AuditFields {
  id: ID;
  vehicleId: ID;
  vehicleRegNo?: string;
  type: MaintenanceType;
  scheduledDate: string;
  completedDate?: string;
  odometerAt: number;
  nextServiceOdometer?: number;
  nextServiceDate?: string;
  cost?: number;
  vendor: string;
  status: MaintenanceStatus;
  notes?: string;
  receipt_path?: string;
  vehicle?: {
    regNo: string;
  };
}
