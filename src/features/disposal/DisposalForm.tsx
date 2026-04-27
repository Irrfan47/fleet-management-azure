import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, SelectDropdown } from "@/components/common";
import { DISPOSAL_STATUS } from "@/utils/constants";
import type { Disposal, Vehicle } from "@/types";

const schema = z.object({
  vehicleId: z.string().min(1),
  reason: z.string().trim().min(2).max(500),
  method: z.enum(["sale", "write_off", "auction"]),
  evaluationValue: z.coerce.number().min(0),
  finalValue: z.coerce.number().min(0).optional(),
  status: z.enum(["pending_evaluation", "pending_approval", "approved", "executed", "rejected"]),
  approvedBy: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});
export type DisposalFormValues = z.infer<typeof schema>;

interface Props {
  initial?: Disposal | null;
  vehicles: Vehicle[];
  onSubmit: (v: DisposalFormValues & { vehicleRegNo: string }) => Promise<void> | void;
  onCancel: () => void;
}

export function DisposalForm({ initial, vehicles, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<DisposalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleId: "", reason: "", method: "sale", evaluationValue: 0, status: "pending_evaluation", approvedBy: "", notes: "" },
  });
  useEffect(() => { if (initial) reset(initial); }, [initial, reset]);
  const v = watch();
  const submit = async (values: DisposalFormValues) => {
    const veh = vehicles.find((x) => x.id === values.vehicleId);
    await onSubmit({ ...values, vehicleRegNo: veh?.regNo || "" });
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectDropdown label="Vehicle" value={v.vehicleId} onChange={(x) => setValue("vehicleId", x)} options={vehicles.map((x) => ({ value: x.id, label: x.regNo }))} error={errors.vehicleId?.message} />
        <SelectDropdown label="Method" value={v.method} onChange={(x) => setValue("method", x as DisposalFormValues["method"])} options={[{ value: "sale", label: "Sale" }, { value: "write_off", label: "Write-off" }, { value: "auction", label: "Auction" }]} />
        <FormInput label="Evaluation value (MYR)" type="number" {...register("evaluationValue")} />
        <FormInput label="Final value (MYR)" type="number" {...register("finalValue")} />
        <SelectDropdown label="Status" value={v.status} onChange={(x) => setValue("status", x as DisposalFormValues["status"])} options={Object.entries(DISPOSAL_STATUS).map(([k, m]) => ({ value: k, label: m.label }))} />
        <FormInput label="Approved by" {...register("approvedBy")} />
      </div>
      <FormInput label="Reason" {...register("reason")} error={errors.reason?.message} />
      <FormInput label="Notes" {...register("notes")} />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{initial ? "Save changes" : "Create disposal"}</Button>
      </div>
    </form>
  );
}
