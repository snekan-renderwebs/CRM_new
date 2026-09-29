"use client";

import { useState } from "react";

import {
  useLeads,
  useDeleteLead,
  type Lead,
} from "../../../hooks/use-leads";

import LeadTable from "../../../components/leads/lead-table";

import LeadForm from "../../../components/leads/lead-form";

import DeleteConfirmDialog from "../../../components/common/delete-confirm-dialog";

export default function LeadsPage() {
  
  const [search, setSearch] = useState("");

 
  const [page, setPage] = useState(1);

  const limit = 10;

  
  const [open, setOpen] = useState(false);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  
  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteLead, setDeleteLead] =
    useState<Lead | null>(null);

  
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useLeads(
    search,
    page,
    limit
  );

  const leads = data?.leads ?? [];

  const pagination = data?.pagination;

  const totalPages =
    pagination?.totalPages ?? 1;

  
  const deleteLeadMutation =
    useDeleteLead();

  
  const handleAddLead = () => {
    setSelectedLead(null);
    setOpen(true);
  };

  
  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setOpen(true);
  };

  
  const handleDelete = (lead: Lead) => {
    setDeleteLead(lead);
    setDeleteOpen(true);
  };

  
  const handleConfirmDelete =
    async () => {
      if (!deleteLead) {
        return;
      }

      try {
        await deleteLeadMutation.mutateAsync(
          deleteLead.id
        );

        setDeleteOpen(false);

        setDeleteLead(null);

      } catch (error) {
        console.error(
          "Failed to delete lead:",
          error
        );
      }
    };

  
  const handleSearch = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  
  const handleFormSuccess = () => {
    setOpen(false);

    setSelectedLead(null);

    // After create/update,
    // go back to first page
    setPage(1);
  };

  
  return (
    <div className="space-y-6 p-6">

      
      <div>
        <h1 className="text-2xl font-semibold text-[#2F3529]">
          Leads
        </h1>

        <p className="mt-1 text-sm text-[#687060]">
          Manage and track your sales leads.
        </p>
      </div>


      
      <div className="flex items-center justify-between gap-4">

        {/* SEARCH */}

        <input
          type="text"
          value={search}
          onChange={(event) =>
            handleSearch(
              event.target.value
            )
          }
          placeholder="Search leads..."
          className="w-full max-w-sm rounded-lg border border-[#d9d2bd] bg-white px-4 py-2.5 text-sm text-[#2F3529] outline-none transition placeholder:text-[#8a8f82] focus:border-[#A3B18A] focus:ring-2 focus:ring-[#A3B18A]/20"
        />

        {/* FETCHING */}

        {isFetching && (
          <p className="text-xs text-[#687060]">
            Updating...
          </p>
        )}

        {/* ADD */}

        <button
          type="button"
          onClick={handleAddLead}
          className="rounded-lg bg-[#A3B18A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#87966F]"
        >
          + Add Lead
        </button>

      </div>


     
      {isLoading ? (

        <div className="rounded-xl border border-[#d9d2bd] bg-white p-10 text-center">

          <p className="text-sm text-[#687060]">
            Loading leads...
          </p>

        </div>

      ) : isError ? (

        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">

          <p className="text-sm text-red-600">
            Failed to load leads.
          </p>

        </div>

      ) : (

        <LeadTable
          leads={leads}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      )}


      
      {!isLoading &&
        !isError &&
        pagination &&
        pagination.totalPages > 0 && (

          <div className="flex items-center justify-between">

            {/* TOTAL */}

            <p className="text-sm text-[#687060]">

              {pagination.total} total leads

            </p>


            {/* BUTTONS */}

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  page === 1 ||
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
                className="rounded-md border border-[#d9d2bd] bg-white px-3 py-2 text-sm text-[#2F3529] transition hover:bg-[#F2E8CF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (pageNumber) => (

                  <button
                    key={pageNumber}
                    type="button"
                    disabled={isFetching}
                    onClick={() =>
                      setPage(
                        pageNumber
                      )
                    }
                    className={
                      pageNumber === page
                        ? "rounded-md bg-[#A3B18A] px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md border border-[#d9d2bd] bg-white px-3 py-2 text-sm text-[#2F3529] transition hover:bg-[#F2E8CF] disabled:opacity-40"
                    }
                  >
                    {pageNumber}
                  </button>

                )
              )}


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  page >= totalPages ||
                  isFetching
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                  )
                }
                className="rounded-md border border-[#d9d2bd] bg-white px-3 py-2 text-sm text-[#2F3529] transition hover:bg-[#F2E8CF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}


      
      <LeadForm
        open={open}
        onOpenChange={(value) => {

          setOpen(value);

          if (!value) {
            setSelectedLead(null);
          }

        }}
        lead={selectedLead}
        onSuccess={handleFormSuccess}
      />


      
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(value) => {

          setDeleteOpen(value);

          if (!value) {
            setDeleteLead(null);
          }

        }}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        itemName={
          deleteLead?.name
        }
        onConfirm={
          handleConfirmDelete
        }
        isDeleting={
          deleteLeadMutation.isPending
        }
      />

    </div>
  );
}