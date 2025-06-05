import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleGuard allowedRoles={["cliente"]}>{children}</RoleGuard>
}
