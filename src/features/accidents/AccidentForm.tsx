import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import { CLAIM_STATUS } from "@/utils/constants";
import type { Accident, Vehicle, Driver } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
  date: z.string().min(1),
  location: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(500),
  claimStatus: z.enum(["pending", "in_review", "approved", "completed", "rejected"]),
  claimProgress: z.coerce.number().min(0).max(100),
  estimatedCost: z.coerce.number().min(0),
});
export type AccidentFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Accident | null;
  vehicles: Vehicle[]; drivers: Driver[];
  onSubmit: (v: AccidentFormValues & { vehicleRegNo: string; driverName: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function AccidentForm({ initial, vehicles, drivers, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<AccidentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleId: "", driverId: "", date: new Date().toISOString().slice(0, 10), location: "", description: "", claimStatus: "pending", claimProgress: 0, estimatedCost: 0 },
  });

  useEffect(() => { if (initial) reset({ ...initial, date: initial.date.slice(0, 10) }); }, [initial, reset]);
  const v = watch();

  const submit = async (values: AccidentFormValues) => {
    const veh = vehicles.find((x) => x.id === values.vehicleId);
    const drv = drivers.find((x) => x.id === values.driverId);
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "", driverName: drv?.name || "" });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown label="Vehicle" value={v.vehicleId} onChange={(x) => setValue("vehicleId", x)} options={vehicles.map((x) => ({ value: x.id, label: x.regNo }))} error={errors.vehicleId?.message} />
        <SelectDropdown label="Driver" value={v.driverId} onChange={(x) => setValue("driverId", x)} options={drivers.map((x) => ({ value: x.id, label: x.name }))} error={errors.driverId?.message} />
        <FormInput label="Date" type="date" {...register("date")} />
        <FormInput label="Location" {...register("location")} error={errors.location?.message} />
        <SelectDropdown label="Claim status" value={v.claimStatus} onChange={(x) => setValue("claimStatus", x as AccidentFormValues["claimStatus"])} options={Object.entries(CLAIM_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
        <FormInput label="Claim progress (%)" type="number" min={0} max={100} {...register("claimProgress")} />
        <FormInput label="Estimated cost (MYR)" type="number" {...register("estimatedCost")} />
      </div>
      <FormInput label="Description" {...register("description")} error={errors.description?.message} />
      <FileUpload label="Police report" accept=".pdf,image/*" />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Log accident"}</Button>
      </div>
    </form>
  );
}
