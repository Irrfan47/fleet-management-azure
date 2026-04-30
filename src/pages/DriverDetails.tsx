import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  IdCard, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Calendar, 
  AlertTriangle, 
  FileText,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, ActionTable, type Column } from "@/components/common";
import { useDriver, useAccidents, useBookings } from "@/hooks/resourceHooks";
import { fmtDate, fmtCurrency, getAssetUrl } from "@/utils/format";
import { CLAIM_STATUS } from "@/utils/constants";
import type { Accident, Booking } from "@/types";

export default function DriverDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { driver, loading } = useDriver(id);
  
  const { items: allAccidents } = useAccidents();
  const { items: allBookings } = useBookings();
  
  const driverAccidents: Accident[] = allAccidents.filter(a => a.driverId === id);
  const driverBookings: Booking[] = allBookings.filter(b => b.driverId === id);

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center">Loading driver profile...</div>;
  }

  if (!driver) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Driver not found</p>
        <Button onClick={() => navigate("/drivers")}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/drivers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">{driver.name}</h1>
          <p className="text-muted-foreground">{driver.department} Department</p>
        </div>
        <div className="ml-auto">
          <StatusBadge 
            label={driver.status.charAt(0).toUpperCase() + driver.status.slice(1)} 
            tone={driver.status === "active" ? "success" : "warning"} 
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              {driver.image_path ? (
                <img 
                  src={getAssetUrl(driver.image_path)} 
                  alt={driver.name} 
                  className="h-32 w-32 rounded-full object-cover border-4 border-muted shadow-sm"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted text-4xl font-bold text-muted-foreground">
                  {driver.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{driver.name}</h2>
              <p className="text-sm text-muted-foreground">Joined: {fmtDate(driver.joinedAt)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xl font-bold text-destructive">{driver.accidentCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Accidents</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-destructive">{driver.fineCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Fines</p>
              </div>
            </div>
          </CardContent>
          <CardContent className="p-6 border-t space-y-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{driver.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{driver.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Information</TabsTrigger>
              <TabsTrigger value="trips">Trip History</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legal & Identification</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <DetailItem label="IC Number" value={driver.ic_no} icon={<IdCard className="h-4 w-4" />} />
                  <DetailItem label="License Number" value={driver.licenseNo} icon={<CreditCard className="h-4 w-4" />} />
                  <DetailItem label="License Type" value={driver.license_type} icon={<ShieldCheck className="h-4 w-4" />} />
                  <DetailItem label="License Expiry" value={fmtDate(driver.licenseExpiry)} icon={<Calendar className="h-4 w-4" />} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trips" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Recent Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActionTable 
                    data={driverBookings}
                    columns={[
                      { key: "purpose", header: "Purpose" },
                      { key: "startDate", header: "Date", render: (r: Booking) => fmtDate(r.startDate) },
                      { key: "vehicleRegNo", header: "Vehicle" },
                      { key: "status", header: "Status", render: (r: Booking) => <StatusBadge label={r.status} tone={r.status === "completed" ? "success" : "warning"} /> },
                    ] as Column<Booking>[]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incidents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Accident Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActionTable 
                    data={driverAccidents}
                    columns={[
                      { key: "date", header: "Date", render: (r: Accident) => fmtDate(r.date) },
                      { key: "location", header: "Location" },
                      { 
                        key: "claimStatus", 
                        header: "Claim", 
                        render: (r: Accident) => (
                          <StatusBadge 
                            label={CLAIM_STATUS[r.claimStatus]?.label || r.claimStatus} 
                            tone={CLAIM_STATUS[r.claimStatus]?.tone || "muted"} 
                          />
                        )
                      },
                    ] as Column<Accident>[]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon }: { label: string; value?: string | number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}
