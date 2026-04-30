import { useState, useMemo } from "react";
import { useInsurance, useVehicles } from "@/hooks/resourceHooks";
import { getInsuranceColumns } from "@/features/insurance/InsuranceColumns";
import type { InsurancePolicy } from "@/types";

export function useInsurancePage() {
  const { items: vehicles } = useVehicles();
  const { items, loading, create, update, remove } = useInsurance();
  
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [historyOpen, setHistoryOpen] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const groupedItems = useMemo(() => {
    return vehicles.map((v) => {
      const vehiclePolicies = items.filter((p) => p.vehicleId.toString() === v.id.toString());
      
      const sorted = [...vehiclePolicies].sort(
        (a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
      );

      const insurance = sorted.find((p) => p.type === "insurance");
      const roadTax = sorted.find((p) => p.type === "road_tax");
      const history = sorted.filter((p) => p.id !== insurance?.id && p.id !== roadTax?.id);

      return {
        id: v.id.toString(),
        vehicleId: v.id.toString(),
        regNo: v.regNo,
        image_path: v.image_path,
        insurance,
        roadTax,
        history,
      };
    });
  }, [items, vehicles]);

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const expiringSoon = items.filter(p => {
      const expiry = new Date(p.expiryDate);
      return expiry > now && expiry <= thirtyDaysFromNow;
    }).length;

    const expiringUrgent = items.filter(p => {
      const expiry = new Date(p.expiryDate);
      return expiry > now && expiry <= sevenDaysFromNow;
    }).length;

    const expired = items.filter(p => new Date(p.expiryDate) < now).length;
    const totalPremium = items.reduce((sum, p) => sum + Number(p.premium || 0), 0);

    return { expiringSoon, expiringUrgent, expired, totalPremium, totalActive: groupedItems.length };
  }, [items, groupedItems]);

  const columns = useMemo(() => getInsuranceColumns({
    onEdit: (r) => { setIsRenewal(false); setEditingGroup(r); setFormOpen(true); },
    onDelete: (r) => setConfirmDelete(r),
    onRenew: (r) => { setIsRenewal(true); setEditingGroup(r); setFormOpen(true); },
    onViewHistory: (r) => setHistoryOpen(r),
    onPreview: () => {}, 
  }) as any, []);

  const handleFormSubmit = async (v: any) => {
    const existingPolicy = v.type === "insurance" ? editingGroup?.insurance : editingGroup?.roadTax;
    
    if (existingPolicy?.id && !isRenewal) {
      await update(existingPolicy.id, v as Partial<InsurancePolicy>);
    } else {
      await create(v as Omit<InsurancePolicy, "id" | "createdAt" | "updatedAt">);
    }
    setFormOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete) { 
      if (confirmDelete.insurance) await remove(confirmDelete.insurance.id);
      if (confirmDelete.roadTax) await remove(confirmDelete.roadTax.id);
      setConfirmDelete(null); 
    } 
  };

  const openAddModal = () => {
    setEditingGroup(null);
    setFormOpen(true);
  };

  return {
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
  };
}
