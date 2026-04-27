import { vehiclesService, driversService, bookingsService, maintenanceService, insuranceService, accidentsService, finesService, disposalsService } from "@/services/mockApi";
import type { Vehicle, Driver, Booking, Maintenance, InsurancePolicy, Accident, Fine, Disposal } from "@/types";
import { useCrudResource } from "./useCrudResource";

export const useVehicles = () => useCrudResource<Vehicle>(vehiclesService, "Vehicle");
export const useDrivers = () => useCrudResource<Driver>(driversService, "Driver");
export const useBookings = () => useCrudResource<Booking>(bookingsService, "Booking");
export const useMaintenance = () => useCrudResource<Maintenance>(maintenanceService, "Maintenance record");
export const useInsurance = () => useCrudResource<InsurancePolicy>(insuranceService, "Policy");
export const useAccidents = () => useCrudResource<Accident>(accidentsService, "Accident report");
export const useFines = () => useCrudResource<Fine>(finesService, "Fine");
export const useDisposals = () => useCrudResource<Disposal>(disposalsService, "Disposal");
