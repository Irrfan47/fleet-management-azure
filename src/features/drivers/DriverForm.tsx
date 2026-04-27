import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown } from "@/components/common";
import { DEPARTMENTS, DRIVER_STATUS } from "@/utils/constants";
import type { Driver } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  licenseNo: z.string().trim().min(3).max(30),
  department: z.string().min(1, "Required"),
  status: z.enum(["active", "suspended"]),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  fineCount: z.coerce.number().min(0),
  accidentCount: z.coerce.number().min(0),
});
export type DriverFormValues = z.infer<typeof schema>;

interface Props { initial?: Driver | null; onSubmit: (v: DriverFormValues) => Promise<void> | void; onCancel: () => void; }

export function DriverForm({ initial, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<DriverFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", licenseNo: "", department: "", status: "active", phone: "", email: "", fineCount: 0, accidentCount: 0 },
  });

  useEffect(() => { if (initial) reset(initial); }, [initial, reset]);
  const v = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Full name" {...register("name")} error={errors.name?.message} />
        <FormInput label="License No" {...register("licenseNo")} error={errors.licenseNo?.message} />
        <SelectDropdown label="Department" value={v.department} onChange={(x) => setValue("department", x)} options={DEPARTMENTS.map((x) => ({ value: x, label: x }))} error={errors.department?.message} />
        <SelectDropdown label="Status" value={v.status} onChange={(x) => setValue("status", x as "active" | "suspended")} options={Object.entries(DRIVER_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
        <FormInput label="Phone" {...register("phone")} error={errors.phone?.message} />
        <FormInput label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <FormInput label="Fines (count)" type="number" {...register("fineCount")} />
        <FormInput label="Accidents (count)" type="number" {...register("accidentCount")} />
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create driver"}</Button>
      </div>
    </form>
  );
}
