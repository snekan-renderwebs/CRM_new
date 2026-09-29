"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "LOST";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type LeadsResponse = {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type LeadResponse = {
  lead: Lead;
};

const fetchLeads = async (
  search: string,
  page: number,
  limit: number
): Promise<LeadsResponse> => {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`/api/leads?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
};

export function useLeads(
  search: string,
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: ["leads", search, page, limit],
    queryFn: () => fetchLeads(search, page, limit),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      company?: string;
      source?: string;
      status: LeadStatus;
      notes?: string;
    }) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create lead"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        email: string;
        phone: string;
        company?: string;
        source?: string;
        status: LeadStatus;
        notes?: string;
      };
    }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update lead"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete lead"
        );
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}