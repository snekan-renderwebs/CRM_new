"use client";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import type { User } from "../../hooks/use-users";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

const features = tableFeatures({});

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: UserTableProps) {
  // IMPORTANT:
  // columns must be inside component
  // because onEdit / onDelete are props

  const columns: ColumnDef<
    typeof features,
    User
  >[] = [
    {
      id: "sno",

      header: "#",

      cell: ({ row }) => (
        <span className="text-[#687060]">
          {row.index + 1}
        </span>
      ),
    },

    {
      accessorKey: "name",

      header: "Name",

      cell: ({ row }) => (
        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#A3B18A] text-sm font-semibold text-white">
            {row.original.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <p className="font-medium text-[#2F3529]">
              {row.original.name}
            </p>

            <p className="text-xs text-[#687060]">
              CRM User
            </p>
          </div>

        </div>
      ),
    },

    {
      accessorKey: "email",

      header: "Email",

      cell: ({ row }) => (
        <span className="text-[#687060]">
          {row.original.email}
        </span>
      ),
    },

    {
      accessorKey: "role",

      header: "Role",

      cell: ({ row }) => {
        const role =
          row.original.role;

        const roleStyle =
          role === "ADMIN"
            ? "bg-[#A3B18A] text-white"
            : role === "SALES_MANAGER"
            ? "bg-[#F2E8CF] text-[#59664A]"
            : "bg-gray-100 text-gray-700";

        const roleLabel =
          role === "ADMIN"
            ? "Admin"
            : role === "SALES_MANAGER"
            ? "Sales Manager"
            : "Sales User";

        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleStyle}`}
          >
            {roleLabel}
          </span>
        );
      },
    },

    {
      accessorKey: "createdAt",

      header: "Created",

      cell: ({ row }) => (
        <span className="text-sm text-[#687060]">
          {new Date(
            row.original.createdAt
          ).toLocaleDateString()}
        </span>
      ),
    },

    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => {
        const user =
          row.original;

        return (
          <div className="flex items-center gap-1">

            {/* EDIT */}

            <button
              type="button"
              onClick={() =>
                onEdit(user)
              }
              className="rounded-md p-2 text-[#687060] transition hover:bg-[#F2E8CF] hover:text-[#2F3529]"
              aria-label="Edit user"
            >
              <Pencil className="h-4 w-4" />
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={() =>
                onDelete(user)
              }
              className="rounded-md p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete user"
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
    columns,
    data: users,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-[#d9d2bd] px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2E8CF]">
            <Users className="h-5 w-5 text-[#59664A]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#2F3529]">
              All Users
            </h2>

            <p className="text-xs text-[#687060]">
              Manage CRM users and roles
            </p>
          </div>

        </div>

        <span className="rounded-full bg-[#F2E8CF] px-3 py-1 text-xs font-medium text-[#59664A]">
          {users.length} users
        </span>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[750px]">

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
                        className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#59664A]"
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                            <table.FlexRender
                              header={
                                header
                              }
                            />
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
                  className="border-t border-[#eee9da] transition-colors hover:bg-[#F2E8CF]/25"
                >

                  {row
                    .getAllCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-5 py-4 text-sm"
                      >
                        <table.FlexRender
                          cell={cell}
                        />
                      </td>
                    ))}

                </tr>
              ))}

          </tbody>

        </table>

      </div>

      {/* EMPTY */}

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2E8CF]">
            <Users className="h-6 w-6 text-[#59664A]" />
          </div>

          <p className="font-medium text-[#2F3529]">
            No users found
          </p>

          <p className="mt-1 max-w-sm text-sm text-[#687060]">
            Try another search or
            create a new user.
          </p>

        </div>
      )}

    </div>
  );
}