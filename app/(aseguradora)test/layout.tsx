import type React from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { AseguradoraNav } from "@/components/aseguradora/aseguradora-nav"

export default function AseguradoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard 
    // allowedRoles={["aseguradora", "admin", "superadmin"]}
    >
      <div className="flex flex-col min-h-screen">
        <AseguradoraNav />
        <main className="flex-1">{children}</main>
      </div>
    </RouteGuard>
  )
}
