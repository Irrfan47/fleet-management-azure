import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
}

const toneBg: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  primary: "bg-primary-muted text-primary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  destructive: "bg-destructive-muted text-destructive",
  info: "bg-info-muted text-info",
};

export function KpiCard({ label, value, icon, trend, tone = "primary" }: KpiCardProps) {
  return (
    <Card className="shadow-elegant transition-shadow hover:shadow-elegant-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", toneBg[tone])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
