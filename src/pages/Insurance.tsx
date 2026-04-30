import { Plus, ShieldCheck, FileText, Eye, AlertCircle, Clock, CheckCircle2, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, EmptyState } from "@/components/common";
import { InsuranceForm } from "@/features/insurance/InsuranceForm";
import { useInsurancePage } from "@/hooks/useInsurancePage";
import { useLanguage } from "@/contexts/LanguageContext";
import { fmtDate, fmtCurrency, getViewUrl } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function Insurance() {
  const { t } = useLanguage();
  const {
    vehicles,
    loading,
    stats,
    groupedItems,
    columns,
    formOpen,
    setFormOpen,
    editingGroup,
    isRenewal,
    historyOpen,
    setHistoryOpen,
    confirmDelete,
    setConfirmDelete,
    handleFormSubmit,
    handleDeleteConfirm,
    openAddModal,
  } = useInsurancePage();
  
  const renderEmpty = (
    <EmptyState
      icon={ShieldCheck}
      title={t("no_insurance_found")}
      description={t("no_insurance_desc")}
      actionLabel={t("add_policy")}
      onAction={openAddModal}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Insurance & Road Tax" 
        description="Track expiry, renewals and policies across the fleet"
        action={
          <Button onClick={openAddModal} className="gap-2 shadow-elegant">
            <Plus className="h-4 w-4" /> Add policy
          </Button>
        } 
      />

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard 
          icon={ShieldCheck} 
          label="Total Assets" 
          value={stats.totalActive} 
          color="primary" 
        />
        <StatCard 
          icon={Clock} 
          label="Expiring (30d)" 
          value={stats.expiringSoon} 
          color="warning" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="Urgent (7d)" 
          value={stats.expiringUrgent} 
          color="destructive" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="Expired" 
          value={stats.expired} 
          color="destructive" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Total Premium" 
          value={fmtCurrency(stats.totalPremium)} 
          color="info" 
          isCurrency 
        />
      </div>
      
      <div className="bg-card shadow-elegant rounded-xl border border-border/50 overflow-hidden">
        <ActionTable columns={columns} data={groupedItems} loading={loading} renderEmpty={renderEmpty} />
      </div>
      
      <BaseModal 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        title={editingGroup ? (isRenewal ? "Renew Policy" : "Edit Policy") : "Add Policy"} 
        size="lg"
      >
        <InsuranceForm 
          initialGroup={editingGroup} 
          isRenewal={isRenewal}
          vehicles={vehicles}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)} 
        />
      </BaseModal>

      <HistoryModal 
        historyOpen={historyOpen} 
        onClose={() => setHistoryOpen(null)} 
      />
      
      <ConfirmModal 
        open={!!confirmDelete} 
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete policy records?" 
        description="This will permanently remove the current insurance and road tax records for this vehicle. This action cannot be undone."
        variant="danger" 
        confirmLabel="Delete Everything"
        onConfirm={handleDeleteConfirm} 
      />
    </div>
  );
}

/* ── Internal Sub-components ──────────────────────────────── */

function StatCard({ icon: Icon, label, value, color, isCurrency }: any) {
  return (
    <Card className={cn(
      "bg-card shadow-elegant border-none ring-1 ring-border/50 overflow-hidden group transition-all duration-300",
      `hover:ring-${color}/40`
    )}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-3 rounded-xl group-hover:scale-110 transition-transform duration-500", `bg-${color}/10 text-${color}`)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
          <h3 className={cn("text-2xl font-bold tracking-tight", isCurrency && "text-primary")}>{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryModal({ historyOpen, onClose }: any) {
  if (!historyOpen) return null;

  const allRecords = [
    ...(historyOpen.insurance ? [historyOpen.insurance] : []), 
    ...(historyOpen.roadTax ? [historyOpen.roadTax] : []), 
    ...historyOpen.history || []
  ].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <BaseModal
      open={!!historyOpen}
      onOpenChange={(o) => !o && onClose()}
      title={`Renewal History: ${historyOpen.regNo}`}
      size="lg"
    >
      <div className="space-y-3 py-4">
        <div className="flex items-center gap-2 px-1 mb-2">
          <HistoryIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Historical Records</span>
        </div>
        {allRecords.map((p) => (
          <div key={p.id} className="group relative flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-muted/30 transition-all duration-200 ring-offset-background hover:ring-1 hover:ring-primary/20 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={cn(
                "mt-1 p-2 rounded-lg",
                p.type === 'insurance' ? "bg-primary/10 text-primary" : "bg-info/10 text-info"
              )}>
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{p.type.replace("_", " ")}</div>
                  {new Date(p.expiryDate) < new Date() && <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive text-[8px] font-bold rounded uppercase">Archived</span>}
                </div>
                <div className="font-bold text-sm tracking-tight">
                  {p.type === 'insurance' ? `${p.provider} · ` : ""}
                  <span className="font-mono text-muted-foreground">{p.policyNo}</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground/80 mt-1">
                  {fmtDate(p.startDate)} <span className="mx-1 opacity-50">—</span> {fmtDate(p.expiryDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-bold text-sm text-foreground">{fmtCurrency(p.premium)}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Premium Paid</div>
              </div>
              {p.document_path && (
                <div className="flex items-center gap-1 border-l pl-4">
                  <a 
                    href={getViewUrl(p.document_path)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                    title="View Policy"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
}
