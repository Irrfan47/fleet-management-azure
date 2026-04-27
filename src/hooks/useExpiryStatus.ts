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
