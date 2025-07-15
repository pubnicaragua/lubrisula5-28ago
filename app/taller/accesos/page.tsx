import GestionAccesos from "@/components/taller/gestion-accesos"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestión de Accesos | AUTOFLOWX",
  description: "Administra los accesos de técnicos, clientes y aseguradoras a tu taller",
}

export default function GestionAccesosPage() {
  return (
    <div className="container mx-auto py-6">
      <GestionAccesos />
    </div>
  )
}
