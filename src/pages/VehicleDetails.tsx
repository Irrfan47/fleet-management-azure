import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Car, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  FileText,
  MapPin,
  Building,
  User,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatusBadge, ActionTable, type Column } from "@/components/common";
import { useVehicle, useMaintenance, useAccidents, useInsurance, useBookings } from "@/hooks/resourceHooks";
import { fmtDate, fmtCurrency, fmtNumber, getAssetUrl } from "@/utils/format";
import { VEHICLE_STATUS, MAINTENANCE_STATUS, CLAIM_STATUS } from "@/utils/constants";
import type { Maintenance, Accident, InsurancePolicy, Booking } from "@/types";

import { DocActions } from "@/features/insurance/InsuranceColumns";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, loading } = useVehicle(id);
  
  const { items: maintenances } = useMaintenance();
  const { items: accidents } = useAccidents();
  const { items: insurance } = useInsurance();
  
  const vehicleMaintenance: Maintenance[] = useMemo(() => 
    maintenances.filter(m => m.vehicleId?.toString() === id?.toString())
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
    [maintenances, id]
  );
  
  const vehicleAccidents: Accident[] = useMemo(() => 
    accidents.filter(a => a.vehicleId?.toString() === id?.toString())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [accidents, id]
  );
  
  const vehicleInsurance: InsurancePolicy[] = useMemo(() => 
    insurance.filter(i => i.vehicleId?.toString() === id?.toString())
    .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()),
    [insurance, id]
  );

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center">Loading vehicle details...</div>;
  }

  if (!vehicle) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Vehicle not found</p>
        <Button onClick={() => navigate("/vehicles")}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/vehicles")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">{vehicle.regNo}</h1>
          <p className="text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge 
            label={VEHICLE_STATUS[vehicle.status]?.label || vehicle.status} 
            tone={VEHICLE_STATUS[vehicle.status]?.tone || "muted"} 
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="aspect-video relative bg-muted">
            {vehicle.image_path ? (
              <img 
                src={getAssetUrl(vehicle.image_path)} 
                alt={vehicle.regNo} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Car className="h-12 w-12 opacity-20" />
              </div>
            )}
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{vehicle.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{vehicle.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{vehicle.location || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="accidents">Accidents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <DetailItem label="Engine No" value={vehicle.engine} />
                  <DetailItem label="Chassis No" value={vehicle.chassisNo} />
                  <DetailItem label="Odometer" value={`${fmtNumber(vehicle.odometer)} km`} />
                  <DetailItem label="Capacity" value={vehicle.capacity} />
                  <DetailItem label="Load Limit" value={vehicle.load} />
                  <DetailItem label="Purchase Date" value={fmtDate(vehicle.purchaseDate)} />
                  <DetailItem label="Class" value={vehicle.class.toUpperCase()} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5" /> Maintenance Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActionTable 
                    data={vehicleMaintenance}
                    columns={[
                      { key: "type", header: "Type", render: (r: Maintenance) => <span className="capitalize">{r.type}</span> },
                      { key: "scheduledDate", header: "Date", render: (r: Maintenance) => fmtDate(r.scheduledDate) },
                      { key: "cost", header: "Cost", render: (r: Maintenance) => fmtCurrency(r.cost || 0) },
                      { 
                        key: "status", 
                        header: "Status", 
                        render: (r: Maintenance) => (
                          <StatusBadge 
                            label={MAINTENANCE_STATUS[r.status]?.label || r.status} 
                            tone={MAINTENANCE_STATUS[r.status]?.tone || "muted"} 
                          />
                        )
                      },
                    ] as Column<Maintenance>[]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Insurance & Road Tax
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Insurance Expiry</p>
                      <p className="text-xl font-bold mt-1">{fmtDate(vehicle.insuranceExpiry)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Policy: {vehicle.insurance_policy_no || "N/A"}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Road Tax Expiry</p>
                      <p className="text-xl font-bold mt-1">{fmtDate(vehicle.roadTaxExpiry)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Reference: {vehicle.road_tax_ref || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">Policy History</h4>
                    <ActionTable 
                      data={vehicleInsurance}
                      columns={[
                        { key: "policyNo", header: "Policy/Ref No" },
                        { 
                          key: "provider", 
                          header: "Provider", 
                          render: (r: InsurancePolicy) => r.type === 'insurance' ? r.provider : "—" 
                        },
                        { key: "expiryDate", header: "Expiry", render: (r: InsurancePolicy) => fmtDate(r.expiryDate) },
                        { 
                          key: "document_path", 
                          header: "Document", 
                          render: (r: InsurancePolicy) => <DocActions path={r.document_path} /> 
                        },
                      ] as Column<InsurancePolicy>[]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accidents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Accidents & Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActionTable 
                    data={vehicleAccidents}
                    columns={[
                      { key: "date", header: "Date", render: (r: Accident) => fmtDate(r.date) },
                      { key: "location", header: "Location" },
                      { 
                        key: "claimStatus", 
                        header: "Claim Status", 
                        render: (r: Accident) => (
                          <StatusBadge 
                            label={CLAIM_STATUS[r.claimStatus]?.label || r.claimStatus} 
                            tone={CLAIM_STATUS[r.claimStatus]?.tone || "muted"} 
                          />
                        )
                      },
                      { key: "estimatedCost", header: "Est. Cost", render: (r: Accident) => fmtCurrency(r.estimatedCost || 0) },
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

function DetailItem({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold">{value || "—"}</p>
    </div>
  );
}
