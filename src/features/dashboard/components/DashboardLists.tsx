import { Activity as ActivityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common";
import { fmtRelative, fmtDate } from "@/utils/format";
import { useLanguage } from "@/contexts/LanguageContext";
import type { InsurancePolicy, Activity } from "@/types";

export function RecentActivityList({ activities }: { activities: Activity[] }) {
  const { t } = useLanguage();
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ActivityIcon className="h-4 w-4" /> {t("recent_activity")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 && <p className="text-sm text-muted-foreground">{t("no_activity")}</p>}
        {activities.map((a) => {
          const isAlert = a.type === "alert" || a.type === "disposal_approved";
          return (
            <div key={a.id} className={cn("flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0", isAlert && "bg-destructive/5 -mx-2 px-2 py-2 rounded-md border-destructive/20")}>
              <div className={cn("mt-1.5 h-2 w-2 rounded-full", isAlert ? "bg-destructive animate-pulse" : "bg-primary")} />
              <div className="flex-1">
                <p className={cn("text-sm font-medium", isAlert && "text-destructive")}>{a.message}</p>
                <p className="text-xs text-muted-foreground">{a.user} · {fmtRelative(a.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function ExpiringPoliciesList({ expiring }: { expiring: { policy: InsurancePolicy; days: number }[] }) {
  const { t } = useLanguage();
  return (
    <Card className="shadow-elegant">
      <CardHeader><CardTitle className="text-base">{t("expiring_policies")}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {expiring.length === 0 && <p className="text-sm text-muted-foreground">{t("no_policies")}</p>}
        {expiring.map(({ policy, days }) => (
          <div key={policy.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">
                {policy.vehicleRegNo} · {policy.type === "insurance" ? t("insurance_label") : t("road_tax_label")}
              </p>
              <p className="text-xs text-muted-foreground">
                {policy.provider} · expires {fmtDate(policy.expiryDate)}
              </p>
            </div>
            <StatusBadge 
              label={days < 0 ? t("expired_label") : `${days}${t("days_left")}`} 
              tone={days <= 7 ? "destructive" : "warning"} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DueServicesList({ dueServices }: { dueServices: { vehicle: any; alert: string; reason: string }[] }) {
  const { t } = useLanguage();
  return (
    <Card className="shadow-elegant border-l-4 border-l-warning">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{t("service_alerts")}</span>
          <StatusBadge label={dueServices.length.toString()} tone={dueServices.length > 0 ? "warning" : "muted"} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dueServices.length === 0 && <p className="text-sm text-muted-foreground">{t("up_to_date")}</p>}
        {dueServices.map(({ vehicle, alert, reason }) => (
          <div key={vehicle.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">{vehicle.regNo} · {vehicle.brand} {vehicle.model}</p>
              <p className="text-xs text-muted-foreground">{reason}</p>
            </div>
            <StatusBadge 
              label={alert.toUpperCase()} 
              tone={alert === "expired" || alert === "urgent" ? "destructive" : "warning"} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
