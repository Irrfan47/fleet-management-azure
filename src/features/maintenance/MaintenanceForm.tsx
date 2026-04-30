import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import { MAINTENANCE_STATUS } from "@/utils/constants";
import type { Maintenance, Vehicle } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(["service", "repair", "inspection"]),
  scheduledDate: z.string().min(1),
  odometerAt: z.coerce.number().min(0),
  nextServiceOdometer: z.coerce.number().min(0).optional(),
  nextServiceDate: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  vendor: z.string().trim().min(1).max(100),
  status: z.enum(["scheduled", "in_progress", "completed"]),
  notes: z.string().max(500).optional(),
  receipt_path: z.string().optional(),
});
export type MaintenanceFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Maintenance | null;
  vehicles: Vehicle[];
  onSubmit: (v: MaintenanceFormValues & { vehicleRegNo: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function MaintenanceForm({ initial, vehicles, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleId: "", type: "service",
      scheduledDate: new Date().toISOString().slice(0, 10),
      odometerAt: 0, vendor: "", status: "scheduled", notes: "",
      nextServiceDate: "",
      receipt_path: "",
    },
  });

  useEffect(() => { 
    if (initial) {
      reset({ 
        ...initial, 
        vehicleId: initial.vehicleId.toString(),
        scheduledDate: initial.scheduledDate.slice(0, 10),
        nextServiceDate: initial.nextServiceDate?.slice(0, 10),
      }); 
    } 
  }, [initial, reset]);
  const v = watch();

  const submit = async (values: MaintenanceFormValues) => {
    const veh = vehicles.find((x) => x.id.toString() === values.vehicleId.toString());
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "" });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown 
          label="Vehicle" 
          value={v.vehicleId?.toString()} 
          onChange={(x) => setValue("vehicleId", x)} 
          options={vehicles.map((x) => ({ value: x.id.toString(), label: x.regNo }))} 
          error={errors.vehicleId?.message} 
        />
        <SelectDropdown label="Type" value={v.type} onChange={(x) => setValue("type", x as MaintenanceFormValues["type"])} options={[{ value: "service", label: "Service" }, { value: "repair", label: "Repair" }, { value: "inspection", label: "Inspection" }]} />
        <FormInput label="Scheduled date" type="date" {...register("scheduledDate")} error={errors.scheduledDate?.message} />
        <FormInput label="Odometer (km)" type="number" {...register("odometerAt")} />
        <FormInput label="Next service at (km)" type="number" {...register("nextServiceOdometer")} />
        <FormInput label="Next service target (date)" type="date" {...register("nextServiceDate")} />
        <FormInput label="Cost (MYR)" type="number" {...register("cost")} />
        <FormInput label="Vendor" {...register("vendor")} error={errors.vendor?.message} />
        <SelectDropdown label="Status" value={v.status} onChange={(x) => setValue("status", x as MaintenanceFormValues["status"])} options={Object.entries(MAINTENANCE_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
      </div>
      <FormInput label="Notes" {...register("notes")} />
      <FileUpload 
        label="Receipt / invoice" 
        value={v.receipt_path} 
        folder="maintenance" 
        onChange={(url) => setValue("receipt_path", url)} 
      />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create record"}</Button>
      </div>
    </form>
  );
}
