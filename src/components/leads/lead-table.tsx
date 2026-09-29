"use client";

import {
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import type { Lead } from "../../hooks/use-leads";

type LeadTableProps = {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

// v9: define features outside the component
const features = tableFeatures({});

const statusStyles = {
  NEW: "bg-[#F2E8CF] text-[#59664A]",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
} as const;

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  LOST: "Lost",
} as const;

export default function LeadTable({
  leads,
  onEdit,
  onDelete,
}: LeadTableProps) {
  const columns: ColumnDef<
    typeof features,
    Lead
  >[] = [
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "company",
      header: "Company",

      cell: ({ row }) => {
        return row.original.company || "-";
      },
    },

    {
      accessorKey: "source",
      header: "Source",

      cell: ({ row }) => {
        return row.original.source || "-";
      },
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              statusStyles[status]
            }`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const lead = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(lead)}
              className="rounded-md p-2 text-[#687060] transition hover:bg-[#F2E8CF] hover:text-[#2F3529]"
              aria-label="Edit lead"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(lead)}
              className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
              aria-label="Delete lead"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useTable({
    features,
    data: leads,
    columns,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[#d9d2bd] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F2E8CF]/60">
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <tr key={headerGroup.id}>
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
                                .columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  )}
                </tr>
              )
            )}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(
              (row) => (
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
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="p-10 text-center">
          <p className="font-medium text-[#2F3529]">
            No leads found
          </p>

          <p className="mt-1 text-sm text-[#687060]">
            Try another search or create a new lead.
          </p>
        </div>
      )}
    </div>
  );
}