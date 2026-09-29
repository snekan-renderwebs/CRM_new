"use client";

import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useContacts,
  type Contact,
} from "../../../hooks/use-contacts";

import ContactTable from "../../../components/contacts/contact-table";
import ContactForm from "../../../components/contacts/contact-form";

import DeleteConfirmDialog from "../../../components/common/delete-confirm-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LIMIT = 10;

export default function ContactsPage() {

  const [search, setSearch] = useState("");


  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);

  const [selectedContact, setSelectedContact] =
    useState<Contact | null>(null);


  const [deleteOpen, setDeleteOpen] = useState(false);

  const [contactToDelete, setContactToDelete] =
    useState<Contact | null>(null);


  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useContacts(
    search,
    page,
    LIMIT
  );


  useEffect(() => {
    setPage(1);
  }, [search]);


  const contacts =
    data?.contacts ?? [];

  const pagination =
    data?.pagination;


  const handleAdd = () => {
    setSelectedContact(null);
    setFormOpen(true);
  };


  const handleEdit = (
    contact: Contact
  ) => {
    setSelectedContact(contact);
    setFormOpen(true);
  };


  const handleDelete = (
    contact: Contact
  ) => {
    setContactToDelete(contact);
    setDeleteOpen(true);
  };


  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    setContactToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2F3529]">
            Contacts
          </h1>

          <p className="mt-1 text-sm text-[#687060]">
            Manage your CRM contacts.
          </p>
        </div>

        

        <Button
          type="button"
          onClick={handleAdd}
          className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>

      </div>

  
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-sm">

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#687060]"
          />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search contacts..."
            className="border-[#d9d2bd] bg-white pl-9 focus-visible:ring-[#A3B18A]"
          />

        </div>

        {isFetching && !isLoading && (
          <p className="text-sm text-[#687060]">
            Updating...
          </p>
        )}

      </div>


      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load contacts"}
        </div>
      )}

   
      {isLoading ? (

        <div className="rounded-xl border border-[#d9d2bd] bg-white p-10 text-center">

          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#A3B18A] border-t-transparent" />

          <p className="mt-3 text-sm text-[#687060]">
            Loading contacts...
          </p>

        </div>

      ) : (

        <>
         
          <ContactTable
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        
          {pagination &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* Total */}

                <p className="text-sm text-[#687060]">
                  Showing page{" "}

                  <span className="font-medium text-[#2F3529]">
                    {pagination.page}
                  </span>

                  {" "}of{" "}

                  <span className="font-medium text-[#2F3529]">
                    {pagination.totalPages}
                  </span>

                  {" · "}

                  {pagination.total} contacts
                </p>

                {/* Pagination Controls */}

                <div className="flex items-center gap-1">

                  {/* Previous */}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={
                      page <= 1 ||
                      isFetching
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    className="border-[#d9d2bd] hover:bg-[#F2E8CF]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}

                  {Array.from(
                    {
                      length:
                        pagination.totalPages,
                    },
                    (_, index) =>
                      index + 1
                  )
                    .filter(
                      (pageNumber) => {
                        if (
                          pagination.totalPages <=
                          5
                        ) {
                          return true;
                        }

                        return (
                          pageNumber === 1 ||
                          pageNumber ===
                            pagination.totalPages ||
                          Math.abs(
                            pageNumber -
                              page
                          ) <= 1
                        );
                      }
                    )
                    .map(
                      (pageNumber) => (
                        <Button
                          key={pageNumber}
                          type="button"
                          variant={
                            pageNumber === page
                              ? "default"
                              : "outline"
                          }
                          size="icon"
                          disabled={
                            isFetching
                          }
                          onClick={() =>
                            setPage(
                              pageNumber
                            )
                          }
                          className={
                            pageNumber === page
                              ? "bg-[#A3B18A] text-white hover:bg-[#87966F]"
                              : "border-[#d9d2bd] hover:bg-[#F2E8CF]"
                          }
                        >
                          {pageNumber}
                        </Button>
                      )
                    )}

                  {/* Next */}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={
                      page >=
                        pagination.totalPages ||
                      isFetching
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            pagination.totalPages,
                            current + 1
                          )
                      )
                    }
                    className="border-[#d9d2bd] hover:bg-[#F2E8CF]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                </div>
              </div>
            )}
        </>
      )}

    
      <ContactForm
        open={formOpen}
        onOpenChange={(value) => {
          setFormOpen(value);

          if (!value) {
            setSelectedContact(null);
          }
        }}
        contact={selectedContact}
      />

     
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(value) => {
          setDeleteOpen(value);

          if (!value) {
            setContactToDelete(null);
          }
        }}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        itemName={contactToDelete?.name}
        onConfirm={handleDeleteSuccess}
      />

    </div>
  );
}