import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown } from "@/components/common";
import { FINE_STATUS } from "@/utils/constants";
import type { Fine, Vehicle, Driver } from "@/types";

const schema = z.object({
  driverId: z.string().min(1),
  vehicleId: z.string().min(1),
  offence: z.string().trim().min(2).max(200),
  amount: z.coerce.number().min(0),
  date: z.string().min(1),
  status: z.enum(["unpaid", "paid", "appealed"]),
  ticketNo: z.string().trim().min(1).max(50),
});
export type FineFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Fine | null;
  vehicles: Vehicle[]; drivers: Driver[];
  onSubmit: (v: FineFormValues & { vehicleRegNo: string; driverName: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function FineForm({ initial, vehicles, drivers, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FineFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { driverId: "", vehicleId: "", offence: "", amount: 0, date: new Date().toISOString().slice(0, 10), status: "unpaid", ticketNo: "" },
  });
  useEffect(() => { if (initial) reset({ ...initial, date: initial.date.slice(0, 10) }); }, [initial, reset]);
  const v = watch();
  const submit = async (values: FineFormValues) => {
    const veh = vehicles.find((x) => x.id === values.vehicleId);
    const drv = drivers.find((x) => x.id === values.driverId);
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "", driverName: drv?.name || "" });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown label="Driver" value={v.driverId} onChange={(x) => setValue("driverId", x)} options={drivers.map((x) => ({ value: x.id, label: x.name }))} error={errors.driverId?.message} />
        <SelectDropdown label="Vehicle" value={v.vehicleId} onChange={(x) => setValue("vehicleId", x)} options={vehicles.map((x) => ({ value: x.id, label: x.regNo }))} error={errors.vehicleId?.message} />
        <FormInput label="Ticket No" {...register("ticketNo")} error={errors.ticketNo?.message} />
        <FormInput label="Date" type="date" {...register("date")} />
        <FormInput label="Amount (MYR)" type="number" {...register("amount")} />
        <SelectDropdown label="Status" value={v.status} onChange={(x) => setValue("status", x as FineFormValues["status"])} options={Object.entries(FINE_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
      </div>
      <FormInput label="Offence" {...register("offence")} error={errors.offence?.message} />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Add fine"}</Button>
      </div>
    </form>
  );
}
