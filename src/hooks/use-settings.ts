"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import type {
  ProfileFormValues,
  PasswordFormValues,
} from "../schemas/settings";

import type { AuthUser } from "../store/authstore";

type ProfileResponse = {
  message: string;
  user: AuthUser;
};

type PasswordResponse = {
  message: string;
};

export function useUpdateProfile() {
  return useMutation<
    ProfileResponse,
    Error,
    ProfileFormValues
  >({
    mutationFn: async (
      data: ProfileFormValues
    ) => {
      const response = await fetch(
        "/api/settings/profile",
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
            "Failed to update profile"
        );
      }

      return result;
    },
  });
}

export function useUpdatePassword() {
  return useMutation<
    PasswordResponse,
    Error,
    PasswordFormValues
  >({
    mutationFn: async (
      data: PasswordFormValues
    ) => {
      const response = await fetch(
        "/api/settings/password",
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
            "Failed to update password"
        );
      }

      return result;
    },
  });
}