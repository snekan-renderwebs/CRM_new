"use client";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import type { Contact } from "../../hooks/use-contacts";

type ContactTableProps = {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

const features = tableFeatures({});

export default function ContactTable({
  contacts,
  onEdit,
  onDelete,
}: ContactTableProps) {
  const columns: ColumnDef<
    typeof features,
    Contact
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
    },

    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(contact)}
              className="rounded-md p-2 hover:bg-muted"
              title="Edit contact"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(contact)}
              className="rounded-md p-2 text-red-500 hover:bg-muted"
              title="Delete contact"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useTable({
    key: "contacts-table",
    features,
    data: contacts,
    columns,
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          {table.getHeaderGroups().map(
            (headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(
                  (header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : (
                          <table.FlexRender
                            header={header}
                          />
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
                className="border-b last:border-0"
              >
                {row.getAllCells().map(
                  (cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm"
                    >
                      <table.FlexRender
                        cell={cell}
                      />
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>

      {contacts.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No contacts found.
        </div>
      )}
    </div>
  );
}