import { addDays, subDays, formatISO } from "date-fns";
import type { Vehicle, Driver, Booking, Maintenance, InsurancePolicy, Accident, Fine, Disposal, Activity } from "@/types";

const iso = (d: Date) => formatISO(d);
const now = new Date();

export const mockVehicles: Vehicle[] = [
  { id: "v1", regNo: "WPK 1234", type: "SUV", brand: "Toyota", model: "Fortuner", engine: "2.8L Diesel", purchaseDate: iso(subDays(now, 800)), status: "available", location: "HQ Garage", department: "Operations", insuranceExpiry: iso(addDays(now, 45)), roadTaxExpiry: iso(addDays(now, 90)), class: "department", odometer: 45230, createdAt: iso(subDays(now, 800)), updatedAt: iso(now) },
  { id: "v2", regNo: "WXY 5678", type: "Sedan", brand: "Honda", model: "Accord", engine: "2.0L Petrol", purchaseDate: iso(subDays(now, 400)), status: "in_use", location: "Branch A", department: "EXCO", insuranceExpiry: iso(addDays(now, 5)), roadTaxExpiry: iso(addDays(now, 25)), class: "exco", odometer: 22100, createdAt: iso(subDays(now, 400)), updatedAt: iso(now) },
  { id: "v3", regNo: "WAB 9012", type: "Van", brand: "Toyota", model: "Hiace", engine: "2.5L Diesel", purchaseDate: iso(subDays(now, 1200)), status: "maintenance", location: "Workshop", department: "Logistics", insuranceExpiry: iso(addDays(now, 120)), roadTaxExpiry: iso(addDays(now, 200)), class: "department", odometer: 89400, createdAt: iso(subDays(now, 1200)), updatedAt: iso(now) },
  { id: "v4", regNo: "WCD 3456", type: "Pickup", brand: "Isuzu", model: "D-Max", engine: "3.0L Diesel", purchaseDate: iso(subDays(now, 600)), status: "available", location: "HQ Garage", department: "Engineering", insuranceExpiry: iso(addDays(now, 200)), roadTaxExpiry: iso(addDays(now, 28)), class: "department", odometer: 31000, createdAt: iso(subDays(now, 600)), updatedAt: iso(now) },
  { id: "v5", regNo: "WEF 7890", type: "Sedan", brand: "Mercedes", model: "E-Class", engine: "2.0L Hybrid", purchaseDate: iso(subDays(now, 200)), status: "in_use", location: "EXCO Wing", department: "EXCO", insuranceExpiry: iso(addDays(now, 350)), roadTaxExpiry: iso(addDays(now, 350)), class: "exco", odometer: 8900, createdAt: iso(subDays(now, 200)), updatedAt: iso(now) },
  { id: "v6", regNo: "WGH 1122", type: "SUV", brand: "BMW", model: "X3", engine: "2.0L Petrol", purchaseDate: iso(subDays(now, 1500)), status: "disposed", location: "—", department: "Finance", insuranceExpiry: iso(subDays(now, 30)), roadTaxExpiry: iso(subDays(now, 30)), class: "department", odometer: 145000, createdAt: iso(subDays(now, 1500)), updatedAt: iso(now) },
];

export const mockDrivers: Driver[] = [
  { id: "d1", name: "Ahmad Faizal", licenseNo: "D1234567", department: "Operations", status: "active", fineCount: 1, accidentCount: 0, phone: "+60123456789", email: "ahmad@fleet.com", createdAt: iso(subDays(now, 500)), updatedAt: iso(now) },
  { id: "d2", name: "Siti Aminah", licenseNo: "D2345678", department: "EXCO", status: "active", fineCount: 0, accidentCount: 0, phone: "+60123456788", email: "siti@fleet.com", createdAt: iso(subDays(now, 300)), updatedAt: iso(now) },
  { id: "d3", name: "Raj Kumar", licenseNo: "D3456789", department: "Logistics", status: "suspended", fineCount: 4, accidentCount: 2, phone: "+60123456787", email: "raj@fleet.com", createdAt: iso(subDays(now, 700)), updatedAt: iso(now) },
  { id: "d4", name: "Lim Wei Sheng", licenseNo: "D4567890", department: "Engineering", status: "active", fineCount: 0, accidentCount: 1, phone: "+60123456786", email: "lim@fleet.com", createdAt: iso(subDays(now, 200)), updatedAt: iso(now) },
  { id: "d5", name: "Nurul Izzah", licenseNo: "D5678901", department: "HR", status: "active", fineCount: 2, accidentCount: 0, phone: "+60123456785", email: "nurul@fleet.com", createdAt: iso(subDays(now, 100)), updatedAt: iso(now) },
];

