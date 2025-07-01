"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Edit,
  Search,
  Trash2,
  UserPlus,
  Users,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Mail,
  Loader2,
} from "lucide-react"
import { Can } from "@/components/auth/can"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { RegisterForm } from "@/components/auth/register-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getUsers,
  deleteUser,
  toggleUserStatus,
  sendPasswordResetEmail,
  type UserWithDetails,
} from "@/lib/actions/users"
import USER_SERVICE, { UserType } from "@/services/USER_SERVICES"

interface User extends UserWithDetails { }

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [pageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const [UsersData, SetUsersData] = useState<UserType[]>([])

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getUsers()

      if (!result.success) {
        throw new Error(result.error)
      }

      // setUsers(result.data)
      setUsers([])
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      setError("Error al cargar los usuarios. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }, [])
  const Fn_GET_USERS = async () => {
    const res = await USER_SERVICE.GET_ALL_USERS()
    console.log(res)
    SetUsersData(res)
    setLoading(false)
  }

  useEffect(() => {
    Fn_GET_USERS()
  }, [])
  // useEffect(() => {
  //   fetchUsers()
  // }, [fetchUsers])

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setLoading(true)
      const result = await deleteUser(userToDelete.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente",
      })

      // Actualizar la lista de usuarios
      fetchUsers()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
      setUserToDelete(null)
    }
  }

  const handleToggleUserStatus = async (userId: string, isCurrentlyActive: boolean) => {
    try {
      setLoading(true)
      const result = await toggleUserStatus(userId, isCurrentlyActive)
      console.log(result)
      console.log(userId, isCurrentlyActive)
      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: isCurrentlyActive ? "Usuario desactivado" : "Usuario activado",
        description: `El usuario ha sido ${isCurrentlyActive ? "desactivado" : "activado"} correctamente`,
      })

      // Actualizar la lista de usuarios
      fetchUsers()
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del usuario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendPasswordReset = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/actualizar-password`
      const result = await sendPasswordResetEmail(email, redirectUrl)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Correo enviado",
        description: "Se ha enviado un correo para restablecer la contraseña",
      })
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el correo de restablecimiento",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = ["Nombre", "Apellido", "Email", "Teléfono", "Rol", "Fecha de Registro", "Estado"]

    const csvData = filteredUsers.map((user) => [
      user.perfil_nombre || "",
      user.perfil_apellido || "",
      user?.perfil_correo,
      user.perfil_telefono || "",
      user.role_name,
      new Date(user.user_created_at).toLocaleDateString(),
      user.perfil_estado ? "Activo" : "Inactivo",
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "usuarios.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtrar usuarios
  const filteredUsers = UsersData.filter((user) => {
    // Filtro de búsqueda
    const matchesSearch =
      user?.perfil_correo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      (user?.perfil_nombre && user?.perfil_nombre?.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      (user?.perfil_apellido && user?.perfil_apellido?.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      user?.role_name?.toLowerCase().includes(searchTerm?.toLowerCase())

    // Filtro de rol
    const matchesRole = !roleFilter || user.role_name === roleFilter

    // Filtro de estado
    const matchesStatus =
      !statusFilter || (statusFilter === "activo" && user.perfil_estado) || (statusFilter === "inactivo" && !user.perfil_estado)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers: UserType[] = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getRoleBadgeColor = (role?: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super administrador":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "taller":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "aseguradora":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "cliente":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "tecnico":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="container mx-auto h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Can perform="create:users" roles={["admin", "superadmin", "taller"]}>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </Can>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios por nombre, email o rol..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => setRoleFilter(value === "todos" ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
              <SelectItem value="Taller">Taller</SelectItem>
              <SelectItem value="Aseguradora">Aseguradora</SelectItem>
              <SelectItem value="Tecnico">Técnico</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Super Administrador">Super Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setStatusFilter(value === "todos" ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>Lista de todos los usuarios registrados ({filteredUsers.length})</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800">{error}</h3>
              <Button variant="outline" onClick={fetchUsers} className="mt-4">
                Reintentar
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No se encontraron usuarios</h3>
              {searchTerm && (
                <p className="text-muted-foreground mt-2">
                  No hay resultados para "{searchTerm}". Intente con otra búsqueda.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    {/* <TableHead>Último Acceso</TableHead> */}
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.perfil_id}>
                      <TableCell>
                        {user.perfil_id ? (
                          <div className="font-medium">
                            {user?.perfil_nombre} {user.perfil_apellido}
                            {user.perfil_telefono && (
                              <div className="text-xs text-muted-foreground mt-1">Tel: {user.perfil_telefono}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin perfil</span>
                        )}
                      </TableCell>
                      <TableCell>{user?.user_email}</TableCell>
                      <TableCell>
                        <Badge
                          //className={getRoleBadgeColor(user.role?.nombre)}
                          variant="outline"
                        >
                          {user.role_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.perfil_estado ? "outline" : "destructive"}
                          className={user.perfil_estado ? "bg-green-50 text-green-700" : ""}
                        >
                          {user.perfil_estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>
                        {user?.last_sign_in_at ? new Date(user?.last_sign_in_at).toLocaleDateString() : "Nunca"}
                      </TableCell> */}
                      <TableCell>
                        {new Date(user.user_created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuPortal>

                            <DropdownMenuContent>
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Link href={`/admin/usuarios/${user.perfil_id}`} className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                                {/* <Can
                                  perform="edit:users"
                                  children={<DropdownMenuItem >

                                  </DropdownMenuItem>}
                                  roles={["admin", "superadmin", "taller"]}
                                /> */}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.perfil_id,
                                true//user.perfil_estado
                              )}>
                                {user.perfil_estado ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              {/* <Can perform="edit:users" roles={["admin", "superadmin", "taller"]}>

                              </Can> */}
                              <DropdownMenuItem onClick={() => handleSendPasswordReset(user?.perfil_correo)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Restablecer contraseña
                              </DropdownMenuItem>
                              {/* <Can perform="edit:users" roles={["admin", "superadmin", "taller"]}>
                              </Can> */}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setUserToDelete(user)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                              {/* <Can perform="delete:users" roles={["superadmin"]}>
                              </Can> */}
                            </DropdownMenuContent>
                          </DropdownMenuPortal>

                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Diálogo para crear usuario */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Ingrese los datos del nuevo usuario. Se enviará un correo de confirmación.
            </DialogDescription>
          </DialogHeader>
          <RegisterForm
          //isAdmin={true}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userToDelete && (
              <div className="space-y-2">
                <p>
                  <strong>Usuario:</strong> {userToDelete.perfil_nombre} {userToDelete.perfil_apellido}
                </p>
                <p>
                  <strong>Email:</strong> {userToDelete.perfil_correo}
                </p>
                <p>
                  <strong>Rol:</strong> {userToDelete.role_name}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
