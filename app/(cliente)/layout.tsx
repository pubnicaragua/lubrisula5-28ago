import type React from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { ClienteNav } from "@/components/cliente/cliente-nav"

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["cliente", "admin", "superadmin"]}>
      <div className="flex flex-col min-h-screen">
        <ClienteNav />
        <main className="flex-1">{children}</main>
      </div>
    </RouteGuard>
  )
}
