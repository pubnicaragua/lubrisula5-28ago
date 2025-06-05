"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Users, Settings, Database, Shield, LogOut } from "lucide-react"

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/admin/usuarios")}>Gestionar Usuarios</Button>
          <Button variant="destructive" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/admin/usuarios")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/admin/configuracion")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuración</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sistema</div>
            <p className="text-xs text-muted-foreground">Configuración general</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/admin/database")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Datos</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activa</div>
            <p className="text-xs text-muted-foreground">Estado de la base de datos</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/admin/superadmin")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permisos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Administrador</div>
            <p className="text-xs text-muted-foreground">Nivel de acceso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { accion: "Usuario creado", usuario: "cliente1@ejemplo.com", tiempo: "Hace 2 horas" },
                { accion: "Rol modificado", usuario: "tecnico@ejemplo.com", tiempo: "Hace 5 horas" },
                { accion: "Backup realizado", usuario: "sistema", tiempo: "Hace 1 día" },
              ].map((actividad, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{actividad.accion}</p>
                    <p className="text-xs text-muted-foreground">
                      {actividad.usuario} - {actividad.tiempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Información sobre el estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { componente: "Base de Datos", estado: "Conectada", indicador: "bg-green-100 text-green-800" },
                { componente: "API", estado: "Operativa", indicador: "bg-green-100 text-green-800" },
                { componente: "Almacenamiento", estado: "75% utilizado", indicador: "bg-yellow-100 text-yellow-800" },
              ].map((sistema, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sistema.componente}</p>
                    <p className="text-xs text-muted-foreground">{sistema.estado}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${sistema.indicador}`}>
                    {i === 2 ? "Advertencia" : "OK"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
