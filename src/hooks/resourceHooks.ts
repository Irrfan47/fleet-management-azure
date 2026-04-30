import { useState, useEffect } from "react";
import { vehiclesService, driversService, bookingsService, maintenanceService, insuranceService, accidentsService, finesService, disposalsService, activitiesService } from "@/services/fleetService";
import type { Vehicle, Driver, Booking, Maintenance, InsurancePolicy, Accident, Fine, Disposal, Activity } from "@/types";
import { useCrudResource } from "./useCrudResource";

export const useVehicles = () => useCrudResource<Vehicle>(vehiclesService, "Vehicle");
export const useDrivers = () => useCrudResource<Driver>(driversService, "Driver");
export const useBookings = () => useCrudResource<Booking>(bookingsService, "Booking");
export const useMaintenance = () => useCrudResource<Maintenance>(maintenanceService, "Maintenance record");
export const useInsurance = () => useCrudResource<InsurancePolicy>(insuranceService, "Policy");
export const useAccidents = () => useCrudResource<Accident>(accidentsService, "Accident report");
export const useFines = () => useCrudResource<Fine>(finesService, "Fine");
export const useDisposals = () => useCrudResource<Disposal>(disposalsService, "Disposal");
export const useActivities = () => useCrudResource<Activity>(activitiesService, "Activity");

export const useVehicle = (id?: string) => {
  const { getOne } = useVehicles();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOne(id).then(setVehicle).finally(() => setLoading(false));
    }
  }, [id, getOne]);

  return { vehicle, loading };
};

export const useDriver = (id?: string) => {
  const { getOne } = useDrivers();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOne(id).then(setDriver).finally(() => setLoading(false));
    }
  }, [id, getOne]);

  return { driver, loading };
};
