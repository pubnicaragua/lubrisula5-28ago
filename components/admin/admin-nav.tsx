"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/supabase/auth"
import {
  Users,
  Building2,
  Car,
  ClipboardList,
  BarChart3,
  Settings,
  Database,
  Shield,
  ClipboardCheck,
  FileSpreadsheet,
  LogOut,
  Activity,
  CheckCircle,
} from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isSuperAdmin = user?.role === "superadmin"

  return (
    <nav className="grid items-start gap-2">
      <Link
        href="/admin/dashboard"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/dashboard" ? "bg-accent" : "transparent",
        )}
      >
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </Link>

      {isSuperAdmin && (
        <Link
          href="/admin/superadmin"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/admin/superadmin" ? "bg-accent" : "transparent",
            "text-red-600 hover:text-red-700 hover:bg-red-50",
          )}
        >
          <Shield className="h-4 w-4" />
          Panel SuperAdmin
        </Link>
      )}

      <Link
        href="/admin/usuarios"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/usuarios" ? "bg-accent" : "transparent",
        )}
      >
        <Users className="h-4 w-4" />
        Usuarios
      </Link>
      <Link
        href="/solicitudes"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/talleres" ? "bg-accent" : "transparent",
        )}
      >
        <Building2 className="h-4 w-4" />
        Talleres
      </Link>
      <Link
        href="/admin/aseguradoras"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/aseguradoras" ? "bg-accent" : "transparent",
        )}
      >
        <Shield className="h-4 w-4" />
        Aseguradoras
      </Link>
      <Link
        href="/admin/clientes"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/clientes" ? "bg-accent" : "transparent",
        )}
      >
        <Users className="h-4 w-4" />
        Clientes
      </Link>
      <Link
        href="/admin/vehiculos"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/vehiculos" ? "bg-accent" : "transparent",
        )}
      >
        <Car className="h-4 w-4" />
        Vehículos
      </Link>
      <Link
        href="/admin/cotizaciones"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/cotizaciones" ? "bg-accent" : "transparent",
        )}
      >
        <ClipboardList className="h-4 w-4" />
        Cotizaciones
      </Link>
      <Link
        href="/reportes"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/reportes" ? "bg-accent" : "transparent",
        )}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Reportes
      </Link>
      <Link
        href="/admin/database"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/database" ? "bg-accent" : "transparent",
        )}
      >
        <Database className="h-4 w-4" />
        Base de Datos
      </Link>
      <Link
        href="/admin/qa-check"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/qa-check" ? "bg-accent" : "transparent",
        )}
      >
        <ClipboardCheck className="h-4 w-4" />
        Verificación QA
      </Link>
      <Link
        href="/admin/test-data"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/test-data" ? "bg-accent" : "transparent",
        )}
      >
        <Database className="h-4 w-4" />
        Datos de Prueba
      </Link>
      <Link
        href="/admin/initialize-new-tables"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/initialize-new-tables" ? "bg-accent" : "transparent",
        )}
      >
        <Database className="h-4 w-4" />
        Inicializar Nuevas Tablas
      </Link>
      <Link
        href="/admin/settings"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/settings" ? "bg-accent" : "transparent",
        )}
      >
        <Settings className="h-4 w-4" />
        Configuración
      </Link>
      <Link
        href="/admin/deploy-status"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/deploy-status" ? "bg-accent" : "transparent",
        )}
      >
        <Activity className="h-4 w-4" />
        Estado del Deploy
      </Link>
      <Link
        href="/admin/verify-deploy"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === "/admin/verify-deploy" ? "bg-accent" : "transparent",
        )}
      >
        <CheckCircle className="h-4 w-4" />
        Verificar Deploy
      </Link>
      <div className="border-t my-3"></div>
      <button
        onClick={signOut}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700"
      >
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </button>
    </nav>
  )
}
