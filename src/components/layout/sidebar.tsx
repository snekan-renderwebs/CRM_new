"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  UserRoundSearch,
  CheckSquare,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { useAuthStore } from "../../store/authstore";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: UserRoundSearch,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user
  );

  const clearUser = useAuthStore(
    (state) => state.clearUser
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

 
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Logout API failed:",
        error
      );
    } finally {
      clearUser();

      setMobileOpen(false);

      router.replace("/login");

      router.refresh();
    }
  };

 
  const visibleMenuItems =
    menuItems.filter((item) => {
      if (item.adminOnly) {
        return user?.role === "ADMIN";
      }

      return true;
    });

  return (
    <>
      
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#d9d2bd] bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A3B18A] text-white">
            <Users className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold text-[#2F3529]">
            CRM
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (current) => !current
            )
          }
          className="rounded-lg p-2 text-[#687060] hover:bg-[#F2E8CF]"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

     
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

     
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-[#d9d2bd]
          bg-white
          transition-transform duration-200
          lg:static lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
       
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A3B18A] text-white">
              <Users className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold text-[#2F3529]">
              CRM
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="rounded-lg p-2 text-[#687060] hover:bg-[#F2E8CF] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>

          {visibleMenuItems.map(
            (item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#A3B18A] text-white"
                      : "text-[#687060] hover:bg-[#F2E8CF] hover:text-[#2F3529]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span>
                    {item.title}
                  </span>
                </Link>
              );
            }
          )}
        </nav>

       
        <div className="space-y-1 border-t border-[#d9d2bd] p-4">
          {/* Settings */}

          <Link
            href="/settings"
            onClick={() =>
              setMobileOpen(false)
            }
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-[#A3B18A] text-white"
                : "text-[#687060] hover:bg-[#F2E8CF] hover:text-[#2F3529]"
            }`}
          >
            <Settings className="h-5 w-5" />

            <span>Settings</span>
          </Link>

          

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#687060] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}