import { useState } from "react";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { DriverForm, type DriverFormValues } from "@/features/drivers/DriverForm";
import { useDrivers } from "@/hooks/resourceHooks";
import { DRIVER_STATUS } from "@/utils/constants";
import type { Driver } from "@/types";

export default function Drivers() {
  const { items, loading, create, update, remove } = useDrivers();
  const [editing, setEditing] = useState<Driver | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Driver | null>(null);

  const toggleStatus = async (d: Driver) => {
    await update(d.id, { status: d.status === "active" ? "suspended" : "active" });
  };

  const columns: Column<Driver>[] = [
    { key: "name", header: "Driver", render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-muted text-primary text-xs">{r.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
        <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.licenseNo}</div></div>
      </div>
    ) },
    { key: "department", header: "Department" },
    { key: "phone", header: "Contact", render: (r) => <div className="text-sm"><div>{r.phone}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
    { key: "fineCount", header: "Fines", render: (r) => <span className={r.fineCount > 0 ? "font-semibold text-destructive" : ""}>{r.fineCount}</span> },
    { key: "accidentCount", header: "Accidents", render: (r) => <span className={r.accidentCount > 0 ? "font-semibold text-warning" : ""}>{r.accidentCount}</span> },
    { key: "status", header: "Status", render: (r) => { const m = DRIVER_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-32", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => toggleStatus(r)} title="Toggle status"><Power className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  const handleSubmit = async (v: DriverFormValues) => {
    if (editing) await update(editing.id, v as Partial<Driver>); else await create(v as Omit<Driver, "id" | "createdAt" | "updatedAt">);
    setFormOpen(false); setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        description="Master data for authorised drivers"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> Add driver</Button>}
      />
      <ActionTable columns={columns} data={items} loading={loading} searchPlaceholder="Search by name, license, department…" />

      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit driver" : "Add driver"} size="lg">
        <DriverForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </BaseModal>

      <ConfirmModal
        open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete driver?" description={`This will remove ${confirmDelete?.name} from the system.`}
        variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }}
      />
    </div>
  );
}
