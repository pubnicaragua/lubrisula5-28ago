import { ConfiguracionTaller } from "@/components/taller/configuracion-taller"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Configuración del Taller | AUTOFLOWX",
  description: "Personaliza la información y apariencia de tu taller",
}

export default function ConfiguracionTallerPage() {
  return (
    <div className="container mx-auto py-6">
      <ConfiguracionTaller />
    </div>
  )
}
