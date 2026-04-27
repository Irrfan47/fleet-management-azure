import { useState } from "react";
import { BaseModal, FormInput } from "@/components/common";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import type { Booking } from "@/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  booking: Booking | null;
  mode: "checkin" | "checkout";
  onConfirm: (odometer: number) => Promise<void> | void;
}

export function CheckInOutModal({ open, onOpenChange, booking, mode, onConfirm }: Props) {
  const [odometer, setOdometer] = useState("");

  const submit = async () => {
    const value = Number(odometer);
    if (!Number.isFinite(value) || value <= 0) { toast.error("Enter a valid odometer reading"); return; }
    if (mode === "checkout" && booking?.odometerStart != null && value < booking.odometerStart) {
      toast.error(`Odometer must be ≥ ${booking.odometerStart} (start reading)`); return;
    }
    await onConfirm(value);
    setOdometer("");
  };

  const Icon = mode === "checkin" ? LogIn : LogOut;
  const title = mode === "checkin" ? "Check-in vehicle" : "Check-out vehicle";

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-primary-muted p-3 text-sm">
          <Icon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{booking?.vehicleRegNo}</p>
            <p className="text-xs text-muted-foreground">Driver: {booking?.driverName}</p>
          </div>
        </div>
        <FormInput
          label={`Odometer reading (${mode === "checkin" ? "start" : "end"}) — km`}
          type="number"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
          hint={mode === "checkout" && booking?.odometerStart ? `Start was ${booking.odometerStart} km` : undefined}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Confirm {mode === "checkin" ? "check-in" : "check-out"}</Button>
        </div>
      </div>
    </BaseModal>
  );
}
