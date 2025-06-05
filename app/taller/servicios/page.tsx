import { ServiciosPage } from "@/components/taller/servicios-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servicios | AUTOFLOWX",
  description: "Gestión de servicios del taller",
}

export default function ServiciosPageRoute() {
  return <ServiciosPage />
}
