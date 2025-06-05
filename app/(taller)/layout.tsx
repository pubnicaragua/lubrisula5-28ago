import type React from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { TallerNav } from "@/components/taller/taller-nav"

export default function TallerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["taller", "admin", "superadmin"]}>
      <div className="flex flex-col min-h-screen">
        <TallerNav />
        <main className="flex-1">{children}</main>
      </div>
    </RouteGuard>
  )
}
