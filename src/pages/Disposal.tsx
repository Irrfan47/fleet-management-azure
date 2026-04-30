import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, EmptyState, type Column } from "@/components/common";
import { DisposalForm } from "@/features/disposal/DisposalForm";
import { useDisposals, useVehicles } from "@/hooks/resourceHooks";
import { DISPOSAL_STATUS } from "@/utils/constants";
import { fmtDate, fmtCurrency } from "@/utils/format";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Disposal } from "@/types";
import { toast } from "sonner";

export default function DisposalPage() {
  const { items: vehicles } = useVehicles();
  const { user } = useAuth();
  const { items, loading, create, update, remove } = useDisposals();
  const [editing, setEditing] = useState<Disposal | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Disposal | null>(null);
  const [approveTarget, setApproveTarget] = useState<Disposal | null>(null);
  const { t } = useLanguage();

  const handleApprove = async () => {
    if (!approveTarget) return;
    if (user?.role !== "admin") { toast.error("Only admins can approve disposals"); return; }
    await update(approveTarget.id, { status: "approved", approvedBy: user.name });
    setApproveTarget(null);
  };

  const columns: Column<Disposal>[] = [
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono font-semibold">{r.vehicleRegNo}</span> },
    { key: "method", header: "Method", render: (r) => <span className="capitalize">{r.method.replace("_", " ")}</span> },
    { key: "reason", header: "Reason" },
    { key: "evaluationValue", header: "Eval. value", render: (r) => fmtCurrency(r.evaluationValue) },
    { key: "finalValue", header: "Final value", render: (r) => r.finalValue ? fmtCurrency(r.finalValue) : "—" },
    { key: "approvedBy", header: "Approved by", render: (r) => r.approvedBy || "—" },
    { key: "executedAt", header: "Executed", render: (r) => r.executedAt ? fmtDate(r.executedAt) : "—" },
    { key: "status", header: "Status", render: (r) => { const m = DISPOSAL_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-32", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        {r.status === "pending_approval" && (
          <Button variant="ghost" size="icon" title="Approve" onClick={() => setApproveTarget(r)}><CheckCircle2 className="h-4 w-4 text-success" /></Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  const renderEmpty = (
    <EmptyState
      icon={Trash2}
      title={t("no_disposals_found")}
      description={t("no_disposals_desc")}
      actionLabel={t("new_disposal")}
      onAction={() => { setEditing(null); setFormOpen(true); }}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Disposal" description="Vehicle evaluation, approval workflow and audit trail"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> New disposal</Button>} />
      <ActionTable columns={columns} data={items} loading={loading} renderEmpty={renderEmpty} />

      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit disposal" : "New disposal"} size="lg">
        <DisposalForm initial={editing} vehicles={vehicles}
          onSubmit={async (v) => {
            if (editing) await update(editing.id, v as Partial<Disposal>);
            else await create(v as Omit<Disposal, "id" | "createdAt" | "updatedAt">);
            setFormOpen(false); setEditing(null);
          }}
          onCancel={() => setFormOpen(false)} />
      </BaseModal>

      <ConfirmModal open={!!approveTarget} onOpenChange={(o) => !o && setApproveTarget(null)}
        title="Approve disposal?" description={`This will lock ${approveTarget?.vehicleRegNo} from new bookings.`}
        variant="success" confirmLabel="Approve" onConfirm={handleApprove} />

      <ConfirmModal open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete disposal record?" variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }} />
    </div>
  );
}
