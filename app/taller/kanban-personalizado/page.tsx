import { KanbanPersonalizado } from "@/components/taller/kanban-personalizado"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Personalización del Kanban | AUTOFLOWX",
  description: "Configura tu tablero Kanban según las necesidades de tu taller",
}

export default function KanbanPersonalizadoPage() {
  return (
    <div className="container mx-auto py-6">
      <KanbanPersonalizado />
    </div>
  )
}
