import { Suspense } from "react"
import { CotizacionesPage } from "@/components/cotizaciones/cotizaciones-page"
import { RoleGuard } from "@/components/auth/role-guard"

export default function AseguradoraCotizacionesPage() {
  return (
    <RoleGuard allowedRoles={["aseguradora"]}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Cotizaciones</h1>
        <Suspense fallback={<div>Cargando cotizaciones...</div>}>
          {/* <CotizacionesPage  /> */}
        </Suspense>
      </div>
    </RoleGuard>
  )
}
