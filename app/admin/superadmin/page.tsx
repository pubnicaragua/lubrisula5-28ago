import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Database, Users, Settings, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SuperAdminPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de SuperAdmin</h1>
          <p className="text-muted-foreground">Herramientas y funciones exclusivas para SuperAdmin</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              <CardTitle>Gestión de Roles</CardTitle>
            </div>
            <CardDescription>Administra los roles de usuarios en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/set-superadmin">
                  <Shield className="mr-2 h-4 w-4" />
                  Asignar Rol SuperAdmin
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/usuarios">
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Usuarios
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Administración de Base de Datos</CardTitle>
            </div>
            <CardDescription>Herramientas para gestionar la base de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/database">
                  <Database className="mr-2 h-4 w-4" />
                  Estado de Base de Datos
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/database/initialize">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Inicializar Base de Datos
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/test-data">
                  <Database className="mr-2 h-4 w-4" />
                  Cargar Datos de Prueba
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Configuración del Sistema</CardTitle>
            </div>
            <CardDescription>Configuraciones avanzadas del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración General
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/qa-check">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verificación QA
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
