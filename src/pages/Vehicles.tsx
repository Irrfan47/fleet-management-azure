import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, EmptyState, type Column } from "@/components/common";
import { VehicleForm, type VehicleFormValues } from "@/features/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/resourceHooks";
import { useExpiryStatus } from "@/hooks/useExpiryStatus";
import { fmtDate, fmtNumber, getAssetUrl } from "@/utils/format";
import { VEHICLE_STATUS } from "@/utils/constants";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

  const columns: Column<Vehicle>[] = [
    { key: "regNo", header: t("reg_no"), render: (r) => <Link to={`/vehicles/${r.id}`} className="hover:underline"><span className="font-mono font-semibold text-primary">{r.regNo}</span></Link> },
    { 
      key: "brand", 
      header: t("vehicles"), 
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.image_path ? (
            <img src={getAssetUrl(r.image_path)} alt={r.regNo} className="h-10 w-10 rounded object-cover border" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted text-xs font-bold text-muted-foreground uppercase">
              {r.brand.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium">{r.brand} {r.model}</div>
            <div className="text-xs text-muted-foreground">{r.type} · {r.engine} {r.capacity ? `(${r.capacity})` : ""}</div>
          </div>
        </div>
      ) 
    },
    { 
      key: "details", 
      header: t("load_cap"), 
      render: (r) => (
        <div className="text-xs">
          {r.capacity && <div>Cap: {r.capacity}</div>}
          {r.load && <div>Load: {r.load}</div>}
          {!r.capacity && !r.load && <span className="text-muted-foreground">—</span>}
        </div>
      ) 
    },
    { key: "department", header: t("department_label"), render: (r) => <div><div>{r.department}</div><div className="text-xs uppercase text-muted-foreground">{r.class}</div></div> },
    { key: "odometer", header: t("odometer"), render: (r) => `${fmtNumber(r.odometer)} km` },
    { key: "insuranceExpiry", header: t("insurance_label"), render: (r) => <ExpiryCell date={r.insuranceExpiry} /> },
    { key: "roadTaxExpiry", header: t("road_tax_label"), render: (r) => <ExpiryCell date={r.roadTaxExpiry} /> },
    { key: "status", header: t("status"), render: (r) => { const m = VEHICLE_STATUS[r.status as keyof typeof VEHICLE_STATUS]; return <StatusBadge label={t(r.status)} tone={m.tone} />; } },
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
  
  const renderEmpty = (
    <EmptyState
      icon={Car}
      title={t("no_vehicles_found")}
      description={t("no_vehicles_desc")}
      actionLabel={t("add_vehicle")}
      onAction={() => { setEditing(null); setFormOpen(true); }}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("vehicles")}
        description={t("vehicle_desc")}
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> {t("add_vehicle")}</Button>}
      />
      <ActionTable columns={columns} data={items} loading={loading} renderEmpty={renderEmpty} searchPlaceholder={t("search") + "..."} />

      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? t("edit_vehicle") : t("add_vehicle")} size="lg">
        <VehicleForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </BaseModal>

      <ConfirmModal
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={t("delete_vehicle_title")}
        description={t("delete_vehicle_desc")}
        variant="danger"
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }}
      />
    </div>
  );
}
