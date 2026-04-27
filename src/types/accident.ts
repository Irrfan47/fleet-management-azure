import { AuditFields, ID } from "./common";

export type ClaimStatus = "pending" | "in_review" | "approved" | "completed" | "rejected";
export type FineStatus = "unpaid" | "paid" | "appealed";

export interface Accident extends AuditFields {
  id: ID;
  vehicleId: ID;
  driverId: ID;
  vehicleRegNo?: string;
  driverName?: string;
  date: string;
  location: string;
  description: string;
  claimStatus: ClaimStatus;
  claimProgress: number; // 0-100
  policeReportUrl?: string;
  estimatedCost: number;
}

export interface Fine extends AuditFields {
  id: ID;
  driverId: ID;
  vehicleId: ID;
  driverName?: string;
  vehicleRegNo?: string;
  offence: string;
  amount: number;
  date: string;
  status: FineStatus;
  ticketNo: string;
}
