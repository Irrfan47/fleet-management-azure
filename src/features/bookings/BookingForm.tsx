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
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (initial) reset({
      vehicleId: initial.vehicleId, driverId: initial.driverId,
      purpose: initial.purpose, destination: initial.destination,
      startDate: initial.startDate.slice(0, 10), endDate: initial.endDate.slice(0, 10),
    });
  }, [initial, reset]);

  const v = watch();
  const { validate } = useBookingValidation();

  const availableVehicles = useMemo(() => vehicles.filter((x) => x.status !== "disposed"), [vehicles]);

  const submit = async (values: BookingFormValues) => {
    const vehicle = vehicles.find((x) => x.id === values.vehicleId);
    const driver = drivers.find((x) => x.id === values.driverId);
    const result = validate({ vehicle, driver, startDate: values.startDate, endDate: values.endDate, existingBookings: bookings, excludeBookingId: initial?.id });
    if (!result.valid) { toast.error("Booking blocked", { description: result.reason }); return; }
    await onSubmit({ ...values, vehicleRegNo: vehicle!.regNo, driverName: driver!.name });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown label="Vehicle" value={v.vehicleId} onChange={(x) => setValue("vehicleId", x)} options={availableVehicles.map((x) => ({ value: x.id, label: `${x.regNo} · ${x.brand} ${x.model} (${x.status})` }))} error={errors.vehicleId?.message} />
        <SelectDropdown label="Driver" value={v.driverId} onChange={(x) => setValue("driverId", x)} options={drivers.map((x) => ({ value: x.id, label: `${x.name} (${x.status})` }))} error={errors.driverId?.message} />
        <FormInput label="Start date" type="date" {...register("startDate")} error={errors.startDate?.message} />
        <FormInput label="End date" type="date" {...register("endDate")} error={errors.endDate?.message} />
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
