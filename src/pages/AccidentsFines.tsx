import { useState, useMemo } from "react";
import { Plus, ShieldAlert, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, EmptyState } from "@/components/common";
import { AccidentForm } from "@/features/accidents/AccidentForm";
import { FineForm } from "@/features/fines/FineForm";
import { useAccidentColumns } from "@/features/accidents/AccidentColumns";
import { useFineColumns } from "@/features/fines/FineColumns";
import { useAccidents, useFines, useDrivers, useVehicles } from "@/hooks/resourceHooks";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Accident, Fine } from "@/types";

export default function AccidentsFines() {
  const { items: vehicles } = useVehicles();
  const { items: drivers } = useDrivers();
  const accidents = useAccidents();
  const fines = useFines();
  const { t } = useLanguage();

  const [accForm, setAccForm] = useState<{ open: boolean; editing: Accident | null }>({ open: false, editing: null });
  const [fineForm, setFineForm] = useState<{ open: boolean; editing: Fine | null }>({ open: false, editing: null });
  const [accDel, setAccDel] = useState<Accident | null>(null);
  const [fineDel, setFineDel] = useState<Fine | null>(null);

  const accidentColumns = useAccidentColumns({
    onEdit: (a) => setAccForm({ open: true, editing: a }),
    onDelete: (a) => setAccDel(a),
  });

  const fineColumns = useFineColumns({
    onEdit: (f) => setFineForm({ open: true, editing: f }),
    onDelete: (f) => setFineDel(f),
  });

  const renderAccidentEmpty = useMemo(() => (
    <EmptyState
      icon={ShieldAlert}
      title={t("no_accidents_found")}
      description={t("no_accidents_desc")}
      actionLabel={t("log_accident")}
      onAction={() => setAccForm({ open: true, editing: null })}
    />
  ), [t]);

  const renderFineEmpty = useMemo(() => (
    <EmptyState
      icon={FileText}
      title={t("no_fines_found")}
      description={t("no_fines_desc")}
      actionLabel={t("add_fine")}
      onAction={() => setFineForm({ open: true, editing: null })}
    />
  ), [t]);

  return (
    <div className="space-y-6">
      <PageHeader title="Accidents & Fines" description="Insurance claims and traffic offences" />
      
      <Tabs defaultValue="accidents">
        <TabsList>
          <TabsTrigger value="accidents">Accidents</TabsTrigger>
          <TabsTrigger value="fines">Fines (Saman)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accidents" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAccForm({ open: true, editing: null })}>
              <Plus className="mr-1 h-4 w-4" /> Log accident
            </Button>
          </div>
          <ActionTable 
            columns={accidentColumns} 
            data={accidents.items} 
            loading={accidents.loading} 
            renderEmpty={renderAccidentEmpty}
            searchPlaceholder="Search accidents by vehicle, driver or location..."
          />
        </TabsContent>
        
        <TabsContent value="fines" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setFineForm({ open: true, editing: null })}>
              <Plus className="mr-1 h-4 w-4" /> Add fine
            </Button>
          </div>
          <ActionTable 
            columns={fineColumns} 
            data={fines.items} 
            loading={fines.loading} 
            renderEmpty={renderFineEmpty}
            searchPlaceholder="Search fines by ticket no, driver or offence..."
          />
        </TabsContent>
      </Tabs>

      <BaseModal 
        open={accForm.open} 
        onOpenChange={(o) => setAccForm((s) => ({ ...s, open: o }))} 
        title={accForm.editing ? "Edit accident" : "Log accident"} 
        size="lg"
      >
        <AccidentForm 
          initial={accForm.editing} 
          vehicles={vehicles} 
          drivers={drivers}
          onSubmit={async (v) => {
            if (accForm.editing) await accidents.update(accForm.editing.id, v as Partial<Accident>);
            else await accidents.create(v as Omit<Accident, "id" | "createdAt" | "updatedAt">);
            setAccForm({ open: false, editing: null });
          }}
          onCancel={() => setAccForm({ open: false, editing: null })} 
        />
      </BaseModal>

      <BaseModal 
        open={fineForm.open} 
        onOpenChange={(o) => setFineForm((s) => ({ ...s, open: o }))} 
        title={fineForm.editing ? "Edit fine" : "Add fine"} 
        size="lg"
      >
        <FineForm 
          initial={fineForm.editing} 
          vehicles={vehicles} 
          drivers={drivers}
          onSubmit={async (v) => {
            if (fineForm.editing) await fines.update(fineForm.editing.id, v as Partial<Fine>);
            else await fines.create(v as Omit<Fine, "id" | "createdAt" | "updatedAt">);
            setFineForm({ open: false, editing: null });
          }}
          onCancel={() => setFineForm({ open: false, editing: null })} 
        />
      </BaseModal>

      <ConfirmModal 
        open={!!accDel} 
        onOpenChange={(o) => !o && setAccDel(null)} 
        title="Delete accident report?" 
        variant="danger" 
        confirmLabel="Delete"
        onConfirm={async () => { 
          if (accDel) { 
            await accidents.remove(accDel.id); 
            setAccDel(null); 
          } 
        }} 
      />

      <ConfirmModal 
        open={!!fineDel} 
        onOpenChange={(o) => !o && setFineDel(null)} 
        title="Delete fine?" 
        variant="danger" 
        confirmLabel="Delete"
        onConfirm={async () => { 
          if (fineDel) { 
            await fines.remove(fineDel.id); 
            setFineDel(null); 
          } 
        }} 
      />
    </div>
  );
}
