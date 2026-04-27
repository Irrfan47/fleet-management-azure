import { Car, CalendarCheck, Wrench, ShieldAlert, Activity as ActivityIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { KpiCard, PageHeader, StatusBadge } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicles, useBookings, useMaintenance, useInsurance } from "@/hooks/resourceHooks";
import { useExpiringPolicies } from "@/hooks/useExpiryStatus";
import { mockActivities } from "@/services/mockData";
import { fmtRelative, fmtDate } from "@/utils/format";
import { VEHICLE_STATUS } from "@/utils/constants";

export default function Dashboard() {
  const { items: vehicles } = useVehicles();
  const { items: bookings } = useBookings();
  const { items: maintenance } = useMaintenance();
  const { items: policies } = useInsurance();

  const activeBookings = bookings.filter((b) => ["approved", "checked_in"].includes(b.status)).length;
  const maintenanceAlerts = maintenance.filter((m) => m.status !== "completed").length;
  const expiring = useExpiringPolicies(policies);

  const statusData = Object.entries(VEHICLE_STATUS).map(([key, meta]) => ({
    name: meta.label,
    value: vehicles.filter((v) => v.status === key).length,
  }));

  const bookingsByMonth = (() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.startDate.slice(0, 7);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, count })).slice(-6);
  })();

  const PIE_COLORS = ["hsl(var(--success))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--destructive))"];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your fleet operations" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Vehicles" value={vehicles.length} icon={<Car className="h-5 w-5" />} trend={`${vehicles.filter((v) => v.status === "available").length} available`} tone="primary" />
        <KpiCard label="Active Bookings" value={activeBookings} icon={<CalendarCheck className="h-5 w-5" />} trend={`${bookings.filter((b) => b.status === "pending").length} pending approval`} tone="info" />
        <KpiCard label="Maintenance Alerts" value={maintenanceAlerts} icon={<Wrench className="h-5 w-5" />} trend="Open service items" tone="warning" />
        <KpiCard label="Expiring Insurance" value={expiring.length} icon={<ShieldAlert className="h-5 w-5" />} trend="Within 30 days" tone="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader><CardTitle className="text-base">Bookings trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByMonth}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader><CardTitle className="text-base">Fleet status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ActivityIcon className="h-4 w-4" /> Recent activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mockActivities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{a.user} · {fmtRelative(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader><CardTitle className="text-base">Expiring policies</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {expiring.length === 0 && <p className="text-sm text-muted-foreground">No policies expiring soon.</p>}
            {expiring.map(({ policy, days }) => (
              <div key={policy.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{policy.vehicleRegNo} · {policy.type === "insurance" ? "Insurance" : "Road Tax"}</p>
                  <p className="text-xs text-muted-foreground">{policy.provider} · expires {fmtDate(policy.expiryDate)}</p>
                </div>
                <StatusBadge label={days < 0 ? "Expired" : `${days}d left`} tone={days <= 7 ? "destructive" : "warning"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
