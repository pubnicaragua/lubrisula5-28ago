import { KanbanBoard } from "@/components/taller/kanban-board"  
import { TallerLayout } from "@/components/taller/taller-layout"  
import type { Metadata } from "next"  
  
export const metadata: Metadata = {  
  title: "Tablero Kanban | AUTOFLOWX",  
  description: "Gestión visual de tareas y procesos del taller",  
}  
  
export default function TallerKanbanPage() {  
  return (  
    // <TallerLayout>  
      // <div className="container mx-auto py-6">  
        <KanbanBoard />  
      // </div>  
    // </TallerLayout>  
  )  
}