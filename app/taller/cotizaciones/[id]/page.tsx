import { CotizacionDetalleTaller } from "@/components/taller/cotizacion-detalle-taller"

export default function CotizacionDetallePage({ params }: { params: { id: string } }) {
  return <CotizacionDetalleTaller id={params.id} />
}
