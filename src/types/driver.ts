import { AuditFields, ID } from "./common";

export type DriverStatus = "active" | "suspended";

export interface Driver extends AuditFields {
  id: ID;
  name: string;
  licenseNo: string;
  department: string;
  status: DriverStatus;
  fineCount: number;
  accidentCount: number;
  imageUrl?: string;
  phone: string;
  email: string;
}
