"use client";

import { useEffect } from "react";

import {
  Bell,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "../../store/authstore";

export default function Header() {
  const user = useAuthStore(
    (state) => state.user
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const setLoading = useAuthStore(
    (state) => state.setLoading
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(
          "/api/auth/me"
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    // Zustand already has user
    // so no need to fetch again
    if (!user) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [
    user,
    setUser,
    setLoading,
  ]);

  const userName = user?.name || "User";

  const userRole = user?.role || "USER";

  const userInitial =
    userName.charAt(0).toUpperCase();

  const formattedRole =
    userRole === "SALES_MANAGER"
      ? "Sales Manager"
      : userRole === "SALES_USER"
      ? "Sales User"
      : userRole === "ADMIN"
      ? "Admin"
      : userRole;

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#d9d2bd] bg-white px-6">

      {/* Left */}

      <div>
        <h1 className="text-lg font-semibold text-[#2F3529]">
          CRM
        </h1>

        <p className="text-xs text-muted-foreground">
          Customer Relationship Management
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Notification */}

        <Button
          variant="ghost"
          size="icon"
          className="relative text-[#687060] hover:bg-[#F2E8CF]"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User */}

        <div className="flex items-center gap-3 border-l pl-4">

          {/* Avatar */}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A3B18A] text-sm font-semibold text-white">
            {userInitial}
          </div>

          {/* User details */}

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#2F3529]">
              {userName}
            </p>

            <p className="text-xs text-muted-foreground">
              {formattedRole}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />

        </div>
      </div>
    </header>
  );
}