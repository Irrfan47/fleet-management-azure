import { FileText, Download, Car, CalendarCheck, Wrench, AlertTriangle, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Reports() {
  const { t } = useLanguage();

  const reportTypes = [
    { id: "vehicles", name: "Vehicle Master List", desc: "Complete fleet inventory and status report", icon: Car },
    { id: "bookings", name: "Booking Utilization", desc: "Vehicle usage and driver assignments history", icon: CalendarCheck },
    { id: "maintenance", name: "Maintenance Records", desc: "Service history and upcoming schedules", icon: Wrench },
    { id: "accidents", name: "Incidents & Claims", desc: "Accident records and insurance claim status", icon: AlertTriangle },
    { id: "fines", name: "Traffic Offences", desc: "List of fines and payment tracking", icon: FileText },
    { id: "audit", name: "Audit Trail (Jejak Audit)", desc: "System activity logs and administrative changes", icon: History },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("reports")} 
        description="Generate and export system reports for analysis" 
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.id} className="group transition-all hover:shadow-elegant border-l-4 border-l-primary/30 hover:border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <report.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.name}</CardTitle>
                  <CardDescription className="text-xs">{report.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8 text-xs">
                <Download className="h-3 w-3" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8 text-xs">
                <Download className="h-3 w-3" /> Excel
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
