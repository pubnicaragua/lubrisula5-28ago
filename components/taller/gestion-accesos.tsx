"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"  
import { Badge } from "@/components/ui/badge"  
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { Plus, Search, Edit, Trash2, UserCog, Shield } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
  
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
  const [accesos, setAccesos] = useState<AccesoType[]>([])  
  const [loading, setLoading] = useState(true)  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  const [isEditing, setIsEditing] = useState(false)  
  const [selectedAcceso, setSelectedAcceso] = useState<AccesoType | null>(null)  
  
  const [formData, setFormData] = useState<AccesoType>({  
    usuario_id: "",  
    nombre_usuario: "",  
    email: "",  
    rol: "tecnico",  
    permisos: [],  
    activo: true,  
    fecha_creacion: ""  
  })  
  
  const roles = [  
    { value: "admin", label: "Administrador" },  
    { value: "tecnico", label: "Técnico" },  
    { value: "recepcionista", label: "Recepcionista" },  
    { value: "cliente", label: "Cliente" },  
    { value: "aseguradora", label: "Aseguradora" }  
  ]  
  
  const permisos = [  
    { value: "ordenes_read", label: "Ver Órdenes" },  
    { value: "ordenes_write", label: "Crear/Editar Órdenes" },  
    { value: "vehiculos_read", label: "Ver Vehículos" },  
    { value: "vehiculos_write", label: "Crear/Editar Vehículos" },  
    { value: "clientes_read", label: "Ver Clientes" },  
    { value: "clientes_write", label: "Crear/Editar Clientes" },  
    { value: "inventario_read", label: "Ver Inventario" },  
    { value: "inventario_write", label: "Gestionar Inventario" },  
    { value: "reportes_read", label: "Ver Reportes" },  
    { value: "configuracion_write", label: "Configurar Sistema" }  
  ]  
  
  useEffect(() => {  
    loadAccesos()  
  }, [])  
  
  const loadAccesos = async () => {  
    try {  
      setLoading(true)  
      // Aquí cargarías los accesos desde tu servicio  
      // const data = await ACCESOS_SERVICES.GET_ALL_ACCESOS()  
      // setAccesos(data)  
        
      // Datos de ejemplo  
      setAccesos([  
        {  
          id: "1",  
          usuario_id: "user1",  
          nombre_usuario: "Juan Pérez",  
          email: "juan@taller.com",  
          rol: "tecnico",  
          permisos: ["ordenes_read", "ordenes_write", "vehiculos_read"],  
          activo: true,  
          fecha_creacion: "2024-01-15"  
        }  
      ])  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los accesos",  
        variant: "destructive"  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault()  
      
    if (!formData.nombre_usuario || !formData.email || !formData.rol) {  
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
      loadAccesos()  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudo guardar el acceso",  
        variant: "destructive"  
      })  
    }  
  }  
  
  const resetForm = () => {  
    setFormData({  
      usuario_id: "",  
      nombre_usuario: "",  
      email: "",  
      rol: "tecnico",  
      permisos: [],  
      activo: true,  
      fecha_creacion: ""  
    })  
    setSelectedAcceso(null)  
    setIsEditing(false)  
  }  
  
  const openEditDialog = (acceso: AccesoType) => {  
    setFormData(acceso)  
    setSelectedAcceso(acceso)  
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
    acceso.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    acceso.email.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    acceso.rol.toLowerCase().includes(searchTerm.toLowerCase())  
  )  
  
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
          <DialogContent className="max-w-2xl">  
            <DialogHeader>  
              <DialogTitle>  
                {isEditing ? "Editar Acceso" : "Nuevo Acceso"}  
              </DialogTitle>  
              <DialogDescription>  
                {isEditing ? "Modifique los permisos del usuario" : "Configure el acceso para un nuevo usuario"}  
              </DialogDescription>  
            </DialogHeader>  
            <form onSubmit={handleSubmit} className="space-y-4">  
              <div className="grid grid-cols-2 gap-4">  
                <div className="space-y-2">  
                  <Label htmlFor="nombre_usuario">Nombre Usuario</Label>  
                  <Input  
                    id="nombre_usuario"  
                    value={formData.nombre_usuario}  
                    onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}  
                    required  
                  />  
                </div>  
                <div className="space-y-2">  
                  <Label htmlFor="email">Email</Label>  
                  <Input  
                    id="email"  
                    type="email"  
                    value={formData.email}  
                    onChange={(e) => setFormData({...formData, email: e.target.value})}  
                    required  
                  />  
                </div>  
              </div>  
  
              <div className="space-y-2">  
                <Label htmlFor="rol">Rol</Label>  
                <Select value={formData.rol} onValueChange={(value) => setFormData({...formData, rol: value})}>  
                  <SelectTrigger>  
                    <SelectValue />  
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
                <Label>Permisos</Label>  
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">  
                  {permisos.map((permiso) => (  
                    <div key={permiso.value} className="flex items-center space-x-2">  
                      <input  
                        type="checkbox"  
                        id={permiso.value}  
                        checked={formData.permisos.includes(permiso.value)}  
                        onChange={(e) => {  
                          if (e.target.checked) {  
                            setFormData({...formData, permisos: [...formData.permisos, permiso.value]})  
                          } else {  
                            setFormData({...formData, permisos: formData.permisos.filter(p => p !== permiso.value)})  
                          }  
                        }}  
                        className="rounded"  
                      />  
                      <Label htmlFor={permiso.value} className="text-sm">  
                        {permiso.label}  
                      </Label>  
                    </div>  
                  ))}  
                </div>  
              </div>  
  
              <DialogFooter>  
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>  
                  Cancelar  
                </Button>  
                <Button type="submit">  
                  {isEditing ? "Actualizar" : "Crear"}  
                </Button>  
              </DialogFooter>  
            </form>  
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
                <TableHead>Rol</TableHead>  
                <TableHead>Permisos</TableHead>  
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
                      {acceso.nombre_usuario}  
                    </TableCell>  
                    <TableCell>{acceso.email}</TableCell>  
                    <TableCell>  
                      {getRolBadge(acceso.rol)}  
                    </TableCell>  
                    <TableCell>  
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
                    </TableCell>  
                    <TableCell>  
                      <Badge variant={acceso.activo ? "default" : "secondary"}>  
                        {acceso.activo ? "Activo" : "Inactivo"}  
                      </Badge>  
                    </TableCell>  
                    <TableCell>  
                      <div className="flex items-center gap-2">  
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
                      </div>  
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