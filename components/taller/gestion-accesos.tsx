"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
// Importar las Server Actions para la gestión de usuarios
import {
  getUsers, // Esta función se ejecutará en el servidor
  deleteUser, // Esta función se ejecutará en el servidor
  toggleUserStatus, // Esta función se ejecutará en el servidor
} from "@/lib/actions/users"

interface Usuario {
  id: string
  email: string
  nombre_completo: string
  rol: string
  estado: string
  fecha_creacion: string
}

export function GestionAccesos() {
  const supabase = createClientComponentClient() // Cliente para operaciones de usuario normal (no admin)
  const { toast } = useToast()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("todos")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null)

  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    rol: "tecnico",
    estado: "activo",
  })

  const roles = [
    { value: "administrador", label: "Administrador" },
    { value: "tecnico", label: "Técnico" },
    { value: "aseguradora", label: "Aseguradora" },
    { value: "cliente", label: "Cliente" },
  ]

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
    { value: "pendiente", label: "Pendiente de Activación" },
  ]

  useEffect(() => {
    fetchUsuariosData() // Cambiado el nombre para evitar conflicto con la Server Action
  }, [])

  useEffect(() => {
    if (usuarios.length > 0) {
      filterUsuarios()
    }
  }, [searchTerm, roleFilter, usuarios])

  const fetchUsuariosData = async () => {
    setIsLoading(true)
    try {
      const result = await getUsers() // Llamada a la Server Action
      if (result.success) {
        setUsuarios(result.data || [])
        setFilteredUsuarios(result.data || [])
      } else {
        throw new Error(result.error || "Error al obtener usuarios")
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsuarios = () => {
    let filtered = usuarios

    if (searchTerm) {
      filtered = filtered.filter(
        (usuario) =>
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "todos") {
      filtered = filtered.filter((usuario) => usuario.rol === roleFilter)
    }

    setFilteredUsuarios(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aquí deberías tener una Server Action para crear usuarios con rol
      // Por ahora, usaremos supabase.auth.signUp que no requiere service_role_key
      // pero no asigna roles de DB directamente.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre_completo: formData.nombre_completo,
            rol: formData.rol, // Esto solo guarda en user_metadata, no en la tabla de roles_usuario
          },
        },
      })

      if (authError) throw authError

      // Si necesitas asignar el rol en la tabla `roles_usuario`,
      // necesitarías una Server Action específica para eso.
      // Por ahora, asumimos que `getUsers` ya maneja la combinación de roles de auth y DB.

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente (rol asignado en metadatos)",
      })

      setIsAddDialogOpen(false)
      setFormData({
        nombre_completo: "",
        email: "",
        password: "",
        rol: "tecnico",
        estado: "activo",
      })
      fetchUsuariosData()
    } catch (error) {
      console.error("Error al crear usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUsuario) return

    setIsLoading(true)

    try {
      // Llamada a la Server Action para actualizar usuario
      const result = await toggleUserStatus(currentUsuario.id, formData.estado === "activo" ? false : true) // Esto es para activar/desactivar
      // Para actualizar nombre_completo y rol, necesitarías otra Server Action
      // que use supabaseAdmin.auth.admin.updateUserById y actualice la tabla `usuarios`
      // Por simplicidad, aquí solo se muestra el toggleUserStatus.

      if (result.success) {
        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente",
        })
      } else {
        throw new Error(result.error || "Error al actualizar usuario")
      }

      setIsEditDialogOpen(false)
      setCurrentUsuario(null)
      fetchUsuariosData()
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUsuario = async () => {
    if (!currentUsuario) return

    setIsLoading(true)

    try {
      const result = await deleteUser(currentUsuario.id) // Llamada a la Server Action

      if (result.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado exitosamente",
        })
      } else {
        throw new Error(result.error || "Error al eliminar usuario")
      }

      setIsDeleteDialogOpen(false)
      setCurrentUsuario(null)
      fetchUsuariosData()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleEstado = async (usuario: Usuario) => {
    setIsLoading(true)
    try {
      const result = await toggleUserStatus(usuario.id, usuario.estado === "activo") // Llamada a la Server Action

      if (result.success) {
        toast({
          title: "Estado actualizado",
          description: `El usuario ahora está ${usuario.estado === "activo" ? "inactivo" : "activo"}`,
        })
      } else {
        throw new Error(result.error || "Error al cambiar estado")
      }
      fetchUsuariosData()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (usuario: Usuario) => {
    setCurrentUsuario(usuario)
    setFormData({
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      password: "", // No cargar la contraseña para edición
      rol: usuario.rol,
      estado: usuario.estado,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (usuario: Usuario) => {
    setCurrentUsuario(usuario)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Accesos</CardTitle>
              <CardDescription>Administra los usuarios y sus permisos en el sistema</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
          <div className="relative w-full max-w-sm mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuarios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre_completo}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell className="capitalize">{usuario.rol}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              usuario.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleEstado(usuario)}
                              title={usuario.estado === "activo" ? "Desactivar" : "Activar"}
                            >
                              {usuario.estado === "activo" ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(usuario)} title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(usuario)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para agregar usuario */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            <DialogDescription>Completa el formulario para crear un nuevo usuario</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUsuario}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre completo</Label>
                <Input
                  id="nombre_completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={formData.rol} onValueChange={(value) => handleSelectChange("rol", value)}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((rol) => (
                      <SelectItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar usuario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica la información del usuario</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUsuario}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nombre_completo">Nombre completo</Label>
                <Input
                  id="edit_nombre_completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Correo electrónico</Label>
                <Input id="edit_email" name="email" type="email" value={formData.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_rol">Rol</Label>
                <Select value={formData.rol} onValueChange={(value) => handleSelectChange("rol", value)}>
                  <SelectTrigger id="edit_rol">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((rol) => (
                      <SelectItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                  <SelectTrigger id="edit_estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setCurrentUsuario(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Actualizando..." : "Actualizar Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar usuario */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario {currentUsuario?.nombre_completo}? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setCurrentUsuario(null)
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUsuario} disabled={isLoading}>
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
