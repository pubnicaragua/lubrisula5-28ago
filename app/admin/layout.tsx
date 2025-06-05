import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleGuard allowedRoles={["admin", "superadmin"]}>{children}</RoleGuard>
}
