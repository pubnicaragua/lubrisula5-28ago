import { FacturasPage } from "@/components/taller/facturas-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Facturas | AUTOFLOWX",
  description: "Gestión de facturas del taller",
}

export default function FacturasPageRoute() {
  return <FacturasPage />
}
