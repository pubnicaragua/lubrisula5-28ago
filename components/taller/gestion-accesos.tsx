"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, UserCog } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import USER_SERVICE, { UsuarioTallerType } from "@/services/USER_SERVICES.SERVICE"
import { Switch } from "../ui/switch"
import RegisterForm from "../auth/register-form"
import { useAuth } from "@/lib/supabase/auth"
interface AccesoType {
  id?: string
  usuario_id: string
  nombre_usuario: string
  email: string
  rol: string
  permisos: string[]
  activo: boolean
  fecha_creacion: string
}
export default function GestionAccesos() {
  const [accesos, setAccesos] = useState<UsuarioTallerType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAcceso, setSelectedAcceso] = useState<AccesoType | null>(null)
  const { user } = useAuth()
  const [formData, setFormData] = useState<UsuarioTallerType>({
    id: "",
    nombre: "",
    correo: "",
    // rol: "tecnico",
    // permisos: [],
    estado: true,
    telefono: "",
    taller_name: "",
    apellido: "",
    taller_id: "",
    acceso: true
    // fecha_creacion: ""
  })

  // const roles = [
  //   { value: "admin", label: "Administrador" },
  //   { value: "tecnico", label: "Técnico" },
  //   { value: "recepcionista", label: "Recepcionista" },
  //   { value: "cliente", label: "Cliente" },
  //   { value: "aseguradora", label: "Aseguradora" }
  // ]

  // const permisos = [
  //   { value: "ordenes_read", label: "Ver Órdenes" },
  //   { value: "ordenes_write", label: "Crear/Editar Órdenes" },
  //   { value: "vehiculos_read", label: "Ver Vehículos" },
  //   { value: "vehiculos_write", label: "Crear/Editar Vehículos" },
  //   { value: "clientes_read", label: "Ver Clientes" },
  //   { value: "clientes_write", label: "Crear/Editar Clientes" },
  //   { value: "inventario_read", label: "Ver Inventario" },
  //   { value: "inventario_write", label: "Gestionar Inventario" },
  //   { value: "reportes_read", label: "Ver Reportes" },
  //   { value: "configuracion_write", label: "Configurar Sistema" }
  // ]


  console.log("user", user)
  const FN_GET_USUARIOS = async () => {
    setLoading(true)
    const tallerId = localStorage.getItem("taller_id");
    const res = await USER_SERVICE.GET_USUARIOS_BY_TALLER_ID(tallerId)
    console.log(res)
    setAccesos(res)
    setLoading(false)
  }

  const FN_UPDATE_ACCESO = async (userId: string, acceso: boolean) => {
    setLoading(true)
    await USER_SERVICE.UPDATE_ACCESO_USER_TALLER(userId, acceso);
    await FN_GET_USUARIOS()
    setLoading(false)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.correo) {
      toast({
        title: "Error",
        description: "Complete todos los campos obligatorios",
        variant: "destructive"
      })
      return
    }

    try {
      if (isEditing && selectedAcceso) {
        // await ACCESOS_SERVICES.UPDATE_ACCESO({ ...formData, id: selectedAcceso.id })  
        toast({
          title: "Éxito",
          description: "Acceso actualizado correctamente"
        })
      } else {
        // await ACCESOS_SERVICES.INSERT_ACCESO(formData)  
        toast({
          title: "Éxito",
          description: "Acceso creado correctamente"
        })
      }
      setIsDialogOpen(false)
      resetForm()
      FN_GET_USUARIOS()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el acceso",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    // setFormData({
    //   usuario_id: "",
    //   nombre_usuario: "",
    //   email: "",
    //   rol: "tecnico",
    //   permisos: [],
    //   activo: true,
    //   fecha_creacion: ""
    // })
    setSelectedAcceso(null)
    setIsEditing(false)
  }

  const openEditDialog = (acceso: UsuarioTallerType) => {
    setFormData(acceso)
    // setSelectedAcceso(acceso)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const getRolBadge = (rol: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: "destructive",
      tecnico: "default",
      recepcionista: "secondary",
      cliente: "outline",
      aseguradora: "outline"
    }
    return <Badge variant={variants[rol] || "outline"}>{rol}</Badge>
  }

  const filteredAccesos = accesos.filter(acceso =>
    acceso?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acceso?.correo?.toLowerCase().includes(searchTerm.toLowerCase())
    // acceso.rol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    FN_GET_USUARIOS()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserCog className="h-8 w-8" />
            Gestión de Accesos
          </h1>
          <p className="text-muted-foreground">
            Administra los accesos y permisos de usuarios del taller
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Acceso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl overflow-auto h-[100vh]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Acceso" : "Nuevo Acceso"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifique los permisos del usuario" : "Configure el acceso para un nuevo usuario"}
              </DialogDescription>
            </DialogHeader>
            <RegisterForm onSuccess={() => { FN_GET_USUARIOS(); setIsDialogOpen(false) }} registerUserTaller={true} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios con Acceso</CardTitle>
          <CardDescription>
            {filteredAccesos.length} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Rol</TableHead>
                {/* <TableHead>Permisos</TableHead> */}
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : filteredAccesos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccesos.map((acceso) => (
                  <TableRow key={acceso.id}>
                    <TableCell className="font-medium">
                      <b className="text-blue-500">
                        {user?.id === acceso?.id ? "ME_USER - " : ""}
                      </b>  {acceso.nombre} {acceso.apellido}
                    </TableCell>
                    <TableCell>{acceso.correo}</TableCell>
                    <TableCell>{acceso.created_at}</TableCell>
                    <TableCell>{acceso.telefono}</TableCell>
                    <TableCell>
                      {/* {getRolBadge(acceso.rol)} */}
                      .....
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {acceso.permisos.slice(0, 2).map((permiso) => (
                          <Badge key={permiso} variant="outline" className="text-xs">
                            {permiso.replace('_', ' ')}
                          </Badge>
                        ))}
                        {acceso.permisos.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{acceso.permisos.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={acceso.estado ? "default" : "secondary"}>
                        {acceso.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch id="activo" defaultChecked
                        checked={acceso.acceso}
                        onCheckedChange={(check) => FN_UPDATE_ACCESO(acceso.id, check)}
                      />
                      {/* <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(acceso)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // handleDelete(acceso.id!)  
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div> */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}