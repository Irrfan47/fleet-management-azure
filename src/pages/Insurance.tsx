import { useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { InsuranceForm } from "@/features/insurance/InsuranceForm";
import { useInsurance, useVehicles } from "@/hooks/resourceHooks";
import { useExpiryStatus } from "@/hooks/useExpiryStatus";
import { fmtDate, fmtCurrency } from "@/utils/format";
import type { InsurancePolicy } from "@/types";

function ExpiryBadge({ date }: { date: string }) {
  const { alert, days } = useExpiryStatus(date);
  if (alert === "ok") return <StatusBadge label={`${days}d`} tone="success" />;
  if (alert === "expired") return <StatusBadge label="Expired" tone="destructive" />;
  if (alert === "urgent") return <StatusBadge label={`${days}d — urgent`} tone="destructive" />;
  return <StatusBadge label={`${days}d`} tone="warning" />;
}

export default function Insurance() {
  const { items: vehicles } = useVehicles();
  const { items, loading, create, update, remove } = useInsurance();
  const [editing, setEditing] = useState<InsurancePolicy | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<InsurancePolicy | null>(null);

  const columns: Column<InsurancePolicy>[] = [
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono font-semibold">{r.vehicleRegNo}</span> },
    { key: "type", header: "Type", render: (r) => <span className="capitalize">{r.type.replace("_", " ")}</span> },
    { key: "policyNo", header: "Policy / Receipt" },
    { key: "provider", header: "Provider" },
    { key: "expiryDate", header: "Expiry", render: (r) => <div className="flex items-center gap-2">{fmtDate(r.expiryDate)} <ExpiryBadge date={r.expiryDate} /></div> },
    { key: "premium", header: "Premium", render: (r) => fmtCurrency(r.premium) },
    { key: "actions", header: "", className: "w-32", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" title="Renew" onClick={() => { setEditing(r); setFormOpen(true); }}><RefreshCw className="h-4 w-4 text-info" /></Button>
        <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Insurance & Road Tax" description="Track expiry, renewals and policies"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add policy</Button>} />
      <ActionTable columns={columns} data={items} loading={loading} />
      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Renew / edit policy" : "Add policy"} size="lg">
        <InsuranceForm initial={editing} vehicles={vehicles}
          onSubmit={async (v) => {
            if (editing) await update(editing.id, v as Partial<InsurancePolicy>);
            else await create(v as Omit<InsurancePolicy, "id" | "createdAt" | "updatedAt">);
            setFormOpen(false); setEditing(null);
          }}
          onCancel={() => setFormOpen(false)} />
      </BaseModal>
      <ConfirmModal open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete policy?" variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }} />
    </div>
  );
}
