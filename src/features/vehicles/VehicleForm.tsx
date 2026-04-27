import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown } from "@/components/common";
import { DEPARTMENTS, VEHICLE_BRANDS, VEHICLE_TYPES, VEHICLE_STATUS } from "@/utils/constants";
import type { Vehicle } from "@/types";

const schema = z.object({
  regNo: z.string().trim().min(2).max(20),
  type: z.string().min(1, "Required"),
  brand: z.string().min(1, "Required"),
  model: z.string().trim().min(1).max(50),
  engine: z.string().trim().min(1).max(50),
  purchaseDate: z.string().min(1, "Required"),
  status: z.enum(["available", "in_use", "maintenance", "disposed"]),
  location: z.string().trim().min(1).max(100),
  department: z.string().min(1, "Required"),
  insuranceExpiry: z.string().min(1, "Required"),
  roadTaxExpiry: z.string().min(1, "Required"),
  class: z.enum(["department", "exco"]),
  odometer: z.coerce.number().min(0),
});
export type VehicleFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Vehicle | null;
  onSubmit: (v: VehicleFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function VehicleForm({ initial, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<VehicleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      regNo: "", type: "", brand: "", model: "", engine: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      status: "available", location: "", department: "",
      insuranceExpiry: new Date().toISOString().slice(0, 10),
      roadTaxExpiry: new Date().toISOString().slice(0, 10),
      class: "department", odometer: 0,
    },
  });

  useEffect(() => {
    if (initial) reset({
      ...initial,
      purchaseDate: initial.purchaseDate.slice(0, 10),
      insuranceExpiry: initial.insuranceExpiry.slice(0, 10),
      roadTaxExpiry: initial.roadTaxExpiry.slice(0, 10),
    });
  }, [initial, reset]);

  const v = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Registration No" {...register("regNo")} error={errors.regNo?.message} />
        <SelectDropdown label="Type" value={v.type} onChange={(x) => setValue("type", x)} options={VEHICLE_TYPES.map((x) => ({ value: x, label: x }))} error={errors.type?.message} />
        <SelectDropdown label="Brand" value={v.brand} onChange={(x) => setValue("brand", x)} options={VEHICLE_BRANDS.map((x) => ({ value: x, label: x }))} error={errors.brand?.message} />
        <FormInput label="Model" {...register("model")} error={errors.model?.message} />
        <FormInput label="Engine" {...register("engine")} error={errors.engine?.message} />
        <FormInput label="Odometer (km)" type="number" {...register("odometer")} error={errors.odometer?.message} />
        <FormInput label="Purchase Date" type="date" {...register("purchaseDate")} error={errors.purchaseDate?.message} />
        <SelectDropdown label="Status" value={v.status} onChange={(x) => setValue("status", x as VehicleFormValues["status"])} options={Object.entries(VEHICLE_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
        <FormInput label="Location" {...register("location")} error={errors.location?.message} />
        <SelectDropdown label="Department" value={v.department} onChange={(x) => setValue("department", x)} options={DEPARTMENTS.map((x) => ({ value: x, label: x }))} error={errors.department?.message} />
        <SelectDropdown label="Class" value={v.class} onChange={(x) => setValue("class", x as "department" | "exco")} options={[{ value: "department", label: "Department" }, { value: "exco", label: "EXCO" }]} />
        <FormInput label="Insurance Expiry" type="date" {...register("insuranceExpiry")} error={errors.insuranceExpiry?.message} />
        <FormInput label="Road Tax Expiry" type="date" {...register("roadTaxExpiry")} error={errors.roadTaxExpiry?.message} />
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create vehicle"}</Button>
      </div>
    </form>
  );
}
