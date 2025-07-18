/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import { router } from "../../routes/Routes";
import { Outlet } from "@tanstack/react-router";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!user) {
      router.navigate({ to: "/login" });
    }
  }, [user, loading]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}
