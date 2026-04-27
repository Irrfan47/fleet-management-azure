import { useState } from "react";
import { Plus, Pencil, Trash2, LogIn, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionTable, BaseModal, ConfirmModal, PageHeader, StatusBadge, type Column } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookingForm } from "@/features/bookings/BookingForm";
import { CheckInOutModal } from "@/features/bookings/CheckInOutModal";
import { useBookings, useDrivers, useVehicles } from "@/hooks/resourceHooks";
import { BOOKING_STATUS } from "@/utils/constants";
import { fmtDate } from "@/utils/format";
import { format, parseISO, isSameDay } from "date-fns";
import type { Booking } from "@/types";

export default function Bookings() {
  const { items: vehicles } = useVehicles();
  const { items: drivers } = useDrivers();
  const { items, loading, create, update, remove } = useBookings();

  const [editing, setEditing] = useState<Booking | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);
  const [checkModal, setCheckModal] = useState<{ booking: Booking; mode: "checkin" | "checkout" } | null>(null);

  const columns: Column<Booking>[] = [
    { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono font-semibold">{r.vehicleRegNo}</span> },
    { key: "driverName", header: "Driver" },
    { key: "purpose", header: "Purpose", render: (r) => <div><div className="font-medium">{r.purpose}</div><div className="text-xs text-muted-foreground">→ {r.destination}</div></div> },
    { key: "startDate", header: "Period", render: (r) => <div className="text-sm">{fmtDate(r.startDate)} → {fmtDate(r.endDate)}</div> },
    { key: "status", header: "Status", render: (r) => { const m = BOOKING_STATUS[r.status]; return <StatusBadge label={m.label} tone={m.tone} />; } },
    { key: "actions", header: "", className: "w-44", render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        {r.status === "approved" && (
          <Button variant="ghost" size="icon" onClick={() => setCheckModal({ booking: r, mode: "checkin" })} title="Check-in"><LogIn className="h-4 w-4 text-info" /></Button>
        )}
        {r.status === "checked_in" && (
          <Button variant="ghost" size="icon" onClick={() => setCheckModal({ booking: r, mode: "checkout" })} title="Check-out"><LogOut className="h-4 w-4 text-success" /></Button>
        )}
        {r.status === "pending" && (
          <>
            <Button variant="ghost" size="icon" onClick={() => update(r.id, { status: "approved" })} title="Approve"><CheckCircle2 className="h-4 w-4 text-success" /></Button>
            <Button variant="ghost" size="icon" onClick={() => update(r.id, { status: "rejected" })} title="Reject"><XCircle className="h-4 w-4 text-destructive" /></Button>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    ) },
  ];

  const today = new Date();
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i); return d;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Reserve vehicles, manage check-in/out and approvals"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-1 h-4 w-4" /> New booking</Button>}
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar (14d)</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <ActionTable columns={columns} data={items} loading={loading} searchPlaceholder="Search vehicle, driver, purpose…" />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
            {calendarDays.map((d) => {
              const dayBookings = items.filter((b) => {
                const s = parseISO(b.startDate); const e = parseISO(b.endDate);
                return d >= new Date(s.toDateString()) && d <= new Date(e.toDateString());
              });
              return (
                <Card key={d.toISOString()} className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">{format(d, "EEE")}</span>
                      <span className={`text-lg font-bold ${isSameDay(d, today) ? "text-primary" : ""}`}>{format(d, "dd")}</span>
                    </div>
                    <div className="space-y-1">
                      {dayBookings.length === 0 && <p className="text-[11px] text-muted-foreground">—</p>}
                      {dayBookings.map((b) => (
                        <div key={b.id} className="rounded bg-primary-muted px-2 py-1 text-[11px]">
                          <div className="truncate font-medium text-primary">{b.vehicleRegNo}</div>
                          <div className="truncate text-muted-foreground">{b.driverName}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <BaseModal open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit booking" : "New booking"} size="lg">
        <BookingForm
          initial={editing} vehicles={vehicles} drivers={drivers} bookings={items}
          onSubmit={async (v) => {
            if (editing) await update(editing.id, { ...v, status: editing.status } as Partial<Booking>);
            else await create({ ...v, status: "pending" } as Omit<Booking, "id" | "createdAt" | "updatedAt">);
            setFormOpen(false); setEditing(null);
          }}
          onCancel={() => setFormOpen(false)}
        />
      </BaseModal>

      <CheckInOutModal
        open={!!checkModal} onOpenChange={(o) => !o && setCheckModal(null)}
        booking={checkModal?.booking || null} mode={checkModal?.mode || "checkin"}
        onConfirm={async (odo) => {
          if (!checkModal) return;
          const now = new Date().toISOString();
          if (checkModal.mode === "checkin") {
            await update(checkModal.booking.id, { status: "checked_in", odometerStart: odo, checkInAt: now });
          } else {
            await update(checkModal.booking.id, { status: "completed", odometerEnd: odo, checkOutAt: now });
          }
          setCheckModal(null);
        }}
      />

      <ConfirmModal
        open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete booking?" description="This action cannot be undone."
        variant="danger" confirmLabel="Delete"
        onConfirm={async () => { if (confirmDelete) { await remove(confirmDelete.id); setConfirmDelete(null); } }}
      />
    </div>
  );
}
