"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ContactFormData } from "../schemas/contact";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  jobTitle: string | null;
  createdAt: string;
  updatedAt: string;
};

type ContactsResponse = {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ContactInput = ContactFormData;

async function fetchContacts(
  search: string,
  page: number,
  limit: number
): Promise<ContactsResponse> {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  const response = await fetch(
    `/api/contacts?${params.toString()}`
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to fetch contacts");
  }

  return response.json();
}

async function createContact(data: ContactInput) {
  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create contact");
  }

  return result;
}

async function updateContact(
  id: string,
  data: ContactInput
) {
  const response = await fetch(`/api/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update contact");
  }

  return result;
}

async function deleteContact(id: string) {
  const response = await fetch(`/api/contacts/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete contact");
  }

  return result;
}

export function useContacts(
  search: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: ["contacts", search, page, limit],
    queryFn: () =>
      fetchContacts(search, page, limit),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ContactInput;
    }) => updateContact(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
}