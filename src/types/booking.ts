import { AuditFields, ID } from "./common";

export type BookingStatus = "pending" | "approved" | "checked_in" | "completed" | "rejected" | "cancelled";

export interface Booking extends AuditFields {
  id: ID;
  vehicleId: ID;
  driverId: ID;
  vehicleRegNo?: string;
  driverName?: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  odometerStart?: number;
  odometerEnd?: number;
  checkInAt?: string;
  checkOutAt?: string;
}
