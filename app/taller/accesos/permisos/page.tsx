import { EmpleadosPermisos } from "@/components/taller/empleados-permisos"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Permisos de Empleados | AUTOFLOWX",
  description: "Gestiona los permisos y accesos de los empleados del taller",
}

export default function PermisosEmpleadosPage() {
  return (
    <div className="container mx-auto py-6">
      <EmpleadosPermisos />
    </div>
  )
}