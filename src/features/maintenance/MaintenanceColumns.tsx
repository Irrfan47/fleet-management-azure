import { Pencil, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Column } from "@/components/common";
import { fmtDate, fmtNumber, fmtCurrency, downloadFile, getViewUrl } from "@/utils/format";
import type { Maintenance } from "@/types";

interface MaintenanceActionProps {
  onEdit: (m: Maintenance) => void;
  onDelete: (m: Maintenance) => void;
  onPreview?: (url: string) => void;
}

export const useMaintenanceColumns = ({ onEdit, onDelete }: MaintenanceActionProps): Column<Maintenance>[] => [
  {
    key: "vehicle", 
    header: "Vehicle", 
    render: (r) => (
      <div>
        <div className="font-mono font-semibold">{r.vehicle?.regNo || r.vehicleRegNo || "—"}</div>
        <div className="text-xs text-muted-foreground capitalize">{r.type}</div>
      </div>
    )
  },
  { 
    key: "date", 
    header: "Date", 
    render: (r) => (
      <div>
        <div className="text-sm">{fmtDate(r.scheduledDate)}</div>
        <div className="text-xs text-muted-foreground">{fmtNumber(r.odometerAt)} km</div>
      </div>
    )
  },
  { 
    key: "cost", 
    header: "Cost", 
    render: (r) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">{fmtCurrency(r.cost)}</span>
        {r.receipt_path && (
          <div className="flex items-center gap-1">
            <a 
              href={getViewUrl(r.receipt_path)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
              title="View Receipt"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-3.5 w-3.5" />
            </a>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); downloadFile(r.receipt_path!); }} 
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Download Receipt"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    )
  },
  { 
    key: "nextService", 
    header: "Next Service", 
    render: (r) => (
      <div className="text-xs">
        <div>{r.nextServiceDate ? fmtDate(r.nextServiceDate) : "—"}</div>
        <div className="text-muted-foreground">{r.nextServiceOdometer ? `${fmtNumber(r.nextServiceOdometer)} km` : ""}</div>
      </div>
    )
  },
  { 
    key: "status", 
    header: "Status", 
    render: (r) => (
      <StatusBadge 
        label={r.status.replace("_", " ")} 
        tone={r.status === "completed" ? "success" : r.status === "in_progress" ? "info" : "warning"} 
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
