import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"

export default function AseguradoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleGuard allowedRoles={["aseguradora"]}>{children}</RoleGuard>
}
