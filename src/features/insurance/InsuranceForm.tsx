import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import type { InsurancePolicy, Vehicle } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(["insurance", "road_tax"]),
  policyNo: z.string().trim().min(1).max(50),
  provider: z.string().trim().min(1).max(100),
  startDate: z.string().min(1),
  expiryDate: z.string().min(1),
  premium: z.coerce.number().min(0),
});
export type InsuranceFormValues = z.infer<typeof schema>;

interface Props {
  initial?: InsurancePolicy | null;
  vehicles: Vehicle[];
  onSubmit: (v: InsuranceFormValues & { vehicleRegNo: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function InsuranceForm({ initial, vehicles, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<InsuranceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleId: "", type: "insurance", policyNo: "", provider: "", startDate: new Date().toISOString().slice(0, 10), expiryDate: new Date().toISOString().slice(0, 10), premium: 0 },
  });

  useEffect(() => { if (initial) reset({ ...initial, startDate: initial.startDate.slice(0, 10), expiryDate: initial.expiryDate.slice(0, 10) }); }, [initial, reset]);
  const v = watch();

  const submit = async (values: InsuranceFormValues) => {
    const veh = vehicles.find((x) => x.id === values.vehicleId);
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "" });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown label="Vehicle" value={v.vehicleId} onChange={(x) => setValue("vehicleId", x)} options={vehicles.map((x) => ({ value: x.id, label: x.regNo }))} error={errors.vehicleId?.message} />
        <SelectDropdown label="Type" value={v.type} onChange={(x) => setValue("type", x as InsuranceFormValues["type"])} options={[{ value: "insurance", label: "Insurance" }, { value: "road_tax", label: "Road Tax" }]} />
        <FormInput label="Policy / Receipt No" {...register("policyNo")} error={errors.policyNo?.message} />
        <FormInput label="Provider" {...register("provider")} error={errors.provider?.message} />
        <FormInput label="Start date" type="date" {...register("startDate")} />
        <FormInput label="Expiry date" type="date" {...register("expiryDate")} />
        <FormInput label="Premium (MYR)" type="number" {...register("premium")} />
      </div>
      <FileUpload label="Policy document" />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Renew / Update" : "Add policy"}</Button>
      </div>
    </form>
  );
}
