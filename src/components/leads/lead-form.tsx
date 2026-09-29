"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { z } from "zod";

import {
  useCreateLead,
  useUpdateLead,
  type Lead,
} from "../../hooks/use-leads";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Button,
} from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "LOST",
  ]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type LeadFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSuccess: () => void;
};

export default function LeadForm({
  open,
  onOpenChange,
  lead,
  onSuccess,
}: LeadFormProps) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const isEdit = Boolean(lead);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "",
      status: "NEW",
      notes: "",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company || "",
        source: lead.source || "",
        status: lead.status,
        notes: lead.notes || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "",
        status: "NEW",
        notes: "",
      });
    }
  }, [lead, reset, open]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (lead) {
        await updateLead.mutateAsync({
          id: lead.id,
          data,
        
        });
      } else {
        await createLead.mutateAsync(data);
         onSuccess();
      }

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#2F3529]">
            {isEdit ? "Edit Lead" : "Add Lead"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input {...register("company")} />
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Input {...register("source")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>

            <select
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">
                Contacted
              </option>
              <option value="QUALIFIED">
                Qualified
              </option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>

            <textarea
              {...register("notes")}
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#A3B18A]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                createLead.isPending ||
                updateLead.isPending
              }
              className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
            >
              {isEdit ? "Update Lead" : "Create Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}