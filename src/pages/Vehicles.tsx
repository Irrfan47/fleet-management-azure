import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { VehicleForm, type VehicleFormValues } from "@/features/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/resourceHooks";
import { useExpiryStatus } from "@/hooks/useExpiryStatus";
import { fmtDate, fmtNumber } from "@/utils/format";
import { VEHICLE_STATUS } from "@/utils/constants";
import type { Vehicle } from "@/types";

function ExpiryCell({ date }: { date: string }) {
  const { alert, days } = useExpiryStatus(date);
  const tone = alert === "urgent" || alert === "expired" ? "destructive" : alert === "standard" ? "warning" : "muted";
  return <StatusBadge label={`${fmtDate(date)} ${days < 30 ? `(${days < 0 ? "expired" : `${days}d`})` : ""}`} tone={tone} />;
}

export default function Vehicles() {
  const { items, loading, create, update, remove } = useVehicles();
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Vehicle | null>(null);

  const columns: Column<Vehicle>[] = [
    { key: "regNo", header: "Reg No", render: (r) => <span className="font-mono font-semibold">{r.regNo}</span> },
    { key: "brand", header: "Vehicle", render: (r) => <div><div className="font-medium">{r.brand} {r.model}</div><div className="text-xs text-muted-foreground">{r.type} · {r.engine}</div></div> },
    { key: "department", header: "Department", render: (r) => <div><div>{r.department}</div><div className="text-xs uppercase text-muted-foreground">{r.class}</div></div> },
    { key: "odometer", header: "Odometer", render: (r) => `${fmtNumber(r.odometer)} km` },
    { key: "insuranceExpiry", header: "Insurance", render: (r) => <ExpiryCell date={r.insuranceExpiry} /> },
    { key: "roadTaxExpiry", header: "Road tax", render: (r) => <ExpiryCell date={r.roadTaxExpiry} /> },
    { key: "status", header: "Status", render: (r) => { const m = VEHICLE_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    {
      key: "actions", header: "", className: "w-24", render: (r) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (v: VehicleFormValues) => {
    if (editing) await update(editing.id, v as Partial<Vehicle>); else await create(v as Omit<Vehicle, "id" | "createdAt" | "updatedAt">);
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Master data for all fleet vehicles"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add vehicle</Button>}
      />
      <ActionTable columns={columns} data={items} loading={loading} searchPlaceholder="Search reg no, brand, department…" />

      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit vehicle" : "Add vehicle"} size="lg">
        <VehicleForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </BaseModal>

      <ConfirmModal
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete vehicle?"
        description={`This will permanently remove ${confirmDelete?.regNo} from the fleet.`}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }}
      />
    </div>
  );
}
