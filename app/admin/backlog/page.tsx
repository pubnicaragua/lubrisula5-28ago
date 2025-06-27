import type { Metadata } from "next"
import ProjectBacklogComplete from "@/components/admin/project-backlog-complete"

export const metadata: Metadata = {
  title: "Backlog Completo | AutoFlowX Admin",
  description: "Backlog completo del proyecto AutoFlowX con todas las funcionalidades, estados y métricas detalladas.",
}

export default function BacklogPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Backlog del Proyecto</h2>
      </div>
      <ProjectBacklogComplete />
    </div>
  )
}
