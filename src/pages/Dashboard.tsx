import { Car, CalendarCheck, Wrench, ShieldAlert } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/common";
import { BookingsTrendChart, FleetStatusChart } from "@/features/dashboard/components/DashboardCharts";
import { RecentActivityList, ExpiringPoliciesList, DueServicesList } from "@/features/dashboard/components/DashboardLists";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const {
    vehicles,
    activeBookings,
    maintenanceAlerts,
    expiring,
    dueServices,
    statusData,
    bookingsByMonth,
    activities,
  } = useDashboardData();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader title={t("dashboard")} description={t("dashboard_desc")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          label={t("total_vehicles")} 
          value={vehicles.length} 
          icon={<Car className="h-5 w-5" />} 
          trend={`${vehicles.filter((v) => v.status === "available").length} ${t("available_trend")}`} 
          tone="primary" 
        />
        <KpiCard 
          label={t("active_bookings")} 
          value={activeBookings} 
          icon={<CalendarCheck className="h-5 w-5" />} 
          trend={t("operational_trips")} 
          tone="info" 
        />
        <KpiCard 
          label={t("maintenance_alerts")} 
          value={maintenanceAlerts} 
          icon={<Wrench className="h-5 w-5" />} 
          trend={t("open_service")} 
          tone="warning" 
        />
        <KpiCard 
          label={t("expiring_insurance")} 
          value={expiring.length} 
          icon={<ShieldAlert className="h-5 w-5" />} 
          trend={t("within_30_days")} 
          tone="destructive" 
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BookingsTrendChart bookingsByMonth={bookingsByMonth} />
        <FleetStatusChart statusData={statusData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivityList activities={activities} />
        <div className="space-y-4">
          <ExpiringPoliciesList expiring={expiring} />
          <DueServicesList dueServices={dueServices} />
        </div>
      </div>
    </div>
  );
}
