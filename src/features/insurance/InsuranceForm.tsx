import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown, FileUpload } from "@/components/common";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { InsurancePolicy, Vehicle } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(["insurance", "road_tax"]),
  policyNo: z.string().trim().min(1, "Required").max(50),
  provider: z.string().trim().min(1, "Required").max(100),
  startDate: z.string().min(1, "Required"),
  expiryDate: z.string().min(1, "Required"),
  premium: z.coerce.number().min(0),
  document_path: z.string().nullable().optional().or(z.literal("")),
});
export type InsuranceFormValues = z.infer<typeof schema>;

interface Props {
  initialGroup?: any; 
  vehicles: Vehicle[];
  isRenewal?: boolean;
  onSubmit: (v: InsuranceFormValues & { vehicleRegNo: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function InsuranceForm({ initialGroup, vehicles, isRenewal, onSubmit, onCancel }: Props) {
  const [activeTab, setActiveTab] = useState<"insurance" | "road_tax">("insurance");
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<InsuranceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { 
      vehicleId: initialGroup?.vehicleId || "", 
      type: "insurance", 
      policyNo: "", 
      provider: "", 
      startDate: new Date().toISOString().slice(0, 10), 
      expiryDate: new Date().toISOString().slice(0, 10), 
      premium: 0, 
      document_path: "" 
    },
  });

  const v = watch();

  // Update form values when tab changes or initial data loads
  useEffect(() => {
    const policy = activeTab === "insurance" ? initialGroup?.insurance : initialGroup?.roadTax;
    if (policy) {
      if (isRenewal) {
        // PRE-FILL for renewal but strip ID and dates to force new record
        reset({
          vehicleId: initialGroup.vehicleId.toString(),
          type: activeTab,
          policyNo: policy.policyNo,
          provider: policy.provider,
          startDate: new Date().toISOString().slice(0, 10),
          expiryDate: new Date().toISOString().slice(0, 10),
          premium: 0,
          document_path: ""
        });
      } else {
        // EDIT existing record
        reset({ 
          ...policy, 
          type: activeTab, 
          vehicleId: initialGroup.vehicleId.toString(),
          startDate: policy.startDate.slice(0, 10), 
          expiryDate: policy.expiryDate.slice(0, 10),
          document_path: policy.document_path || "" 
        });
      }
    } else {
      // Reset to defaults for this type
      reset({
        vehicleId: initialGroup?.vehicleId?.toString() || v.vehicleId || "",
        type: activeTab,
        policyNo: activeTab === "road_tax" ? `ROADTAX-${initialGroup?.regNo || ""}` : "",
        provider: activeTab === "road_tax" ? "JPJ" : "",
        startDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date().toISOString().slice(0, 10),
        premium: 0,
        document_path: ""
      });
    }
  }, [activeTab, initialGroup, reset]);

  // Autofill logic for brand new entries (no initialGroup data for this tab)
  useEffect(() => {
    const policy = activeTab === "insurance" ? initialGroup?.insurance : initialGroup?.roadTax;
    if (!policy && v.vehicleId) {
      const veh = vehicles.find((x) => x.id === v.vehicleId);
      if (veh) {
        if (activeTab === "insurance") {
          if (veh.insurance_policy_no) setValue("policyNo", veh.insurance_policy_no);
          if (veh.insuranceExpiry) setValue("expiryDate", veh.insuranceExpiry.slice(0, 10));
        } else {
          if (veh.roadTaxExpiry) setValue("expiryDate", veh.roadTaxExpiry.slice(0, 10));
        }
      }
    }
  }, [v.vehicleId, activeTab, vehicles, initialGroup, setValue]);

  const submit = async (values: InsuranceFormValues) => {
    const veh = vehicles.find((x) => x.id.toString() === values.vehicleId.toString());
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "" });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insurance">Insurance Policy</TabsTrigger>
          <TabsTrigger value="road_tax">Road Tax</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <SelectDropdown 
                label="Vehicle" 
                disabled={!!initialGroup}
                value={v.vehicleId?.toString()} 
                onChange={(x) => setValue("vehicleId", x)} 
                options={vehicles.map((x) => ({ value: x.id.toString(), label: x.regNo }))} 
                error={errors.vehicleId?.message} 
              />
            </div>
            
            <FormInput label={activeTab === "insurance" ? "Policy Number" : "Receipt Number"} {...register("policyNo")} error={errors.policyNo?.message} />
            {activeTab === "insurance" && (
              <FormInput label="Provider" {...register("provider")} error={errors.provider?.message} />
            )}
            <FormInput label="Start Date" type="date" {...register("startDate")} />
            <FormInput label="Expiry Date" type="date" {...register("expiryDate")} />
            <FormInput label="Amount / Premium (MYR)" type="number" {...register("premium")} />
          </div>
          
          <FileUpload 
            label={activeTab === "insurance" ? "Policy Document" : "Receipt / Sticker Scan"} 
            value={v.document_path} 
            folder="insurance" 
            subfolder={v.vehicleId?.toString()}
            onChange={(url) => setValue("document_path", url)} 
          />
          
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              { (activeTab === "insurance" ? initialGroup?.insurance : initialGroup?.roadTax) ? "Update record" : "Add record" }
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
