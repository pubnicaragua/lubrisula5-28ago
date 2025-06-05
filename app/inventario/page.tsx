import type { Metadata } from "next"
import { InventarioPage } from "@/components/inventario/inventario-page"

export const metadata: Metadata = {
  title: "Inventario | AUTOFLOWX",
  description: "Gestión de inventario del taller",
}

// Marcamos esta página como dinámica para evitar la prerenderización estática
export const dynamic = "force-dynamic"

export default function InventarioPageRoute() {
  return <InventarioPage />
}
