import { AuditFields, ID } from "./common";

export type DriverStatus = "active" | "suspended";

export interface Driver extends AuditFields {
  id: ID;
  name: string;
  licenseNo: string;
  license_type: string;
  licenseExpiry: string;
  department: string;
  status: DriverStatus;
  fineCount: number;
  accidentCount: number;
  image_path?: string;
  phone: string;
  email: string;
  ic_no: string;
  joinedAt: string;
}
