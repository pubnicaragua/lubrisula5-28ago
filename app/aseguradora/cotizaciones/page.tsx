// import { Suspense } from "react"
// import { CotizacionesPage } from "@/components/cotizaciones/cotizaciones-page"
import { RoleGuard } from "@/components/auth/role-guard"
import CotizacionesRoute from "@/app/cotizaciones/page"
import { CotizacionesTallerPage } from "@/components/taller/cotizaciones-taller-page"

export default function AseguradoraCotizacionesPage() {
  return (
    <RoleGuard allowedRoles={["aseguradora"]}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Cotizaciones</h1>
        {/* <Suspense fallback={<div>Cargando cotizaciones...</div>}> */}
        <CotizacionesTallerPage  />
        {/* </Suspense> */}
      </div>
    </RoleGuard>
  )
}
