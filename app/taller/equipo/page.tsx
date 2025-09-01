import { EquipoPage } from "@/components/equipo/equipo-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Equipo | AUTOFLOWX",
  description: "Gestión de equipo del taller",
}

export default function EquipoPageRoute() {
  return <EquipoPage />
}
