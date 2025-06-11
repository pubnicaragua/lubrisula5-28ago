import { KanbanBoard } from "@/components/kanban/kanban-board"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tablero Kanban | AUTOFLOWX",
  description: "Gestión visual de tareas y procesos del taller",
}

export default function KanbanPageRoute() {
  return (
    <div className="container mx-auto py-6">
      <KanbanBoard />
    </div>
  )
}
