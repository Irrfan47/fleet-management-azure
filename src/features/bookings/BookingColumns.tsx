import { Pencil, Trash2, LogIn, LogOut, CheckCircle2, XCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Column } from "@/components/common";
import { BOOKING_STATUS } from "@/utils/constants";
import { fmtDate, fmtDateTime } from "@/utils/format";
import type { Booking } from "@/types";

interface BookingColumnHandlers {
  onCheckIn: (booking: Booking) => void;
  onCheckOut: (booking: Booking) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onPrint: (booking: Booking) => void;
}

export const getBookingColumns = (handlers: BookingColumnHandlers): Column<Booking>[] => [
  { 
    key: "vehicleRegNo", 
    header: "Vehicle", 
    render: (r) => <span className="font-mono font-semibold">{r.vehicle?.regNo || r.vehicleRegNo || "—"}</span> 
  },
  { 
    key: "driverName", 
    header: "Driver",
    render: (r) => <span>{r.driver?.name || r.driverName || "—"}</span>
  },
  { 
    key: "purpose", 
    header: "Purpose", 
    render: (r) => (
      <div>
        <div className="font-medium">{r.purpose}</div>
        <div className="text-xs text-muted-foreground">→ {r.destination}</div>
      </div>
    ) 
  },
  { 
    key: "startDate", 
    header: "Period", 
    render: (r) => (
      <div className="text-xs space-y-0.5">
        <div className="text-muted-foreground">Start: {fmtDateTime(r.startDate)}</div>
        <div className="text-muted-foreground">End: {fmtDateTime(r.endDate)}</div>
      </div>
    ) 
  },
  { 
    key: "status", 
    header: "Status", 
    render: (r) => { 
      const m = BOOKING_STATUS[r.status]; 
      return <StatusBadge label={m.label} tone={m.tone} />; 
    } 
  },
  { 
    key: "actions", 
    header: "", 
    className: "w-44", 
    render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        {r.status === "approved" && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handlers.onCheckIn(r)} 
            title="Check-in"
          >
            <LogIn className="h-4 w-4 text-info" />
          </Button>
        )}
        {r.status === "in-use" && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handlers.onCheckOut(r)} 
            title="Check-out"
          >
            <LogOut className="h-4 w-4 text-success" />
          </Button>
        )}
        {r.status === "pending" && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handlers.onApprove(r.id)} 
              title="Approve"
            >
              <CheckCircle2 className="h-4 w-4 text-success" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handlers.onReject(r.id)} 
              title="Reject"
            >
              <XCircle className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
        {(r.status === "in-use" || r.status === "completed" || r.status === "approved") && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handlers.onPrint(r)} 
            title="Print Letter"
          >
            <Printer className="h-4 w-4 text-primary" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handlers.onEdit(r)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handlers.onDelete(r)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ) 
  },
];
