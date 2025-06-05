"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckCircle, XCircle, RefreshCw, UserCog } from "lucide-react"

export function DebugRoles() {
  const [user, setUser] = useState<any>(null)
  const [dbRole, setDbRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const supabase = createClientComponentClient()

  const fetchUserAndRole = async () => {
    setLoading(true)
    setError(null)

    try {
      // Obtener usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw new Error(`Error al obtener usuario: ${userError.message}`)
      }

      if (!userData.user) {
        setUser(null)
        setDbRole(null)
        setLoading(false)
        return
      }

      setUser(userData.user)

      // Obtener rol de la base de datos
      const { data: roleData, error: roleError } = await supabase
        .from("roles_usuario")
        .select(`
          roles (
            nombre
          )
        `)
        .eq("user_id", userData.user.id)
        .single()

      if (roleError) {
        if (roleError.code === "PGRST116") {
          // No se encontró ningún rol
          setDbRole(null)
        } else {
          throw new Error(`Error al obtener rol: ${roleError.message}`)
        }
      } else {
        setDbRole(roleData?.roles?.nombre || null)
      }
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const assignRole = async (roleName: string) => {
    if (!user) return

    setRefreshing(true)
    setError(null)

    try {
      // 1. Obtener ID del rol
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("nombre", roleName)
        .single()

      if (roleError) {
        throw new Error(`Error al obtener ID del rol: ${roleError.message}`)
      }

      // 2. Verificar si ya existe una asignación
      const { data: existingRole, error: existingRoleError } = await supabase
        .from("roles_usuario")
        .select("id")
        .eq("user_id", user.id)
        .eq("rol_id", roleData.id)
        .single()

      if (!existingRoleError) {
        // Ya existe esta asignación
        throw new Error(`El usuario ya tiene asignado el rol "${roleName}"`)
      }

      // 3. Insertar nueva asignación
      const { error: insertError } = await supabase.from("roles_usuario").insert({
        user_id: user.id,
        rol_id: roleData.id,
      })

      if (insertError) {
        throw new Error(`Error al asignar rol: ${insertError.message}`)
      }

      // 4. Actualizar metadatos del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: roleName },
      })

      if (updateError) {
        throw new Error(`Error al actualizar metadatos: ${updateError.message}`)
      }

      // 5. Actualizar la interfaz
      await fetchUserAndRole()
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUserAndRole()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-center mt-4">Cargando información de usuario y roles...</p>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTitle>No hay sesión activa</AlertTitle>
            <AlertDescription>Debes iniciar sesión para ver la información de roles.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="mr-2 h-5 w-5" />
          Depuración de Roles
        </CardTitle>
        <CardDescription>Información detallada sobre el usuario actual y sus roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Usuario</h3>
            <p className="text-lg">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <p className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto">{user.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Último inicio de sesión</h3>
              <p className="text-sm">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Nunca"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rol en Metadatos</h3>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="mr-2">
                  {user.user_metadata?.role || "No definido"}
                </Badge>
                {user.user_metadata?.role ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Rol en Base de Datos</h3>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="mr-2">
                  {dbRole || "No asignado"}
                </Badge>
                {dbRole ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Asignar Rol</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignRole("admin")}
                disabled={refreshing || dbRole === "admin"}
              >
                Admin
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignRole("taller")}
                disabled={refreshing || dbRole === "taller"}
              >
                Taller
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignRole("cliente")}
                disabled={refreshing || dbRole === "cliente"}
              >
                Cliente
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignRole("aseguradora")}
                disabled={refreshing || dbRole === "aseguradora"}
              >
                Aseguradora
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assignRole("superadmin")}
                disabled={refreshing || dbRole === "superadmin"}
              >
                SuperAdmin
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={fetchUserAndRole} disabled={refreshing} className="w-full">
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar Información
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
