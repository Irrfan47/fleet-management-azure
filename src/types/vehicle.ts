import { AuditFields, ID } from "./common";

export type VehicleStatus = "available" | "in_use" | "maintenance" | "disposed";
export type VehicleClass = "department" | "exco";

export interface Vehicle extends AuditFields {
  id: ID;
  regNo: string;
  type: string;
  brand: string;
  model: string;
  engine: string;
  purchaseDate: string;
  status: VehicleStatus;
  location: string;
  department: string;
  insuranceExpiry: string;
  roadTaxExpiry: string;
  insurance_policy_no?: string;
  insurance_provider?: string;
  insurance_doc_path?: string;
  road_tax_ref?: string;
  road_tax_doc_path?: string;
  class: VehicleClass;
  odometer: number;
  chassisNo: string;
  image_path?: string;
  capacity?: string;
  load?: string;
  next_service_date?: string;
  next_service_odometer?: number;
}
