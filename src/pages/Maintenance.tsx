import { useState, useMemo } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, EmptyState } from "@/components/common";
import { MaintenanceForm } from "@/features/maintenance/MaintenanceForm";
import { useMaintenanceColumns } from "@/features/maintenance/MaintenanceColumns";
import { useMaintenance, useVehicles } from "@/hooks/resourceHooks";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Maintenance } from "@/types";

export default function MaintenancePage() {
  const { items: vehicles } = useVehicles();
  const { items, loading, create, update, remove } = useMaintenance();
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Maintenance | null>(null);
  const { t } = useLanguage();

  const columns = useMaintenanceColumns({
    onEdit: (m) => {
      setEditing(m);
      setFormOpen(true);
    },
    onDelete: (m) => setConfirmDelete(m),
    onPreview: () => {}, // Reverted to standard link
  });

  const renderEmpty = useMemo(() => (
    <EmptyState
      icon={Wrench}
      title={t("no_maintenance_found")}
      description={t("no_maintenance_desc")}
      actionLabel={t("maintenance")}
      onAction={() => {
        setEditing(null);
        setFormOpen(true);
      }}
    />
  ), [t]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maintenance" 
        description="Service schedules and workshop logs"
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Schedule service
          </Button>
        } 
      />

      <ActionTable 
        columns={columns} 
        data={items} 
        loading={loading} 
        renderEmpty={renderEmpty}
        searchPlaceholder="Search by vehicle, type..."
      />

      <BaseModal 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        title={editing ? "Edit maintenance" : "Schedule maintenance"} 
        size="lg"
      >
        <MaintenanceForm 
          initial={editing} 
          vehicles={vehicles}
          onSubmit={async (v) => {
            if (editing) {
              await update(editing.id, v as Partial<Maintenance>);
            } else {
              await create(v as Omit<Maintenance, "id" | "createdAt" | "updatedAt">);
            }
            setFormOpen(false);
            setEditing(null);
          }}
          onCancel={() => setFormOpen(false)} 
        />
      </BaseModal>

      <ConfirmModal 
        open={!!confirmDelete} 
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete maintenance record?" 
        variant="danger" 
        confirmLabel="Delete"
        onConfirm={async () => {
          if (confirmDelete) {
            await remove(confirmDelete.id);
            setConfirmDelete(null);
          }
        }} 
      />
    </div>
  );
}
