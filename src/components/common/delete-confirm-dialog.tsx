"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  itemName?: string;

  onConfirm: () => void;

  isDeleting?: boolean;
};

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Delete Item",
  description = "This action cannot be undone.",
  itemName,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle className="text-[#2F3529]">
            {title}
          </DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>

        </DialogHeader>

        {itemName && (
          <div className="rounded-lg bg-[#F2E8CF]/60 px-4 py-3">
            <p className="text-sm font-medium text-[#2F3529]">
              {itemName}
            </p>
          </div>
        )}

        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}