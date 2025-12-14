import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  roles?: string[];
}

interface TokenPayload {
  role: string;
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  let decoded: TokenPayload | null = null;

  try {
    decoded = jwtDecode<TokenPayload>(token);
  } catch {
    return <Navigate to="/" replace />;
  }

  const userRole = decoded?.role?.toLowerCase();

  if (roles && roles.length > 0 && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  return children;
};
