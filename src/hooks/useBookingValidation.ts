import type { Booking, Driver, Vehicle } from "@/types";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function useBookingValidation() {
  const validate = (params: {
    vehicle?: Vehicle;
    driver?: Driver;
    startDate: string;
    endDate: string;
    existingBookings: Booking[];
    excludeBookingId?: string;
  }): ValidationResult => {
    const { vehicle, driver, startDate, endDate, existingBookings, excludeBookingId } = params;

    if (!vehicle) return { valid: false, reason: "Please select a vehicle." };
    if (!driver) return { valid: false, reason: "Please select a driver." };
    if (driver.status === "suspended") return { valid: false, reason: `Driver ${driver.name} is currently suspended.` };
    if (vehicle.status === "maintenance") return { valid: false, reason: `Vehicle ${vehicle.regNo} is under maintenance.` };
    if (vehicle.status === "disposed") return { valid: false, reason: `Vehicle ${vehicle.regNo} has been disposed.` };

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return { valid: false, reason: "Invalid date range." };
    if (end < start) return { valid: false, reason: "End date must be after start date." };

    const conflict = existingBookings.find((b) => {
      if (b.id === excludeBookingId) return false;
      if (b.vehicleId !== vehicle.id) return false;
      if (["completed", "rejected", "cancelled"].includes(b.status)) return false;
      const bs = new Date(b.startDate).getTime();
      const be = new Date(b.endDate).getTime();
      return start <= be && end >= bs;
    });
    if (conflict) return { valid: false, reason: `Vehicle is already booked from ${conflict.startDate.slice(0, 10)} to ${conflict.endDate.slice(0, 10)}.` };

    return { valid: true };
  };

  return { validate };
}
