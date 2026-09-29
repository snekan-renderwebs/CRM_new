"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "../../store/authstore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          clearUser();
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Authentication check failed:", error);

        clearUser();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}