import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Column } from "@/components/common";
import { fmtDate, fmtCurrency } from "@/utils/format";
import type { Fine } from "@/types";

interface FineActionProps {
  onEdit: (f: Fine) => void;
  onDelete: (f: Fine) => void;
}

export const useFineColumns = ({ onEdit, onDelete }: FineActionProps): Column<Fine>[] => [
  { 
    key: "ticketNo", 
    header: "Ticket No", 
    render: (r) => (
      <div>
        <div className="font-mono font-semibold">{r.ticketNo}</div>
        <div className="text-xs text-muted-foreground">{r.offence}</div>
      </div>
    )
  },
  { key: "driverName", header: "Driver" },
  { key: "vehicleRegNo", header: "Vehicle", render: (r) => <span className="font-mono">{r.vehicleRegNo}</span> },
  { key: "amount", header: "Amount", render: (r) => <span className="font-medium">{fmtCurrency(r.amount)}</span> },
  { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
  { 
    key: "status", 
    header: "Status", 
    render: (r) => (
      <StatusBadge 
        label={r.status} 
        tone={r.status === "paid" ? "success" : "destructive"} 
      />
    )
  },
  {
    key: "actions",
    header: "",
    className: "w-24",
    render: (r) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(r)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];
