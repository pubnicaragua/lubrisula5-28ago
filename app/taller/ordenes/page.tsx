import { OrdenesPage } from "@/components/ordenes/ordenes-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Órdenes | AUTOFLOWX",
  description: "Gestión de órdenes de trabajo",
}

export default function OrdenesRoute() {
  return <OrdenesPage />
}
