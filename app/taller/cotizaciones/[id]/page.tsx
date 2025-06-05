import { CotizacionDetalleTaller } from "@/components/taller/cotizacion-detalle-taller"

export default function CotizacionDetallePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <CotizacionDetalleTaller cotizacionId={params.id} />
    </div>
  )
}
