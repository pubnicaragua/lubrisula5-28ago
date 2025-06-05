"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, RefreshCw, UserCog, Shield, AlertTriangle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function VerificarUsuariosPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [userRoles, setUserRoles] = useState<any[]>([])
  const [usersWithoutRoles, setUsersWithoutRoles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("todos")
  const [fixResult, setFixResult] = useState<any>(null)

  const supabase = createClientComponentClient()

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      // Obtener todos los usuarios
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()

      if (usersError) {
        throw new Error(`Error al obtener usuarios: ${usersError.message}`)
      }

      setUsers(usersData?.users || [])

      // Obtener roles asignados
      const { data: rolesData, error: rolesError } = await supabase.from("roles_usuario").select(`
          user_id,
          roles (
            id,
            nombre
          )
        `)

      if (rolesError) {
        throw new Error(`Error al obtener roles: ${rolesError.message}`)
      }

      setUserRoles(rolesData || [])

      // Identificar usuarios sin roles
      const usersWithoutRolesArray =
        usersData?.users.filter((user) => !rolesData?.some((role) => role.user_id === user.id)) || []

      setUsersWithoutRoles(usersWithoutRolesArray)
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fixUserRoles = async () => {
    setLoading(true)
    setFixResult(null)

    try {
      const { data, error } = await supabase.functions.invoke("fix-user-roles")

      if (error) {
        throw new Error(`Error al corregir roles: ${error.message}`)
      }

      setFixResult(data)
      await fetchUsers() // Actualizar datos después de la corrección
    } catch (error: any) {
      console.error("Error:", error)
      setFixResult({ success: false, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getUserRole = (userId: string) => {
    const userRole = userRoles.find((role) => role.user_id === userId)
    return userRole?.roles?.nombre || "Sin rol"
  }

  const getMetadataRole = (user: any) => {
    return user.user_metadata?.role || "No definido"
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5" />
            Verificación de Usuarios y Roles
          </CardTitle>
          <CardDescription>Verifica y corrige la asignación de roles para los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fixResult && (
            <Alert variant={fixResult.success ? "default" : "destructive"}>
              {fixResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{fixResult.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{fixResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {loading ? "Cargando usuarios..." : `${users.length} usuarios encontrados`}
            </h3>
            <Button onClick={fetchUsers} variant="outline" size="sm" disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Actualizar</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos">
                Todos los Usuarios
                <Badge variant="outline" className="ml-2">
                  {users.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="con-roles">
                Con Roles
                <Badge variant="outline" className="ml-2">
                  {users.length - usersWithoutRoles.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="sin-roles">
                Sin Roles
                <Badge variant="outline" className="ml-2">
                  {usersWithoutRoles.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="border rounded-md mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol en Metadatos</TableHead>
                    <TableHead>Rol en BD</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getMetadataRole(user)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getUserRole(user.id)}</Badge>
                      </TableCell>
                      <TableCell>
                        {getUserRole(user.id) !== "Sin rol" ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            OK
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Sin rol asignado
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="con-roles" className="border rounded-md mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol en Metadatos</TableHead>
                    <TableHead>Rol en BD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter((user) => !usersWithoutRoles.some((u) => u.id === user.id))
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getMetadataRole(user)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getUserRole(user.id)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sin-roles" className="border rounded-md mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol en Metadatos</TableHead>
                    <TableHead>Creado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithoutRoles.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getMetadataRole(user)}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Actualizar Datos
          </Button>
          <Button onClick={fixUserRoles} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
            Corregir Roles de Usuario
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
