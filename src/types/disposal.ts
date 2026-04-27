import { AuditFields, ID } from "./common";

export type DisposalStatus = "pending_evaluation" | "pending_approval" | "approved" | "executed" | "rejected";
export type DisposalMethod = "sale" | "write_off" | "auction";

export interface Disposal extends AuditFields {
  id: ID;
  vehicleId: ID;
  vehicleRegNo?: string;
  reason: string;
  method: DisposalMethod;
  evaluationValue: number;
  finalValue?: number;
  status: DisposalStatus;
  approvedBy?: string;
  executedAt?: string;
  notes?: string;
}