export const mockBookings: Booking[] = [
  { id: "b1", vehicleId: "v2", driverId: "d2", vehicleRegNo: "WXY 5678", driverName: "Siti Aminah", purpose: "Site visit", destination: "Putrajaya", startDate: iso(now), endDate: iso(addDays(now, 1)), status: "checked_in", odometerStart: 22050, checkInAt: iso(now), createdAt: iso(subDays(now, 1)), updatedAt: iso(now) },
  { id: "b2", vehicleId: "v5", driverId: "d2", vehicleRegNo: "WEF 7890", driverName: "Siti Aminah", purpose: "Official meeting", destination: "KLCC", startDate: iso(addDays(now, 2)), endDate: iso(addDays(now, 2)), status: "approved", createdAt: iso(now), updatedAt: iso(now) },
  { id: "b3", vehicleId: "v1", driverId: "d1", vehicleRegNo: "WPK 1234", driverName: "Ahmad Faizal", purpose: "Equipment transport", destination: "Shah Alam", startDate: iso(subDays(now, 3)), endDate: iso(subDays(now, 2)), status: "completed", odometerStart: 45100, odometerEnd: 45230, checkInAt: iso(subDays(now, 3)), checkOutAt: iso(subDays(now, 2)), createdAt: iso(subDays(now, 4)), updatedAt: iso(now) },
  { id: "b4", vehicleId: "v4", driverId: "d4", vehicleRegNo: "WCD 3456", driverName: "Lim Wei Sheng", purpose: "Field inspection", destination: "Klang", startDate: iso(addDays(now, 1)), endDate: iso(addDays(now, 1)), status: "pending", createdAt: iso(now), updatedAt: iso(now) },
];

export const mockMaintenance: Maintenance[] = [
  { id: "m1", vehicleId: "v3", vehicleRegNo: "WAB 9012", type: "service", scheduledDate: iso(now), odometerAt: 89400, nextServiceOdometer: 99400, vendor: "Toyota Service Center", status: "in_progress", cost: 1200, createdAt: iso(subDays(now, 5)), updatedAt: iso(now) },
  { id: "m2", vehicleId: "v1", vehicleRegNo: "WPK 1234", type: "service", scheduledDate: iso(addDays(now, 14)), odometerAt: 45230, nextServiceOdometer: 55230, vendor: "Toyota Service Center", status: "scheduled", createdAt: iso(now), updatedAt: iso(now) },
  { id: "m3", vehicleId: "v2", vehicleRegNo: "WXY 5678", type: "inspection", scheduledDate: iso(subDays(now, 20)), completedDate: iso(subDays(now, 20)), odometerAt: 21500, vendor: "Honda Workshop", status: "completed", cost: 450, createdAt: iso(subDays(now, 25)), updatedAt: iso(subDays(now, 20)) },
];

