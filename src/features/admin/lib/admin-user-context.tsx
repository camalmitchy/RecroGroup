"use client";

import { createContext, useContext, type ReactNode } from "react";

export type AdminUser = { name: string | null; email: string } | null;

const AdminUserContext = createContext<AdminUser>(null);

export function AdminUserProvider({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}) {
  return (
    <AdminUserContext.Provider value={user}>{children}</AdminUserContext.Provider>
  );
}

export function useAdminUser() {
  return useContext(AdminUserContext);
}
