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
  class: VehicleClass;
  odometer: number;
  imageUrl?: string;
}
