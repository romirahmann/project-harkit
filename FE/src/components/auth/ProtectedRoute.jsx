import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("token") !== null;
  const expiresAt = sessionStorage.getItem("expiresAt");

  useEffect(() => {
    if (!isAuthenticated || (expiresAt && Date.now() > Number(expiresAt))) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  return isAuthenticated ? children : null;
}
