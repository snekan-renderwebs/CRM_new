"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useCreateUser,
  useUpdateUser,
  type User,
} from "../../hooks/use-users";

import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "../../schemas/user";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Button,
} from "@/components/ui/button";

type UserFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess: () => void;
};

type FormValues =
  CreateUserInput & {
    password?: string;
  };

export default function UserForm({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormProps) {
  const createUser =
    useCreateUser();

  const updateUser =
    useUpdateUser();

  const isEdit =
    Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(
      createUserSchema
    ),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "SALES_USER",
    },
  });

  
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "SALES_USER",
      });
    }
  }, [
    user,
    open,
    reset,
  ]);

  
  const onSubmit = async (
    data: FormValues
  ) => {
    try {
      if (user) {
        const updateData: UpdateUserInput =
          updateUserSchema.parse({
            name: data.name,
            email: data.email,
            role: data.role,
          });

        await updateUser.mutateAsync({
          id: user.id,
          data: updateData,
        });
      } else {
        const createData: CreateUserInput =
          createUserSchema.parse({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
          });

        await createUser.mutateAsync(
          createData
        );
      }

      reset();

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const isPending =
    isSubmitting ||
    createUser.isPending ||
    updateUser.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle className="text-xl text-[#2F3529]">
            {isEdit
              ? "Edit User"
              : "Add User"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >

          {/* NAME */}

          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>

            <Input
              id="name"
              placeholder="Enter user name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

         

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

         

          <div className="space-y-2">
            <Label htmlFor="role">
              Role
            </Label>

            <select
              id="role"
              {...register("role")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#A3B18A]"
            >
              <option value="ADMIN">
                Admin
              </option>

              <option value="SALES_MANAGER">
                Sales Manager
              </option>

              <option value="SALES_USER">
                Sales User
              </option>
            </select>

            {errors.role && (
              <p className="text-xs text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>

          

          <div className="flex justify-end gap-2 pt-2">

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
            >
              {isPending
                ? "Saving..."
                : isEdit
                ? "Update User"
                : "Create User"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}