"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function AuthDebug() {
  const { user, loading } = useAuth()
  const [dbRole, setDbRole] = useState<string | null>(null)
  const [dbRoleLoading, setDbRoleLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setDbRoleLoading(false)
        return
      }

      try {
        setDbRoleLoading(true)

        // Consultar la tabla roles_usuario para obtener el rol del usuario actual
        const { data, error } = await supabase
          .from("roles_usuario")
          .select("roles(nombre)")
          .eq("user_id", user.id)
          .single()

        if (error) {
          throw error
        }

        if (data && data.roles) {
          setDbRole(data.roles.nombre)
        } else {
          setDbRole("No asignado en BD")
        }
      } catch (err) {
        console.error("Error al obtener rol de BD:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
        setDbRole(null)
      } finally {
        setDbRoleLoading(false)
      }
    }

    fetchUserRole()
  }, [user, supabase])

  if (loading || dbRoleLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticación</CardTitle>
          <CardDescription>Cargando información de usuario...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticación</CardTitle>
          <CardDescription>No hay usuario autenticado</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              No se ha detectado ningún usuario autenticado. Por favor, inicia sesión para continuar.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/auth/login")}>Ir a Iniciar Sesión</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico de Autenticación</CardTitle>
        <CardDescription>Información del usuario actual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">ID de Usuario:</div>
          <div className="font-mono">{user.id}</div>

          <div className="font-medium">Email:</div>
          <div>{user.email}</div>

          <div className="font-medium">Rol en Auth:</div>
          <div className="font-semibold">{user.role || "No definido"}</div>

          <div className="font-medium">Rol en Base de Datos:</div>
          <div className="font-semibold">{dbRole || "No encontrado"}</div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {user.role !== dbRole && !error && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertDescription>
              <strong>Advertencia:</strong> El rol en Auth ({user.role || "No definido"}) no coincide con el rol en la
              base de datos ({dbRole || "No encontrado"}). Esto puede causar problemas de acceso.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Actualizar
        </Button>
        <Button onClick={() => (window.location.href = "/admin/sync-roles")}>Sincronizar Roles</Button>
      </CardFooter>
    </Card>
  )
}