export const mockInsurance: InsurancePolicy[] = [
  { id: "i1", vehicleId: "v2", vehicleRegNo: "WXY 5678", type: "insurance", policyNo: "POL-2024-001", provider: "Allianz", startDate: iso(subDays(now, 360)), expiryDate: iso(addDays(now, 5)), premium: 2400, createdAt: iso(subDays(now, 360)), updatedAt: iso(now) },
  { id: "i2", vehicleId: "v1", vehicleRegNo: "WPK 1234", type: "insurance", policyNo: "POL-2024-002", provider: "AXA", startDate: iso(subDays(now, 320)), expiryDate: iso(addDays(now, 45)), premium: 3200, createdAt: iso(subDays(now, 320)), updatedAt: iso(now) },
  { id: "i3", vehicleId: "v4", vehicleRegNo: "WCD 3456", type: "road_tax", policyNo: "RT-2024-003", provider: "JPJ", startDate: iso(subDays(now, 337)), expiryDate: iso(addDays(now, 28)), premium: 480, createdAt: iso(subDays(now, 337)), updatedAt: iso(now) },
  { id: "i4", vehicleId: "v5", vehicleRegNo: "WEF 7890", type: "insurance", policyNo: "POL-2024-004", provider: "Allianz", startDate: iso(subDays(now, 15)), expiryDate: iso(addDays(now, 350)), premium: 5800, createdAt: iso(subDays(now, 15)), updatedAt: iso(now) },
];

export const mockAccidents: Accident[] = [
  { id: "a1", vehicleId: "v3", driverId: "d3", vehicleRegNo: "WAB 9012", driverName: "Raj Kumar", date: iso(subDays(now, 30)), location: "Federal Highway KM12", description: "Rear-ended at traffic light", claimStatus: "in_review", claimProgress: 60, estimatedCost: 8500, createdAt: iso(subDays(now, 30)), updatedAt: iso(now) },
  { id: "a2", vehicleId: "v4", driverId: "d4", vehicleRegNo: "WCD 3456", driverName: "Lim Wei Sheng", date: iso(subDays(now, 90)), location: "Subang Jaya", description: "Minor scratch on side panel", claimStatus: "completed", claimProgress: 100, estimatedCost: 1200, createdAt: iso(subDays(now, 90)), updatedAt: iso(subDays(now, 60)) },
];

export const mockFines: Fine[] = [
  { id: "f1", driverId: "d1", vehicleId: "v1", driverName: "Ahmad Faizal", vehicleRegNo: "WPK 1234", offence: "Speeding 20km/h over limit", amount: 300, date: iso(subDays(now, 15)), status: "unpaid", ticketNo: "JPJ-2024-0001", createdAt: iso(subDays(now, 15)), updatedAt: iso(now) },
  { id: "f2", driverId: "d3", vehicleId: "v3", driverName: "Raj Kumar", vehicleRegNo: "WAB 9012", offence: "Illegal parking", amount: 100, date: iso(subDays(now, 45)), status: "paid", ticketNo: "DBKL-2024-0089", createdAt: iso(subDays(now, 45)), updatedAt: iso(subDays(now, 30)) },
  { id: "f3", driverId: "d5", vehicleId: "v2", driverName: "Nurul Izzah", vehicleRegNo: "WXY 5678", offence: "Beat red light", amount: 300, date: iso(subDays(now, 10)), status: "appealed", ticketNo: "PDRM-2024-0234", createdAt: iso(subDays(now, 10)), updatedAt: iso(now) },
];

export const mockDisposals: Disposal[] = [
  { id: "ds1", vehicleId: "v6", vehicleRegNo: "WGH 1122", reason: "End of useful life, high mileage", method: "auction", evaluationValue: 25000, finalValue: 27500, status: "executed", approvedBy: "John Director", executedAt: iso(subDays(now, 10)), createdAt: iso(subDays(now, 60)), updatedAt: iso(subDays(now, 10)) },
];

export const mockActivities: Activity[] = [
  { id: "ac1", type: "booking", message: "New booking created for WCD 3456", user: "Lim Wei Sheng", timestamp: iso(now) },
  { id: "ac2", type: "maintenance", message: "Maintenance started on WAB 9012", user: "System", timestamp: iso(subDays(now, 1)) },
  { id: "ac3", type: "fine", message: "Traffic fine logged against Ahmad Faizal", user: "Admin", timestamp: iso(subDays(now, 2)) },
  { id: "ac4", type: "insurance", message: "Insurance expiring soon: WXY 5678", user: "System", timestamp: iso(subDays(now, 1)) },
  { id: "ac5", type: "disposal", message: "Vehicle WGH 1122 successfully disposed", user: "Admin", timestamp: iso(subDays(now, 10)) },
];
