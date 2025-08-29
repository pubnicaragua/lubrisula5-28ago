"use client"
import { useState } from "react"
import { KanbanBoard } from "@/components/taller/kanban-board"
import { KanbanPersonalizado } from "@/components/taller/kanban-personalizado"
import { TallerLayout } from "@/components/taller/taller-layout"
// import type { Metadata } from "next"
// import type { Metadata } from "next"

// export const metadata: Metadata = {
//   title: "Tablero Kanban | AUTOFLOWX",
//   description: "Gestión visual de tareas y procesos del taller",
// }

// export const metadata: Metadata = {
//   title: "AutoFlowX - Sistema de Gestión para Talleres Automotrices",
//   description: "Optimiza las operaciones de tu taller automotriz con AutoFlowX",
//   generator: 'v0.dev'
// }
export default function TallerKanbanPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const Fn_Onchange = () => {
    console.log("Cambio detectado en KanbanPersonalizado")
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main>
      <KanbanPersonalizado onChange={Fn_Onchange} />
      <KanbanBoard key={refreshKey} />
    </main>
  )
}