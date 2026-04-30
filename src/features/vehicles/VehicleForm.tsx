import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  next_service_date: z.string().optional(),
  next_service_odometer: z.coerce.number().min(0).optional(),
  capacity: z.string().optional(),
  load: z.string().optional(),
  image_path: z.string().optional(),
  chassisNo: z.string().trim().min(1).max(50).optional(),
  insurance_policy_no: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_doc_path: z.string().optional(),
  road_tax_ref: z.string().optional(),
  road_tax_doc_path: z.string().optional(),
});
export type VehicleFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Vehicle | null;
  onSubmit: (v: VehicleFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function VehicleForm({ initial, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<VehicleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      regNo: "", type: "", brand: "", model: "", engine: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      status: "available", location: "", department: "",
      insuranceExpiry: new Date().toISOString().slice(0, 10),
      roadTaxExpiry: new Date().toISOString().slice(0, 10),
      class: "department", odometer: 0,
      next_service_date: "", next_service_odometer: 0,
      capacity: "", load: "", image_path: "",
      chassisNo: "",
      insurance_policy_no: "",
      insurance_provider: "",
      insurance_doc_path: "",
      road_tax_ref: "",
      road_tax_doc_path: "",
    },
  });

  const regNo = watch("regNo");

  useEffect(() => {
    if (initial) reset({
      ...initial,
      purchaseDate: initial.purchaseDate?.slice(0, 10) || "",
      insuranceExpiry: initial.insuranceExpiry?.slice(0, 10) || "",
      roadTaxExpiry: initial.roadTaxExpiry?.slice(0, 10) || "",
      next_service_date: initial.next_service_date?.slice(0, 10) || "",
      insurance_provider: initial.insurance_provider || "",
      insurance_doc_path: initial.insurance_doc_path || "",
      road_tax_ref: initial.road_tax_ref || "",
      road_tax_doc_path: initial.road_tax_doc_path || "",
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pinned Top: Image Upload */}
      <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-border/60">
        <Controller
          name="image_path"
          control={control}
          render={({ field }) => (
            <FileUpload 
              label="Vehicle Image" 
              accept="image/*" 
              value={field.value} 
              folder="vehicles"
              subfolder={initial?.id?.toString() || regNo}
              onChange={field.onChange} 
            />
          )}
        />
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Details</TabsTrigger>
          <TabsTrigger value="technical">Technical Specs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Section 1: General Details */}
        <TabsContent value="general" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Registration No" {...register("regNo")} error={errors.regNo?.message} />
            
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SelectDropdown 
                  label="Type" 
                  value={field.value} 
                  onChange={field.onChange} 
                  options={VEHICLE_TYPES.map((x) => ({ value: x, label: x }))} 
                  error={errors.type?.message} 
                />
              )}
            />

            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <SelectDropdown 
                  label="Brand" 
                  value={field.value} 
                  onChange={field.onChange} 
                  options={VEHICLE_BRANDS.map((x) => ({ value: x, label: x }))} 
                  error={errors.brand?.message} 
                />
              )}
            />

            <FormInput label="Model" {...register("model")} error={errors.model?.message} />
            
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <SelectDropdown 
                  label="Class" 
                  value={field.value} 
                  onChange={field.onChange} 
                  options={[{ value: "department", label: "Department" }, { value: "exco", label: "EXCO" }]} 
                  error={errors.class?.message}
                />
              )}
            />

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

            <FormInput label="Location" {...register("location")} error={errors.location?.message} />
            
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectDropdown 
                  label="Status" 
                  value={field.value} 
                  onChange={field.onChange} 
                  options={Object.entries(VEHICLE_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} 
                  error={errors.status?.message}
                />
              )}
            />

            <FormInput label="Purchase Date" type="date" {...register("purchaseDate")} error={errors.purchaseDate?.message} />
          </div>
        </TabsContent>

        {/* Section 2: Technical Specifications */}
        <TabsContent value="technical" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Engine" {...register("engine")} error={errors.engine?.message} />
            <FormInput label="Chassis No" {...register("chassisNo")} error={errors.chassisNo?.message} />
            <FormInput label="Capacity (Engine/Muatan)" {...register("capacity")} error={errors.capacity?.message} />
            <FormInput label="Load Limit" {...register("load")} error={errors.load?.message} />
            <FormInput label="Odometer (km)" type="number" {...register("odometer")} error={errors.odometer?.message} />
          </div>
        </TabsContent>

        {/* Section 3: Compliance & Maintenance */}
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Left: Insurance */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                Insurance Details
              </h4>
              <FormInput label="Insurance Policy No" {...register("insurance_policy_no")} error={errors.insurance_policy_no?.message} />
              <FormInput label="Insurance Provider" {...register("insurance_provider")} error={errors.insurance_provider?.message} />
              <FormInput label="Insurance Expiry" type="date" {...register("insuranceExpiry")} error={errors.insuranceExpiry?.message} />
              <Controller
                name="insurance_doc_path"
                control={control}
                render={({ field }) => (
                  <FileUpload 
                    label="Insurance Document (Scan)" 
                    accept="application/pdf,image/*" 
                    value={field.value} 
                    folder="insurance"
                    subfolder={initial?.id?.toString() || watch("regNo")}
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>

            {/* Right: Road Tax */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                Road Tax Details
              </h4>
              <FormInput label="Road Tax Reference (Serial)" {...register("road_tax_ref")} error={errors.road_tax_ref?.message} />
              <FormInput label="Road Tax Expiry" type="date" {...register("roadTaxExpiry")} error={errors.roadTaxExpiry?.message} />
              <Controller
                name="road_tax_doc_path"
                control={control}
                render={({ field }) => (
                  <FileUpload 
                    label="Road Tax Document (Scan)" 
                    accept="application/pdf,image/*" 
                    value={field.value} 
                    folder="road_tax"
                    subfolder={initial?.id?.toString() || watch("regNo")}
                    onChange={field.onChange} 
                  />
                )}
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              Next Service Tracking
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Next Service Date" type="date" {...register("next_service_date")} error={errors.next_service_date?.message} />
              <FormInput label="Next Service Odometer" type="number" {...register("next_service_odometer")} error={errors.next_service_odometer?.message} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create vehicle"}</Button>
      </div>
    </form>
  );
}
