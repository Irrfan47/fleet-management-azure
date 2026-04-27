import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { AccidentForm } from "@/features/accidents/AccidentForm";
import { FineForm } from "@/features/fines/FineForm";
import { useAccidents, useFines, useDrivers, useVehicles } from "@/hooks/resourceHooks";
import { CLAIM_STATUS, FINE_STATUS } from "@/utils/constants";
import { fmtDate, fmtCurrency } from "@/utils/format";
import type { Accident, Fine } from "@/types";

export default function AccidentsFines() {
  const { items: vehicles } = useVehicles();
  const { items: drivers } = useDrivers();
  const accidents = useAccidents();
  const fines = useFines();

  const [accForm, setAccForm] = useState<{ open: boolean; editing: Accident | null }>({ open: false, editing: null });
  const [fineForm, setFineForm] = useState<{ open: boolean; editing: Fine | null }>({ open: false, editing: null });
  const [accDel, setAccDel] = useState<Accident | null>(null);
  const [fineDel, setFineDel] = useState<Fine | null>(null);

  const accidentCols: Column<Accident>[] = [
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono font-semibold">{r.vehicleRegNo}</span> },
    { key: "driverName", header: "Driver" },
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
    { key: "location", header: "Location" },
    { key: "estimatedCost", header: "Cost", render: (r) => fmtCurrency(r.estimatedCost) },
    { key: "claimProgress", header: "Claim progress", render: (r) => (
      <div className="w-32"><Progress value={r.claimProgress} className="h-2" /><span className="text-xs text-muted-foreground">{r.claimProgress}%</span></div>
    ) },
    { key: "claimStatus", header: "Status", render: (r) => { const m = CLAIM_STATUS[r.claimStatus]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-24", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => setAccForm({ open: true, editing: r })}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setAccDel(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  const fineCols: Column<Fine>[] = [
    { key: "ticketNo", header: "Ticket No", render: (r) => <span className="font-mono">{r.ticketNo}</span> },
    { key: "driverName", header: "Driver" },
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono">{r.vehicleRegNo}</span> },
    { key: "offence", header: "Offence" },
    { key: "amount", header: "Amount", render: (r) => fmtCurrency(r.amount) },
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
    { key: "status", header: "Status", render: (r) => { const m = FINE_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-24", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => setFineForm({ open: true, editing: r })}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setFineDel(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Accidents & Fines" description="Insurance claims and traffic offences" />
      <Tabs defaultValue="accidents">
        <TabsList>
          <TabsTrigger value="accidents">Accidents</TabsTrigger>
          <TabsTrigger value="fines">Fines (Saman)</TabsTrigger>
        </TabsList>
        <TabsContent value="accidents" className="mt-4 space-y-4">
          <div className="flex justify-end"><Button onClick={() => setAccForm({ open: true, editing: null })}><Plus className="mr-1 h-4 w-4" /> Log accident</Button></div>
          <ActionTable columns={accidentCols} data={accidents.items} loading={accidents.loading} />
        </TabsContent>
        <TabsContent value="fines" className="mt-4 space-y-4">
          <div className="flex justify-end"><Button onClick={() => setFineForm({ open: true, editing: null })}><Plus className="mr-1 h-4 w-4" /> Add fine</Button></div>
          <ActionTable columns={fineCols} data={fines.items} loading={fines.loading} />
        </TabsContent>
      </Tabs>

      <BaseModal open={accForm.open} onOpenChange={(o) => setAccForm((s) => ({ ...s, open: o }))} title={accForm.editing ? "Edit accident" : "Log accident"} size="lg">
        <AccidentForm initial={accForm.editing} vehicles={vehicles} drivers={drivers}
          onSubmit={async (v) => {
            if (accForm.editing) await accidents.update(accForm.editing.id, v as Partial<Accident>);
            else await accidents.create(v as Omit<Accident, "id" | "createdAt" | "updatedAt">);
            setAccForm({ open: false, editing: null });
          }}
          onCancel={() => setAccForm({ open: false, editing: null })} />
      </BaseModal>

      <BaseModal open={fineForm.open} onOpenChange={(o) => setFineForm((s) => ({ ...s, open: o }))} title={fineForm.editing ? "Edit fine" : "Add fine"} size="lg">
        <FineForm initial={fineForm.editing} vehicles={vehicles} drivers={drivers}
          onSubmit={async (v) => {
            if (fineForm.editing) await fines.update(fineForm.editing.id, v as Partial<Fine>);
            else await fines.create(v as Omit<Fine, "id" | "createdAt" | "updatedAt">);
            setFineForm({ open: false, editing: null });
          }}
          onCancel={() => setFineForm({ open: false, editing: null })} />
      </BaseModal>

      <ConfirmModal open={!!accDel} onOpenChange={(o) => !o && setAccDel(null)} title="Delete accident report?" variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (accDel) { await accidents.remove(accDel.id); setAccDel(null); } }} />
      <ConfirmModal open={!!fineDel} onOpenChange={(o) => !o && setFineDel(null)} title="Delete fine?" variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (fineDel) { await fines.remove(fineDel.id); setFineDel(null); } }} />
    </div>
  );
}
