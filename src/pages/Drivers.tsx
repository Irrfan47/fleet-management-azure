import { useState, useMemo } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, EmptyState } from "@/components/common";
import { DriverForm, type DriverFormValues } from "@/features/drivers/DriverForm";
import { useDriverColumns } from "@/features/drivers/DriverColumns";
import { useDrivers } from "@/hooks/resourceHooks";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Driver } from "@/types";

export default function Drivers() {
  const { items, loading, create, update, remove } = useDrivers();
  const [editing, setEditing] = useState<Driver | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Driver | null>(null);
  const { t } = useLanguage();

  const columns = useDriverColumns({
    onEdit: (d) => {
      setEditing(d);
      setFormOpen(true);
    },
    onDelete: (d) => setConfirmDelete(d),
  });

  const handleSubmit = async (v: DriverFormValues) => {
    if (editing) {
      await update(editing.id, v as Partial<Driver>);
    } else {
      await create(v as Omit<Driver, "id" | "createdAt" | "updatedAt">);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const renderEmpty = useMemo(() => (
    <EmptyState
      icon={Users}
      title={t("no_drivers_found")}
      description={t("no_drivers_desc")}
      actionLabel={t("add_driver")}
      onAction={() => {
        setEditing(null);
        setFormOpen(true);
      }}
    />
  ), [t]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        description="Master data for authorised drivers"
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add driver
          </Button>
        }
      />

      <ActionTable 
        columns={columns} 
        data={items} 
        loading={loading} 
        renderEmpty={renderEmpty}
        searchPlaceholder="Search by name, license, department…" 
      />

      <BaseModal 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        title={editing ? "Edit driver" : "Add driver"} 
        size="lg"
      >
        <DriverForm 
          initial={editing} 
          onSubmit={handleSubmit} 
          onCancel={() => setFormOpen(false)} 
        />
      </BaseModal>

      <ConfirmModal
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete driver?"
        description={`This will remove ${confirmDelete?.name} from the system.`}
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
