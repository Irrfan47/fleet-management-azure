import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Column } from "@/components/common";
import type { Driver } from "@/types";
import { getAssetUrl } from "@/utils/format";

interface DriverActionProps {
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const useDriverColumns = ({ onEdit, onDelete }: DriverActionProps): Column<Driver>[] => [
  { 
    key: "name", 
    header: "Driver", 
    render: (r) => (
      <div className="flex items-center gap-3">
        {r.image_path ? (
          <img src={getAssetUrl(r.image_path)} alt={r.name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {r.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <Link to={`/drivers/${r.id}`} className="font-medium hover:underline text-primary">{r.name}</Link>
          <div className="text-xs text-muted-foreground">{r.email}</div>
        </div>
      </div>
    )
  },
  { key: "licenseNo", header: "License" },
  { key: "department", header: "Department" },
  { key: "phone", header: "Phone" },
  { 
    key: "stats", 
    header: "Record", 
    render: (r) => (
      <div className="text-xs">
        <div>Fines: <span className={r.fineCount > 0 ? "font-bold text-destructive" : ""}>{r.fineCount}</span></div>
        <div>Accidents: <span className={r.accidentCount > 0 ? "font-bold text-destructive" : ""}>{r.accidentCount}</span></div>
      </div>
    )
  },
  { 
    key: "status", 
    header: "Status", 
    render: (r) => (
      <StatusBadge 
        label={r.status.charAt(0).toUpperCase() + r.status.slice(1)} 
        tone={r.status === "active" ? "success" : "warning"} 
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
