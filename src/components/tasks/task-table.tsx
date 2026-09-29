"use client";

import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import type { Task } from "../../hooks/use-tasks";

type TaskTableProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};


const features = tableFeatures({});


const columnHelper =
  createColumnHelper<typeof features, Task>();


const priorityStyles: Record<
  Task["priority"],
  string
> = {
  LOW: "bg-[#F2E8CF] text-[#59664A]",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};


const priorityLabels: Record<
  Task["priority"],
  string
> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};


const statusStyles: Record<
  Task["status"],
  string
> = {
  PENDING:
    "bg-[#F2E8CF] text-[#59664A]",

  IN_PROGRESS:
    "bg-blue-100 text-blue-700",

  COMPLETED:
    "bg-green-100 text-green-700",
};


const statusLabels: Record<
  Task["status"],
  string
> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: TaskTableProps) {

  
  const columns = [

    
    columnHelper.accessor("title", {
      header: "Title",

      cell: (info) => {
        return (
          <span className="font-medium text-[#2F3529]">
            {info.getValue()}
          </span>
        );
      },
    }),

   
    columnHelper.accessor("description", {
      header: "Description",

      cell: (info) => {
        const description =
          info.getValue();

        return (
          <span className="block max-w-xs truncate text-[#687060]">
            {description || "-"}
          </span>
        );
      },
    }),

    
    columnHelper.display({
      id: "assignedTo",

      header: "Assigned To",

      cell: (info) => {
        const task =
          info.row.original;

        return (
          <span className="font-medium text-[#2F3529]">
            {task.user?.name || "-"}
          </span>
        );
      },
    }),

   
    columnHelper.accessor("dueDate", {
      header: "Due Date",

      cell: (info) => {
        const dueDate =
          info.getValue();

        if (!dueDate) {
          return "-";
        }

        return new Date(
          dueDate
        ).toLocaleDateString("en-IN");
      },
    }),

    
    columnHelper.accessor("priority", {
      header: "Priority",

      cell: (info) => {
        const priority =
          info.getValue();

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[priority]}`}
          >
            {priorityLabels[priority]}
          </span>
        );
      },
    }),

    
    columnHelper.accessor("status", {
      header: "Status",

      cell: (info) => {
        const status =
          info.getValue();

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    }),

    
    columnHelper.display({
      id: "actions",

      header: "Actions",

      cell: (info) => {

        const task =
          info.row.original;

        return (
          <div className="flex items-center gap-2">

            

            <button
              type="button"
              onClick={() =>
                onEdit(task)
              }
              className="rounded-md p-2 text-[#687060] transition hover:bg-[#F2E8CF] hover:text-[#2F3529]"
              title="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </button>

           

            <button
              type="button"
              onClick={() =>
                onDelete(task)
              }
              className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>
        );
      },
    }),
  ];

  
  const table = useTable({
    features,
    columns,
    data: tasks,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          

          <thead className="bg-[#F2E8CF]/60">

            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                >

                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-[#2F3529]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column
                                .columnDef
                                .header,
                              header.getContext()
                            )}
                      </th>
                    )
                  )}

                </tr>
              ))}

          </thead>

          

          <tbody>

            {table
              .getRowModel()
              .rows
              .map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-[#d9d2bd] transition hover:bg-[#F2E8CF]/30"
                >

                  {row
                    .getAllCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-[#2F3529]"
                      >
                        {flexRender(
                          cell.column
                            .columnDef
                            .cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}

                </tr>
              ))}

          </tbody>

        </table>

      </div>

      {tasks.length === 0 && (
        <div className="p-10 text-center">

          <p className="font-medium text-[#2F3529]">
            No tasks found
          </p>

          <p className="mt-1 text-sm text-[#687060]">
            Try another search or create
            a new task.
          </p>

        </div>
      )}

    </div>
  );
}