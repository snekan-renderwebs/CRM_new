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
  useCreateTask,
  useUpdateTask,
  type Task,
} from "../../hooks/use-tasks";

import {
  useUsers,
} from "../../hooks/use-users";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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


import { taskSchema } from "@/src/schemas/task";

type FormValues =
  z.infer<typeof taskSchema>;



type TaskFormProps = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  task?: Task | null;

  onSuccess: () => void;
};



export default function TaskForm({
  open,
  onOpenChange,
  task,
  onSuccess,
}: TaskFormProps) {

 
  const createTask =
    useCreateTask();

  const updateTask =
    useUpdateTask();


  
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers(
    "",
    1,
    100
  );

  const users =
    usersData?.users ?? [];


 
  const isEdit =
    Boolean(task);


  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: {
      errors,
      isSubmitting,
    },

  } = useForm<FormValues>({
    resolver:
      zodResolver(taskSchema),

    defaultValues: {
      title: "",

      description: "",

      dueDate: "",

      priority: "MEDIUM",

      status: "PENDING",

      userId: "",
    },
  });



  useEffect(() => {

    if (task) {

      // EDIT

      reset({
        title:
          task.title,

        description:
          task.description || "",

        dueDate:
          task.dueDate
            ? task.dueDate.slice(0, 10)
            : "",

        priority:
          task.priority,

        status:
          task.status,

        userId:
          task.userId,
      });

    } else {

      // CREATE

      reset({
        title: "",

        description: "",

        dueDate: "",

        priority: "MEDIUM",

        status: "PENDING",

        userId: "",
      });
    }

  }, [
    task,
    reset,
    open,
  ]);



  const onSubmit = async (
    data: FormValues
  ) => {

    try {

      
      if (task) {

        await updateTask.mutateAsync({

          id:
            task.id,

          data: {

            title:
              data.title,

            description:
              data.description,

            dueDate:
              data.dueDate,

            priority:
              data.priority,

            status:
              data.status,

            userId:
              data.userId,
          },
        });

      }

      
      else {

        await createTask.mutateAsync({

          title:
            data.title,

          description:
            data.description,

          dueDate:
            data.dueDate,

          priority:
            data.priority,

          status:
            data.status,

          userId:
            data.userId,
        });
      }


     
      reset();


      
      onOpenChange(false);


     
      onSuccess();

    }

    catch (error) {

      console.error(
        "Task submit error:",
        error
      );

    }
  };


  
  const isPending =
    isSubmitting ||
    createTask.isPending ||
    updateTask.isPending;


  
  return (

    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent
        className="sm:max-w-lg"
      >

       
        <DialogHeader>

          <DialogTitle
            className="text-xl text-[#2F3529]"
          >
            {isEdit
              ? "Edit Task"
              : "Add Task"}
          </DialogTitle>

        </DialogHeader>


        
        <form
          onSubmit={
            handleSubmit(
              onSubmit
            )
          }

          className="space-y-4"
        >

          
          <div
            className="space-y-2"
          >

            <Label
              htmlFor="title"
            >
              Title
            </Label>

            <Input
              id="title"

              placeholder="Enter task title"

              {...register(
                "title"
              )}

              className="focus-visible:ring-[#A3B18A]"
            />

            {errors.title && (

              <p
                className="text-xs text-red-500"
              >
                {
                  errors.title.message
                }
              </p>

            )}

          </div>


         
          <div
            className="space-y-2"
          >

            <Label
              htmlFor="description"
            >
              Description
            </Label>

            <textarea
              id="description"

              placeholder="Enter task description"

              {...register(
                "description"
              )}

              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#A3B18A]"
            />

            {errors.description && (

              <p
                className="text-xs text-red-500"
              >
                {
                  errors.description.message
                }
              </p>

            )}

          </div>


          
          <div
            className="space-y-2"
          >

            <Label
              htmlFor="dueDate"
            >
              Due Date
            </Label>

            <Input
              id="dueDate"

              type="date"

              {...register(
                "dueDate"
              )}

              className="focus-visible:ring-[#A3B18A]"
            />

            {errors.dueDate && (

              <p
                className="text-xs text-red-500"
              >
                {
                  errors.dueDate.message
                }
              </p>

            )}

          </div>


          
         
<div className="space-y-2">
  <Label htmlFor="userId">
    Assign To
  </Label>

 <Controller
  name="userId"
  control={control}
  render={({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
      disabled={usersLoading || isPending}
    >
      <SelectTrigger
        id="userId"
        className="w-full"
      >
        <span>
          {usersLoading
            ? "Loading users..."
            : users.find(
                (user) => user.id === field.value
              )?.name || "Select user"}
        </span>
      </SelectTrigger>

      <SelectContent>
        {users.map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
          >
            {user.name} ({user.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
  {usersError && (
    <p className="text-xs text-red-500">
      Failed to load users.
    </p>
  )}

  {errors.userId && (
    <p className="text-xs text-red-500">
      {errors.userId.message}
    </p>
  )}
</div>




          
          <div
            className="grid grid-cols-2 gap-4"
          >

            
            <div
              className="space-y-2"
            >

              <Label
                htmlFor="priority"
              >
                Priority
              </Label>

              <select
                id="priority"

                {...register(
                  "priority"
                )}

                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#A3B18A]"
              >

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

              </select>

              {errors.priority && (

                <p
                  className="text-xs text-red-500"
                >
                  {
                    errors.priority.message
                  }
                </p>

              )}

            </div>


            
            
<div className="space-y-2">
  <Label htmlFor="status">
    Status
  </Label>

  <Controller
    name="status"
    control={control}
    render={({ field }) => (
      <Select
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger
          id="status"
          className="w-full"
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="PENDING">
            Pending
          </SelectItem>

          <SelectItem value="IN_PROGRESS">
            In Progress
          </SelectItem>

          <SelectItem value="COMPLETED">
            Completed
          </SelectItem>
        </SelectContent>
      </Select>
    )}
  />

  {errors.status && (
    <p className="text-xs text-red-500">
      {errors.status.message}
    </p>
  )}
</div>



          </div>


          
          {(
            createTask.isError ||
            updateTask.isError
          ) && (

            <p
              className="rounded-md bg-red-50 p-3 text-sm text-red-600"
            >
              {
                createTask.error?.message ||
                updateTask.error?.message ||
                "Something went wrong"
              }
            </p>

          )}


          
          <div
            className="flex justify-end gap-2 pt-2"
          >

            <Button
              type="button"

              variant="outline"

              onClick={() =>
                onOpenChange(false)
              }

              disabled={
                isPending
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"

              disabled={
                isPending ||
                usersLoading
              }

              className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
            >

              {isPending
                ? "Saving..."
                : isEdit
                ? "Update Task"
                : "Create Task"}

            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );
}