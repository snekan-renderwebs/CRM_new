"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import {
  useUsers,
  useDeleteUser,
  type User,
} from "../../../hooks/use-users";

import DeleteConfirmDialog from "../../../components/common/delete-confirm-dialog";

import UserTable from "../../../components/users/user-table";

import UserForm from "../../../components/users/user-form";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";


export default function UsersPage() {

  
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const limit = 10;

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);


  
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useUsers(
    search,
    page,
    limit
  );


  const deleteUser =
    useDeleteUser();


  
  const users =
    data?.users ?? [];

  const pagination =
    data?.pagination;


 
  useEffect(() => {
    setPage(1);
  }, [search]);


  
  const handleEdit = (
    user: User
  ) => {
    setSelectedUser(user);
    setFormOpen(true);
  };


  
  const handleDelete = (
    user: User
  ) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };



  const handleConfirmDelete =
    async () => {

      if (!selectedUser) {
        return;
      }

      try {

        await deleteUser.mutateAsync(
          selectedUser.id
        );

        setDeleteOpen(false);

        setSelectedUser(null);

      } catch (error) {

        console.error(
          "Failed to delete user:",
          error
        );

      }
    };



  if (isLoading) {
    return (
      <div className="p-6">

        <div className="flex min-h-[300px] items-center justify-center">

          <p className="text-sm text-[#687060]">
            Loading users...
          </p>

        </div>

      </div>
    );
  }



  if (error) {
    return (
      <div className="p-6">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-medium text-red-600">
            Failed to load users
          </p>

          <p className="mt-1 text-sm text-red-500">
            {error.message}
          </p>

        </div>

      </div>
    );
  }


  
  return (
    <div className="space-y-6 p-6">


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-[#2F3529]">
            Users
          </h1>

          <p className="mt-1 text-sm text-[#687060]">
            Manage CRM users and their roles.
          </p>

        </div>


      

        <Button
          type="button"
          className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
          onClick={() => {

            setSelectedUser(null);

            setFormOpen(true);

          }}
        >

          <Plus className="mr-2 h-4 w-4" />

          Add User

        </Button>

      </div>


      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-sm">

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#687060]"
          />

          <Input
            value={search}
            onChange={(event) => {

              setSearch(
                event.target.value
              );

            }}
            placeholder="Search by name or email..."
            className="border-[#d9d2bd] pl-9 focus-visible:ring-[#A3B18A]"
          />

        </div>


       

        {isFetching && (
          <p className="text-xs text-[#687060]">
            Updating...
          </p>
        )}

      </div>


      
      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


      
      {pagination &&
        pagination.totalPages > 0 && (

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


            {/* TOTAL */}

            <p className="text-sm text-[#687060]">

              Showing{" "}

              <span className="font-medium text-[#2F3529]">
                {users.length}
              </span>

              {" "}of{" "}

              <span className="font-medium text-[#2F3529]">
                {pagination.total}
              </span>

              {" "}users

            </p>



            <div className="flex items-center gap-1">


            

              <Button
                type="button"
                variant="outline"
                size="sm"
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
                className="border-[#d9d2bd] text-[#2F3529] hover:bg-[#F2E8CF]"
              >
                Previous
              </Button>


            

              {Array.from(
                {
                  length:
                    pagination.totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (pageNumber) => (

                  <Button
                    key={pageNumber}
                    type="button"
                    variant={
                      page === pageNumber
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    disabled={isFetching}
                    onClick={() =>
                      setPage(
                        pageNumber
                      )
                    }
                    className={
                      page === pageNumber
                        ? "bg-[#A3B18A] text-white hover:bg-[#87966F]"
                        : "border-[#d9d2bd] text-[#2F3529] hover:bg-[#F2E8CF]"
                    }
                  >
                    {pageNumber}
                  </Button>

                )
              )}


              

              <Button
                type="button"
                variant="outline"
                size="sm"
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
                className="border-[#d9d2bd] text-[#2F3529] hover:bg-[#F2E8CF]"
              >
                Next
              </Button>

            </div>

          </div>

        )}


      
      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSuccess={() => {

          setSelectedUser(null);

        }}
      />


     
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName={
          selectedUser?.name
        }
        onConfirm={
          handleConfirmDelete
        }
        isDeleting={
          deleteUser.isPending
        }
      />

    </div>
  );
}