"use client"

import { KanbanBoard } from "@/components/taller/kanban-board"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { useEffect, useState } from "react"

interface KanbanColumn {
  id: string
  title: string
  color: string
}

interface KanbanConfiguration {
  tipoTaller: string
  columnas: KanbanColumn[]
  mostrarPorcentajes: boolean
  mostrarTiempoEstimado: boolean
  mostrarAsignados: boolean
}

const defaultColumns: KanbanColumn[] = [
  { id: "col-1", title: "Pendiente", color: "#ef4444" }, // red-500
  { id: "col-2", title: "En Proceso", color: "#f97316" }, // orange-500
  { id: "col-3", title: "En Espera", color: "#eab308" }, // yellow-500
  { id: "col-4", title: "Control de Calidad", color: "#22c55e" }, // green-500
  { id: "col-5", title: "Finalizado", color: "#3b82f6" }, // blue-500
]

export default function KanbanPage() {
  const [kanbanConfig, setKanbanConfig] = useState<KanbanConfiguration | null>(null)

  useEffect(() => {
    const savedConfig = localStorage.getItem("kanbanConfig")
    if (savedConfig) {
      setKanbanConfig(JSON.parse(savedConfig))
    } else {
      setKanbanConfig({
        tipoTaller: "mecanica",
        columnas: defaultColumns,
        mostrarPorcentajes: true,
        mostrarTiempoEstimado: true,
        mostrarAsignados: true,
      })
    }
  }, [])

  if (!kanbanConfig) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <MainNav />
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <h1 className="text-3xl font-bold tracking-tight">Cargando Tablero Kanban...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Tablero Kanban</h1>
        <KanbanBoard
          columns={kanbanConfig.columnas}
          showPercentages={kanbanConfig.mostrarPorcentajes}
          showEstimatedTime={kanbanConfig.mostrarTiempoEstimado}
          showAssigned={kanbanConfig.mostrarAsignados}
        />
      </div>
    </div>
  )
}
