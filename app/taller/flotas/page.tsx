import { FlotasPage } from "@/components/flotas/flotas-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flotas | AUTOFLOWX",
  description: "Gestión de flotas del taller",
}

export default function FlotasPageRoute() {
  return <FlotasPage />
}
