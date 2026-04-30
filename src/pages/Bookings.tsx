import { useState, useMemo } from "react";
import { Plus, CalendarCheck, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, EmptyState } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/features/bookings/BookingForm";
import { CheckInOutModal } from "@/features/bookings/CheckInOutModal";
import { BookingCalendar } from "@/features/bookings/BookingCalendar";
import { BookingLetter } from "@/features/bookings/BookingLetter";
import { getBookingColumns } from "@/features/bookings/BookingColumns";
import { useBookings, useDrivers, useVehicles } from "@/hooks/resourceHooks";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Booking } from "@/types";

export default function Bookings() {
  const { items: vehicles } = useVehicles();
  const { items: drivers } = useDrivers();
  const { items, loading, create, update, remove } = useBookings();

  const [editing, setEditing] = useState<Booking | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);
  const [checkModal, setCheckModal] = useState<{ booking: Booking; mode: "checkin" | "checkout" } | null>(null);
  const [printBooking, setPrintBooking] = useState<Booking | null>(null);
  const { t } = useLanguage();

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(() => getBookingColumns({
    onCheckIn: (b) => setCheckModal({ booking: b, mode: "checkin" }),
    onCheckOut: (b) => setCheckModal({ booking: b, mode: "checkout" }),
    onApprove: (id) => update(id, { status: "approved" }),
    onReject: (id) => update(id, { status: "rejected" }),
    onEdit: (b) => { setEditing(b); setFormOpen(true); },
    onDelete: (b) => setConfirmDelete(b),
    onPrint: (b) => setPrintBooking(b),
  }), [update]);

  const handleFormSubmit = async (v: any) => {
    if (editing) {
      await update(editing.id, { ...v, status: editing.status } as Partial<Booking>);
    } else {
      await create({ ...v, status: "pending" } as Omit<Booking, "id" | "createdAt" | "updatedAt">);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleCheckConfirm = async (odo: number) => {
    if (!checkModal) return;
    const now = new Date().toISOString();
    const updateData = checkModal.mode === "checkin" 
      ? { status: "in-use" as const, odometerStart: odo, checkInAt: now }
      : { status: "completed" as const, odometerEnd: odo, checkOutAt: now };
    
    await update(checkModal.booking.id, updateData);
    setCheckModal(null);
  };
  
  const renderEmpty = useMemo(() => (
    <EmptyState
      icon={CalendarCheck}
      title={t("no_bookings_found")}
      description={t("no_bookings_desc")}
      actionLabel={t("new_booking")}
      onAction={() => { setEditing(null); setFormOpen(true); }}
    />
  ), [t]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("bookings")}
        description={t("booking_desc")}
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> {t("new_booking")}
          </Button>
        }
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">{t("list_label")}</TabsTrigger>
          <TabsTrigger value="calendar">{t("calendar_label")} (14d)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <ActionTable 
            columns={columns} 
            data={items} 
            loading={loading} 
            renderEmpty={renderEmpty}
            searchPlaceholder={t("search") + "..."} 
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <BookingCalendar items={items} />
        </TabsContent>
      </Tabs>

      <BaseModal 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        title={editing ? t("edit_booking") : t("new_booking")} 
        size="lg"
      >
        <BookingForm
          initial={editing}
          vehicles={vehicles}
          drivers={drivers}
          bookings={items}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </BaseModal>

      <CheckInOutModal
        open={!!checkModal}
        onOpenChange={(o) => !o && setCheckModal(null)}
        booking={checkModal?.booking || null}
        mode={checkModal?.mode || "checkin"}
        onConfirm={handleCheckConfirm}
      />

      <ConfirmModal
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={t("delete_booking_title")}
        description={t("delete_booking_desc")}
        variant="danger"
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onConfirm={async () => {
          if (confirmDelete) {
            await remove(confirmDelete.id);
            setConfirmDelete(null);
          }
        }}
      />

      <BaseModal
        open={!!printBooking}
        onOpenChange={(o) => !o && setPrintBooking(null)}
        title="Official Authorization Letter"
        size="lg"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="border shadow-lg bg-white overflow-auto max-h-[60vh] w-full">
            {printBooking && <BookingLetter booking={printBooking} />}
          </div>
          <div className="flex gap-3 no-print">
            <Button variant="outline" onClick={() => setPrintBooking(null)}>Close</Button>
            <Button onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print Letter
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
