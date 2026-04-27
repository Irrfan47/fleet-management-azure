import { AuditFields, ID } from "./common";

export type PolicyType = "insurance" | "road_tax";

export interface InsurancePolicy extends AuditFields {
  id: ID;
  vehicleId: ID;
  vehicleRegNo?: string;
  type: PolicyType;
  policyNo: string;
  provider: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  documentUrl?: string;
}
