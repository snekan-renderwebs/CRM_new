"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type UserRole =
  | "ADMIN"
  | "SALES_MANAGER"
  | "SALES_USER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type UserResponse = {
  user: User;
  message?: string;
};


const fetchUsers = async (
  search: string,
  page: number,
  limit: number
): Promise<UsersResponse> => {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `/api/users?${params.toString()}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch users"
    );
  }

  return result;
};


export function useUsers(
  search: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: [
      "users",
      search,
      page,
      limit,
    ],

    queryFn: () =>
      fetchUsers(
        search,
        page,
        limit
      ),

    placeholderData: (
      previousData
    ) => previousData,
  });
}

export function useCreateUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
    }) => {
      const response =
        await fetch("/api/users", {
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
            "Failed to create user"
        );
      }

      return result as UserResponse;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}


export function useUser(
  id: string
) {
  return useQuery({
    queryKey: ["user", id],

    queryFn: async () => {
      const response =
        await fetch(
          `/api/users/${id}`
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch user"
        );
      }

      return result as UserResponse;
    },

    enabled: Boolean(id),
  });
}


export function useUpdateUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        email: string;
        role: UserRole;
      };
    }) => {
      const response =
        await fetch(
          `/api/users/${id}`,
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
            "Failed to update user"
        );
      }

      return result as UserResponse;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "user",
          variables.id,
        ],
      });
    },
  });
}


export function useDeleteUser() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string
    ) => {
      const response =
        await fetch(
          `/api/users/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete user"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}