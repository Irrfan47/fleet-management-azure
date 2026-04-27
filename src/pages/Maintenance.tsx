import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { MaintenanceForm } from "@/features/maintenance/MaintenanceForm";
import { useMaintenance, useVehicles } from "@/hooks/resourceHooks";
import { MAINTENANCE_STATUS } from "@/utils/constants";
import { fmtDate, fmtCurrency, fmtNumber } from "@/utils/format";
import type { Maintenance } from "@/types";

export default function MaintenancePage() {
  const { items: vehicles } = useVehicles();
  const { items, loading, create, update, remove } = useMaintenance();
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Maintenance | null>(null);

  const columns: Column<Maintenance>[] = [
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono font-semibold">{r.vehicleRegNo}</span> },
    { key: "type", header: "Type", render: (r) => <span className="capitalize">{r.type}</span> },
    { key: "scheduledDate", header: "Scheduled", render: (r) => fmtDate(r.scheduledDate) },
    { key: "odometerAt", header: "Odometer", render: (r) => `${fmtNumber(r.odometerAt)} km` },
    { key: "vendor", header: "Vendor" },
    { key: "cost", header: "Cost", render: (r) => r.cost ? fmtCurrency(r.cost) : "—" },
    { key: "status", header: "Status", render: (r) => { const m = MAINTENANCE_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-24", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" description="Service schedules and workshop logs"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Schedule service</Button>} />
      <ActionTable columns={columns} data={items} loading={loading} />
      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit maintenance" : "Schedule maintenance"} size="lg">
        <MaintenanceForm initial={editing} vehicles={vehicles}
          onSubmit={async (v) => {
            if (editing) await update(editing.id, v as Partial<Maintenance>);
            else await create(v as Omit<Maintenance, "id" | "createdAt" | "updatedAt">);
            setFormOpen(false); setEditing(null);
          }}
          onCancel={() => setFormOpen(false)} />
      </BaseModal>
      <ConfirmModal open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete maintenance record?" variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }} />
    </div>
  );
}
