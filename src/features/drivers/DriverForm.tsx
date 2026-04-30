import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import { DEPARTMENTS, DRIVER_STATUS } from "@/utils/constants";
import type { Driver } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  licenseNo: z.string().trim().min(3).max(30),
  license_type: z.string().min(1, "Required"),
  licenseExpiry: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  status: z.enum(["active", "suspended"]),
  ic_no: z.string().trim().min(5).max(20),
  joinedAt: z.string().optional(),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  fineCount: z.coerce.number().min(0),
  accidentCount: z.coerce.number().min(0),
  image_path: z.string().optional(),
});
export type DriverFormValues = z.infer<typeof schema>;

interface Props { initial?: Driver | null; onSubmit: (v: DriverFormValues) => Promise<void> | void; onCancel: () => void; }

export function DriverForm({ initial, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<DriverFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { 
      name: "", ic_no: "", licenseNo: "", license_type: "D", licenseExpiry: "", 
      department: "", status: "active", phone: "", email: "", 
      fineCount: 0, accidentCount: 0, joinedAt: "", image_path: "" 
    },
  });

  useEffect(() => { 
    if (initial) {
      reset({
        ...initial,
        licenseExpiry: initial.licenseExpiry?.slice(0, 10),
        joinedAt: initial.joinedAt?.slice(0, 10),
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Full name" {...register("name")} error={errors.name?.message} />
        <FormInput label="IC No (No. KP)" {...register("ic_no")} error={errors.ic_no?.message} />
        <FormInput label="License No" {...register("licenseNo")} error={errors.licenseNo?.message} />
        <FormInput label="License Type (e.g. D, B2)" {...register("license_type")} error={errors.license_type?.message} />
        <FormInput label="License Expiry" type="date" {...register("licenseExpiry")} error={errors.licenseExpiry?.message} />
        
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <SelectDropdown 
              label="Department" 
              value={field.value} 
              onChange={field.onChange} 
              options={DEPARTMENTS.map((x) => ({ value: x, label: x }))} 
              error={errors.department?.message} 
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <SelectDropdown 
              label="Status" 
              value={field.value} 
              onChange={field.onChange} 
              options={Object.entries(DRIVER_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} 
            />
          )}
        />

        <FormInput label="Phone" {...register("phone")} error={errors.phone?.message} />
        <FormInput label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <FormInput label="Joined Date" type="date" {...register("joinedAt")} />
        <FormInput label="Fines (count)" type="number" {...register("fineCount")} />
        <FormInput label="Accidents (count)" type="number" {...register("accidentCount")} />
      </div>

      <Controller
        name="image_path"
        control={control}
        render={({ field }) => (
          <FileUpload 
            label="Driver Image" 
            accept="image/*" 
            value={field.value} 
            folder="drivers"
            onChange={field.onChange} 
          />
        )}
      />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create driver"}</Button>
      </div>
    </form>
  );
}
