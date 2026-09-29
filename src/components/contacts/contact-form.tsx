"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  contactSchema,
  type ContactFormData,
} from "../../schemas/contact";

import type { Contact } from "../../hooks/use-contacts";

import {
  useCreateContact,
  useUpdateContact,
} from "../../hooks/use-contacts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ContactFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
};

export default function ContactForm({
  open,
  onOpenChange,
  contact,
}: ContactFormProps) {
  const isEdit = !!contact;

  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company ?? "",
        jobTitle: contact.jobTitle ?? "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
      });
    }
  }, [contact, form, open]);

  const onSubmit = (data: ContactFormData) => {
    if (contact) {
      updateMutation.mutate(
        {
          id: contact.id,
          data,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );

      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Contact" : "Add Contact"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the contact information."
              : "Enter the contact information below."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}

          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>

            <Input
              id="name"
              placeholder="John Doe"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone
            </Label>

            <Input
              id="phone"
              placeholder="9876543210"
              {...form.register("phone")}
            />

            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Company */}

          <div className="space-y-2">
            <Label htmlFor="company">
              Company
            </Label>

            <Input
              id="company"
              placeholder="ABC Technologies"
              {...form.register("company")}
            />

            {form.formState.errors.company && (
              <p className="text-sm text-red-500">
                {form.formState.errors.company.message}
              </p>
            )}
          </div>

          {/* Job Title */}

          <div className="space-y-2">
            <Label htmlFor="jobTitle">
              Job Title
            </Label>

            <Input
              id="jobTitle"
              placeholder="Software Engineer"
              {...form.register("jobTitle")}
            />

            {form.formState.errors.jobTitle && (
              <p className="text-sm text-red-500">
                {form.formState.errors.jobTitle.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : isEdit
                ? "Update Contact"
                : "Create Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}