import { useMemo } from "react";
import { useVehicles, useBookings, useMaintenance, useInsurance, useActivities } from "@/hooks/resourceHooks";
import { useExpiringPolicies, useDueServices } from "@/hooks/useExpiryStatus";
import { VEHICLE_STATUS } from "@/utils/constants";

export function useDashboardData() {
  const { items: vehicles } = useVehicles();
  const { items: bookings } = useBookings();
  const { items: maintenance } = useMaintenance();
  const { items: policies } = useInsurance();
  const { items: activities } = useActivities();

  const activeBookings = useMemo(() => 
    bookings.filter((b) => ["approved", "in-use"].includes(b.status)).length
  , [bookings]);

  const dueServices = useDueServices(vehicles);

  const maintenanceAlerts = useMemo(() => 
    maintenance.filter((m) => m.status !== "completed").length + dueServices.length
  , [maintenance, dueServices]);

  const expiring = useExpiringPolicies(policies);

  const statusData = useMemo(() => 
    Object.entries(VEHICLE_STATUS).map(([key, meta]) => ({
      name: meta.label,
      value: vehicles.filter((v) => v.status === key).length,
    }))
  , [vehicles]);

  const bookingsByMonth = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.startDate.slice(0, 7);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [bookings]);

  return {
    vehicles,
    bookings,
    activeBookings,
    maintenanceAlerts,
    expiring,
    dueServices,
    statusData,
    bookingsByMonth,
    activities,
  };
}
