"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, RefreshCw, UserCog } from "lucide-react"

export default function DebugRolePage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dbRoles, setDbRoles] = useState<any[]>([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        setError(null)

        // Obtener sesión actual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(`Error al obtener la sesión: ${sessionError.message}`)
        }

        if (!session) {
          throw new Error("No hay sesión activa. Por favor, inicia sesión.")
        }

        // Obtener datos del usuario
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(`Error al obtener datos del usuario: ${userError.message}`)
        }

        setUser(userData.user)

        // Obtener roles del usuario desde la base de datos
        const { data: userRoles, error: rolesError } = await supabase
          .from("roles_usuario")
          .select("rol_id")
          .eq("user_id", userData.user.id)

        if (rolesError) {
          console.error("Error al obtener roles del usuario:", rolesError)
        }

        if (userRoles && userRoles.length > 0) {
          const roleIds = userRoles.map((ur) => ur.rol_id)

          // Obtener nombres de roles
          const { data: roles, error: rolesNameError } = await supabase
            .from("roles")
            .select("id, nombre")
            .in("id", roleIds)

          if (rolesNameError) {
            console.error("Error al obtener nombres de roles:", rolesNameError)
          } else {
            setDbRoles(roles || [])
          }
        }
      } catch (err: any) {
        console.error("Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const setSuperAdminRole = async () => {
    try {
      setUpdating(true)
      setSuccess(null)
      setError(null)

      // 1. Actualizar metadatos del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: "superadmin" },
      })

      if (updateError) {
        throw new Error(`Error al actualizar metadatos: ${updateError.message}`)
      }

      // 2. Verificar si existe el rol superadmin en la tabla roles
      const { data: superadminRole, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .ilike("nombre", "superadmin")
        .limit(1)

      if (roleError) {
        throw new Error(`Error al buscar rol superadmin: ${roleError.message}`)
      }

      let superadminRoleId: number

      if (!superadminRole || superadminRole.length === 0) {
        // Crear el rol superadmin si no existe
        const { data: newRole, error: createRoleError } = await supabase
          .from("roles")
          .insert({ nombre: "superadmin" })
          .select("id")
          .single()

        if (createRoleError) {
          throw new Error(`Error al crear rol superadmin: ${createRoleError.message}`)
        }

        superadminRoleId = newRole.id
      } else {
        superadminRoleId = superadminRole[0].id
      }

      // 3. Asignar rol superadmin al usuario en roles_usuario
      const { error: assignRoleError } = await supabase.from("roles_usuario").upsert({
        user_id: user.id,
        rol_id: superadminRoleId,
      })

      if (assignRoleError) {
        throw new Error(`Error al asignar rol superadmin: ${assignRoleError.message}`)
      }

      setSuccess(
        "¡Rol de SuperAdmin establecido correctamente! Por favor, cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto.",
      )

      // Actualizar la información del usuario en la página
      const {
        data: { user: updatedUser },
        error: refreshError,
      } = await supabase.auth.getUser()

      if (refreshError) {
        console.error("Error al actualizar datos del usuario:", refreshError)
      } else {
        setUser(updatedUser)
      }

      // Actualizar roles de la base de datos
      const { data: updatedRoles, error: updatedRolesError } = await supabase
        .from("roles_usuario")
        .select("rol_id")
        .eq("user_id", user.id)

      if (updatedRolesError) {
        console.error("Error al obtener roles actualizados:", updatedRolesError)
      } else if (updatedRoles && updatedRoles.length > 0) {
        const roleIds = updatedRoles.map((ur) => ur.rol_id)

        const { data: roles } = await supabase.from("roles").select("id, nombre").in("id", roleIds)

        setDbRoles(roles || [])
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Depuración de Roles</h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando información del usuario...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>Detalles de tu cuenta y roles asignados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">ID de Usuario:</h3>
                <p className="text-sm text-muted-foreground">{user?.id}</p>
              </div>

              <div>
                <h3 className="font-medium">Email:</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <div>
                <h3 className="font-medium">Rol en Metadatos:</h3>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {user?.user_metadata?.role || "No definido"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Roles en Base de Datos:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dbRoles.length > 0 ? (
                    dbRoles.map((role) => (
                      <Badge key={role.id} variant="outline" className="bg-green-50 text-green-700">
                        {role.nombre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No hay roles asignados en la base de datos</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={setSuperAdminRole} disabled={updating}>
                {updating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <UserCog className="mr-2 h-4 w-4" />
                    Establecer como SuperAdmin
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Para solucionar problemas de roles:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Haz clic en "Establecer como SuperAdmin" para actualizar tu rol.</li>
                <li>Cierra sesión y vuelve a iniciar sesión para que los cambios surtan efecto.</li>
                <li>
                  Intenta acceder a las rutas de administrador como <code>/admin/dashboard</code>.
                </li>
                <li>Si sigues teniendo problemas, verifica los logs del servidor para más información.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
