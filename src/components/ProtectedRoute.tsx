import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";

interface MeResponse { id: number; username: string; role: string }

const VITE_ME_API_URL = import.meta.env.VITE_ME_API_URL as string;

async function fetchMe(): Promise<MeResponse> {
  const res = await axiosInstance.get<MeResponse>(VITE_ME_API_URL);
  return res.data;
}

export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  if (isLoading) return null; // could return a spinner component

  if (isError || !data?.role) return <Navigate to="/" replace />;

  if (roles && !roles.includes(data.role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};
