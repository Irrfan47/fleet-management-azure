import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO, isSameDay } from "date-fns";
import type { Booking } from "@/types";

interface BookingCalendarProps {
  items: Booking[];
}

export function BookingCalendar({ items }: BookingCalendarProps) {
  const today = new Date();
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
      {calendarDays.map((d) => {
        const dayBookings = items.filter((b) => {
          const s = parseISO(b.startDate);
          const e = parseISO(b.endDate);
          // Set hours to 0 to compare dates only
          const start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
          const end = new Date(e.getFullYear(), e.getMonth(), e.getDate());
          const current = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          return current >= start && current <= end;
        });

        return (
          <Card key={d.toISOString()} className="shadow-sm">
            <CardContent className="p-3">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {format(d, "EEE")}
                </span>
                <span
                  className={`text-lg font-bold ${
                    isSameDay(d, today) ? "text-primary" : ""
                  }`}
                >
                  {format(d, "dd")}
                </span>
              </div>
              <div className="space-y-1">
                {dayBookings.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">—</p>
                )}
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded bg-primary/10 px-2 py-1 text-[11px]"
                  >
                    <div className="truncate font-medium text-primary">
                      {b.vehicleRegNo}
                    </div>
                    <div className="truncate text-muted-foreground">
                      {b.driverName}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
