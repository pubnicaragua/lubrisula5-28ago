import { KanbanBoard } from "@/components/kanban/kanban-board"
import { TallerLayout } from "@/components/taller/taller-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tablero Kanban | AUTOFLOWX",
  description: "Gestión visual de tareas y procesos del taller",
}

export default function KanbanPage() {
  return (
    <TallerLayout>
      <KanbanBoard />
    </TallerLayout>
  )
}
