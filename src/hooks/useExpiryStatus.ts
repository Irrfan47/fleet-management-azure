import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { ALERT_THRESHOLDS } from "@/utils/constants";
import type { InsurancePolicy } from "@/types";

export type ExpiryAlert = "ok" | "standard" | "urgent" | "expired";

export function useExpiryStatus(date?: string): { alert: ExpiryAlert; days: number } {
  return useMemo(() => {
    if (!date) return { alert: "ok", days: Infinity };
    const days = differenceInDays(parseISO(date), new Date());
    if (days < 0) return { alert: "expired", days };
    if (days <= ALERT_THRESHOLDS.EXPIRY_URGENT_DAYS) return { alert: "urgent", days };
    if (days <= ALERT_THRESHOLDS.EXPIRY_STANDARD_DAYS) return { alert: "standard", days };
    return { alert: "ok", days };
  }, [date]);
}

export function useExpiringPolicies(policies: InsurancePolicy[]) {
  return useMemo(() => {
    return policies
      .map((p) => ({ policy: p, days: differenceInDays(parseISO(p.expiryDate), new Date()) }))
      .filter((x) => x.days <= ALERT_THRESHOLDS.EXPIRY_STANDARD_DAYS)
      .sort((a, b) => a.days - b.days);
  }, [policies]);
}

export function useServiceStatus(vehicle: any): { alert: ExpiryAlert; reason: string } {
  return useMemo(() => {
    const { nextServiceDate, nextServiceOdometer, odometer } = vehicle;
    
    // Check date
    if (nextServiceDate) {
      const days = differenceInDays(parseISO(nextServiceDate), new Date());
      if (days < 0) return { alert: "expired", reason: "Service overdue (date)" };
      if (days <= ALERT_THRESHOLDS.SERVICE_URGENT_DAYS) return { alert: "urgent", reason: `Service due in ${days}d` };
      if (days <= ALERT_THRESHOLDS.SERVICE_STANDARD_DAYS) return { alert: "standard", reason: `Service due in ${days}d` };
    }

    // Check odometer
    if (nextServiceOdometer && odometer) {
      const remaining = nextServiceOdometer - odometer;
      if (remaining < 0) return { alert: "expired", reason: "Service overdue (odometer)" };
      if (remaining <= ALERT_THRESHOLDS.SERVICE_KM_URGENT) return { alert: "urgent", reason: `Service due in ${remaining}km` };
      if (remaining <= ALERT_THRESHOLDS.SERVICE_KM_THRESHOLD) return { alert: "standard", reason: `Service due in ${remaining}km` };
    }

    return { alert: "ok", reason: "" };
  }, [vehicle]);
}

export function useDueServices(vehicles: any[]) {
  return useMemo(() => {
    return vehicles
      .map((v) => {
        const { alert, reason } = {
          // Inline logic for mapping
          alert: (function() {
             const days = v.nextServiceDate ? differenceInDays(parseISO(v.nextServiceDate), new Date()) : Infinity;
             const remaining = v.nextServiceOdometer ? v.nextServiceOdometer - v.odometer : Infinity;
             if (days < 0 || remaining < 0) return "expired";
             if (days <= ALERT_THRESHOLDS.SERVICE_URGENT_DAYS || remaining <= ALERT_THRESHOLDS.SERVICE_KM_URGENT) return "urgent";
             if (days <= ALERT_THRESHOLDS.SERVICE_STANDARD_DAYS || remaining <= ALERT_THRESHOLDS.SERVICE_KM_THRESHOLD) return "standard";
             return "ok";
          })(),
          reason: v.nextServiceDate ? `Due ${v.nextServiceDate}` : `${v.nextServiceOdometer}km`
        };
        return { vehicle: v, alert, reason };
      })
      .filter((x) => x.alert !== "ok")
      .sort((a, b) => (a.alert === "expired" ? -1 : 1));
  }, [vehicles]);
}
