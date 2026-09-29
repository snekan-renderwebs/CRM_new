"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
   user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "SALES_MANAGER" | "SALES_USER";
  };
  createdAt: string;
  updatedAt: string;
};

type TasksResponse = {
  tasks: Task[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type TaskResponse = {
  task: Task;
};



const fetchTasks = async (
  search: string,
  page: number,
  limit: number
): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `/api/tasks?${params}`
  );

  if (!response.ok) {
    const result = await response.json();

    throw new Error(
      result.message ||
        "Failed to fetch tasks"
    );
  }

  return response.json();
};



export function useTasks(
  search: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: [
      "tasks",
      search,
      page,
      limit,
    ],

    queryFn: () =>
      fetchTasks(
        search,
        page,
        limit
      ),

    placeholderData: (
      previousData
    ) => previousData,
  });
}



export function useCreateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      dueDate?: string;
      priority: TaskPriority;
      status: TaskStatus;
      userId: string;
    }): Promise<TaskResponse> => {
      const response =
        await fetch("/api/tasks", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create task"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}



export function useUpdateTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;

      data: {
        title: string;
        description?: string;
        dueDate?: string;
        priority: TaskPriority;
        status: TaskStatus;
        userId: string;
      };
    }): Promise<TaskResponse> => {
      const response =
        await fetch(
          `/api/tasks/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(data),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update task"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}



export function useDeleteTask() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string
    ) => {
      const response =
        await fetch(
          `/api/tasks/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete task"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}