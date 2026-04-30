import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown } from "@/components/common";
import { useBookingValidation } from "@/hooks/useBookingValidation";
import type { Booking, Vehicle, Driver } from "@/types";
import { toast } from "sonner";

const schema = z.object({
  vehicleId: z.string().min(1, "Required"),
  driverId: z.string().min(1, "Required"),
  purpose: z.string().trim().min(2).max(200),
  destination: z.string().trim().min(2).max(200),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});
export type BookingFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Booking | null;
  vehicles: Vehicle[];
  drivers: Driver[];
  bookings: Booking[];
  onSubmit: (v: BookingFormValues & { vehicleRegNo: string; driverName: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function BookingForm({ initial, vehicles, drivers, bookings, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleId: "", driverId: "", purpose: "", destination: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date().toISOString().slice(0, 16),
    },
  });

  useEffect(() => {
    if (initial) reset({
      vehicleId: initial.vehicleId.toString(), 
      driverId: initial.driverId.toString(),
      purpose: initial.purpose, destination: initial.destination,
      startDate: initial.startDate.slice(0, 16).replace(" ", "T"), 
      endDate: initial.endDate.slice(0, 16).replace(" ", "T"),
    });
  }, [initial, reset]);

  const v = watch();
  const { validate } = useBookingValidation();

  // Aligning with Flowchart 2.1: Only show available vehicles & active drivers
  // But include the currently selected ones if editing
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((x) => 
      x.status === "available" || x.id.toString() === initial?.vehicleId?.toString()
    );
  }, [vehicles, initial]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((x) => 
      x.status === "active" || x.id.toString() === initial?.driverId?.toString()
    );
  }, [drivers, initial]);

  const submit = async (values: BookingFormValues) => {
    const vehicle = vehicles.find((x) => x.id.toString() === values.vehicleId.toString());
    const driver = drivers.find((x) => x.id.toString() === values.driverId.toString());
    
    // Client-side flowchart checks
    if (!initial && driver?.status !== 'active') {
      toast.error("Driver not active", { description: "Cannot create booking for an inactive driver." });
      return;
    }
    if (!initial && vehicle?.status !== 'available') {
      toast.error("Vehicle not available", { description: `Vehicle is currently ${vehicle?.status}` });
      return;
    }

    const result = validate({ 
      vehicle, 
      driver, 
      startDate: values.startDate, 
      endDate: values.endDate, 
      existingBookings: bookings, 
      excludeBookingId: initial?.id 
    });

    if (!result.valid) { 
      toast.error("Booking blocked", { description: result.reason }); 
      return; 
    }

    await onSubmit({ ...values, vehicleRegNo: vehicle!.regNo, driverName: driver!.name });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown 
          label="Vehicle" 
          value={v.vehicleId?.toString()} 
          onChange={(x) => setValue("vehicleId", x)} 
          options={filteredVehicles.map((x) => ({ 
            value: x.id.toString(), 
            label: `${x.regNo} · ${x.brand} ${x.model} (${x.status})` 
          }))} 
          error={errors.vehicleId?.message} 
        />
        <SelectDropdown 
          label="Driver" 
          value={v.driverId?.toString()} 
          onChange={(x) => setValue("driverId", x)} 
          options={filteredDrivers.map((x) => ({ 
            value: x.id.toString(), 
            label: `${x.name} (${x.status})` 
          }))} 
          error={errors.driverId?.message} 
        />
        <FormInput label="Start Date / Time" type="datetime-local" {...register("startDate")} error={errors.startDate?.message} />
        <FormInput label="End Date / Time" type="datetime-local" {...register("endDate")} error={errors.endDate?.message} />
        <FormInput label="Purpose" {...register("purpose")} error={errors.purpose?.message} />
        <FormInput label="Destination" {...register("destination")} error={errors.destination?.message} />
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create booking"}</Button>
      </div>
    </form>
  );
}
