"use client";

import { useQuery } from "@tanstack/react-query";

export type DashboardData = {
  summary: {
    totalContacts: number;
    totalLeads: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
  };

  leadStatus: {
    new: number;
    contacted: number;
    qualified: number;
    lost: number;
  };

  recentLeads: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    createdAt: string;
  }[];

  upcomingTasks: {
    id: string;
    title: string;
    dueDate: string | null;
    priority: string;
    status: string;
  }[];
};

const fetchDashboard =
  async (): Promise<DashboardData> => {
    const response = await fetch(
      "/api/dashboard"
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch dashboard"
      );
    }

    return result;
  };

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
}