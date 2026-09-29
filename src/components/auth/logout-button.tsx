"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "../../store/authstore";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const clearUser = useAuthStore(
    (state) => state.clearUser
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      clearUser();

      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}