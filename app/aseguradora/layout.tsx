import type React from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import { AseguradoraNav } from "@/components/aseguradora/aseguradora-nav"

export default function AseguradoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleGuard allowedRoles={["aseguradora"]}>
    <div className="flex flex-col min-h-screen">
      <AseguradoraNav />
      <main className="flex-1">{children}</main>
    </div>
  </RoleGuard>
}
