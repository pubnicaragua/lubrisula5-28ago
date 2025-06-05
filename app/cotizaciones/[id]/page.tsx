import type React from "react"
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { CotizacionDetalle } from "@/components/cotizaciones/cotizacion-detalle"

export default function CotizacionPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <Suspense
        fallback={
          <div className="flex justify-center items-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        }
      >
        <ErrorBoundary>
          <CotizacionDetalle cotizacionId={params.id} />
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
