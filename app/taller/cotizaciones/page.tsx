import { CotizacionesTallerPage } from "@/components/taller/cotizaciones-taller-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cotizaciones | AUTOFLOWX",
  description: "Gestión de órdenes de trabajo",
}
export default function CotizacionesTallerRoute() {
  return <CotizacionesTallerPage />
}
