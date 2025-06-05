import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reportes | AUTOFLOWX",
  description: "Reportes del taller",
}

export default function ReportesPage() {
  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Reportes del Taller</h1>
      <p>Contenido de la página de reportes...</p>
    </div>
  )
}
