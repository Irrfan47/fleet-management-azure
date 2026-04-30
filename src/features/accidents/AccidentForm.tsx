import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload, MultiFileUpload } from "@/components/common";
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
  report_path: z.string().optional(),
  images: z.array(z.string()).optional(),
});
export type AccidentFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Accident | null;
  vehicles: Vehicle[]; drivers: Driver[];
  onSubmit: (v: AccidentFormValues & { vehicleRegNo: string; driverName: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function AccidentForm({ initial, vehicles, drivers, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AccidentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleId: "", driverId: "", date: new Date().toISOString().slice(0, 10), location: "", description: "", claimStatus: "pending", claimProgress: 0, estimatedCost: 0, report_path: "", images: [] },
  });

  useEffect(() => { 
    if (initial) reset({ 
      ...initial, 
      vehicleId: initial.vehicleId.toString(),
      driverId: initial.driverId.toString(),
      date: initial.date.slice(0, 10) 
    }); 
  }, [initial, reset]);

  const submit = async (values: AccidentFormValues) => {
    const veh = vehicles.find((x) => x.id.toString() === values.vehicleId.toString());
    const drv = drivers.find((x) => x.id.toString() === values.driverId.toString());
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "", driverName: drv?.name || "" });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="vehicleId"
          control={control}
          render={({ field }) => (
            <SelectDropdown 
              label="Vehicle" 
              value={field.value?.toString()} 
              onChange={field.onChange} 
              options={vehicles.map((x) => ({ value: x.id.toString(), label: x.regNo }))} 
              error={errors.vehicleId?.message} 
            />
          )}
        />
        <Controller
          name="driverId"
          control={control}
          render={({ field }) => (
            <SelectDropdown 
              label="Driver" 
              value={field.value?.toString()} 
              onChange={field.onChange} 
              options={drivers.map((x) => ({ value: x.id.toString(), label: x.name }))} 
              error={errors.driverId?.message} 
            />
          )}
        />
        <FormInput label="Date" type="date" {...register("date")} />
        <FormInput label="Location" {...register("location")} error={errors.location?.message} />
        <Controller
          name="claimStatus"
          control={control}
          render={({ field }) => (
            <SelectDropdown 
              label="Claim status" 
              value={field.value} 
              onChange={field.onChange} 
              options={Object.entries(CLAIM_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} 
            />
          )}
        />
        <FormInput label="Claim progress (%)" type="number" min={0} max={100} {...register("claimProgress")} />
        <FormInput label="Estimated cost (MYR)" type="number" {...register("estimatedCost")} />
      </div>
      <FormInput label="Description" {...register("description")} error={errors.description?.message} />
      
      <Controller
        name="report_path"
        control={control}
        render={({ field }) => (
          <FileUpload 
            label="Police report (RDP)" 
            accept=".pdf,image/*" 
            value={field.value} 
            folder="accidents"
            onChange={field.onChange} 
          />
        )}
      />

      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <MultiFileUpload 
            label="Accident Photos (Multiple)" 
            folder="accidents"
            values={field.value}
            onChange={field.onChange} 
          />
        )}
      />

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Log accident"}</Button>
      </div>
    </form>
  );
}
