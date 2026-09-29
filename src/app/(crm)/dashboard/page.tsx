"use client";

import {
  Users,
  UserPlus,
  ListTodo,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

import {
  useDashboard,
} from "../../../hooks/use-dashboard";

import {
  useAuthStore,
} from "../../../store/authstore";


const statusStyles: Record<
  string,
  string
> = {
  NEW:
    "bg-[#F2E8CF] text-[#59664A]",

  CONTACTED:
    "bg-blue-100 text-blue-700",

  QUALIFIED:
    "bg-green-100 text-green-700",

  LOST:
    "bg-red-100 text-red-700",
};


const priorityStyles: Record<
  string,
  string
> = {
  LOW:
    "bg-gray-100 text-gray-700",

  MEDIUM:
    "bg-[#F2E8CF] text-[#59664A]",

  HIGH:
    "bg-red-100 text-red-700",
};


export default function DashboardPage() {

  const {
    user,
  } = useAuthStore();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useDashboard();


  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">

          <div className="h-8 w-64 rounded bg-gray-200" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-xl bg-gray-200"
              />
            ))}

          </div>

        </div>
      </div>
    );
  }



  if (isError) {
    return (
      <div className="p-6">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error.message ||
            "Failed to load dashboard"}
        </div>

      </div>
    );
  }


  if (!data) {
    return null;
  }



  const cards = [
    {
      title: "Total Contacts",
      value:
        data.summary.totalContacts,
      icon: Users,
    },

    {
      title: "Total Leads",
      value:
        data.summary.totalLeads,
      icon: UserPlus,
    },

    {
      title: "Total Tasks",
      value:
        data.summary.totalTasks,
      icon: ListTodo,
    },

    {
      title: "Completed Tasks",
      value:
        data.summary.completedTasks,
      icon: CheckCircle2,
    },
  ];


  return (
    <div className="space-y-6 p-6">

      
      <div>

        <h1 className="text-2xl font-semibold text-[#2F3529]">
          Welcome back
          {user?.name
            ? `, ${user.name}`
            : ""}
          !
        </h1>

        <p className="mt-1 text-sm text-[#687060]">
          Here's what's happening in
          your CRM today.
        </p>

      </div>


     
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-[#d9d2bd] bg-white p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-[#687060]">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-[#2F3529]">
                    {card.value}
                  </p>

                </div>

                <div className="rounded-lg bg-[#F2E8CF] p-3">
                  <Icon className="h-5 w-5 text-[#59664A]" />
                </div>

              </div>

            </div>
          );
        })}

      </div>


     
      <div className="grid gap-6 lg:grid-cols-2">


       
        <div className="rounded-xl border border-[#d9d2bd] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center gap-2">

            <TrendingUp className="h-5 w-5 text-[#687060]" />

            <h2 className="font-semibold text-[#2F3529]">
              Lead Overview
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-4">

            <LeadStatus
              label="New"
              value={data.leadStatus.new}
              className={
                statusStyles.NEW
              }
            />

            <LeadStatus
              label="Contacted"
              value={
                data.leadStatus.contacted
              }
              className={
                statusStyles.CONTACTED
              }
            />

            <LeadStatus
              label="Qualified"
              value={
                data.leadStatus.qualified
              }
              className={
                statusStyles.QUALIFIED
              }
            />

            <LeadStatus
              label="Lost"
              value={
                data.leadStatus.lost
              }
              className={
                statusStyles.LOST
              }
            />

          </div>

        </div>


        
        <div className="rounded-xl border border-[#d9d2bd] bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center gap-2">

            <Clock3 className="h-5 w-5 text-[#687060]" />

            <h2 className="font-semibold text-[#2F3529]">
              Task Overview
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-lg bg-[#F2E8CF]/60 p-4">

              <p className="text-sm text-[#687060]">
                Pending
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#2F3529]">
                {
                  data.summary
                    .pendingTasks
                }
              </p>

            </div>


            <div className="rounded-lg bg-[#A3B18A]/20 p-4">

              <p className="text-sm text-[#687060]">
                Completed
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#2F3529]">
                {
                  data.summary
                    .completedTasks
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      
      <div className="rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

        <div className="border-b border-[#d9d2bd] p-5">

          <h2 className="font-semibold text-[#2F3529]">
            Recent Leads
          </h2>

          <p className="mt-1 text-sm text-[#687060]">
            Your latest leads
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#F2E8CF]/60">

              <tr>

                <th className="px-5 py-3 text-left text-sm font-semibold text-[#2F3529]">
                  Name
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-[#2F3529]">
                  Company
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-[#2F3529]">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {data.recentLeads.map(
                (lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-[#d9d2bd]"
                  >

                    <td className="px-5 py-3">

                      <p className="text-sm font-medium text-[#2F3529]">
                        {lead.name}
                      </p>

                      <p className="text-xs text-[#687060]">
                        {lead.email}
                      </p>

                    </td>

                    <td className="px-5 py-3 text-sm text-[#687060]">
                      {lead.company || "-"}
                    </td>

                    <td className="px-5 py-3">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[
                            lead.status
                          ] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>


        {data.recentLeads.length ===
          0 && (
          <div className="p-8 text-center text-sm text-[#687060]">
            No recent leads found.
          </div>
        )}

      </div>


      
      <div className="rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

        <div className="border-b border-[#d9d2bd] p-5">

          <h2 className="font-semibold text-[#2F3529]">
            Upcoming Tasks
          </h2>

          <p className="mt-1 text-sm text-[#687060]">
            Tasks that need your attention
          </p>

        </div>


        <div className="divide-y divide-[#d9d2bd]">

          {data.upcomingTasks.map(
            (task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 p-5"
              >

                <div className="min-w-0">

                  <p className="truncate text-sm font-medium text-[#2F3529]">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-[#687060]">
                    {task.dueDate
                      ? new Date(
                          task.dueDate
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>

                </div>


                <div className="flex shrink-0 items-center gap-2">

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      priorityStyles[
                        task.priority
                      ] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {task.status}
                  </span>

                </div>

              </div>
            )
          )}

        </div>


        {data.upcomingTasks.length ===
          0 && (
          <div className="p-8 text-center text-sm text-[#687060]">
            No upcoming tasks.
          </div>
        )}

      </div>

    </div>
  );
}



function LeadStatus({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#d9d2bd] p-4">

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      >
        {label}
      </span>

      <span className="text-xl font-semibold text-[#2F3529]">
        {value}
      </span>

    </div>
  );
}