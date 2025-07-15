"use client"  
  
import { useState, useEffect } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Switch } from "@/components/ui/switch"  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"  
import { Badge } from "@/components/ui/badge"  
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Plus, Search, Edit, Shield, Users, UserCheck, UserX, Settings } from "lucide-react"  
import { toast } from "@/components/ui/use-toast"  
import TECNICO_SERVICES, { TecnicoConDetallesType } from "@/services/TECNICO_SERVICES.SERVICE"  
  
interface PermisoType {  
  id: string  
  nombre: string  
  descripcion: string  
  categoria: string  
  activo: boolean  
}  
  
interface EmpleadoPermisoType {  
  empleado_id: string  
  empleado_nombre: string  
  empleado_email: string  
  empleado_cargo: string  
  permisos: PermisoType[]  
  activo: boolean  
  fecha_asignacion: string  
}  
  
export function EmpleadosPermisos() {  
  const [empleados, setEmpleados] = useState<TecnicoConDetallesType[]>([])  
  const [empleadosPermisos, setEmpleadosPermisos] = useState<EmpleadoPermisoType[]>([])  
  const [permisosDisponibles, setPermisosDisponibles] = useState<PermisoType[]>([])  
  const [loading, setLoading] = useState(true)  
  const [searchTerm, setSearchTerm] = useState("")  
  const [isDialogOpen, setIsDialogOpen] = useState(false)  
  const [isPermisosDialogOpen, setIsPermisosDialogOpen] = useState(false)  
  const [selectedEmpleado, setSelectedEmpleado] = useState<TecnicoConDetallesType | null>(null)  
  const [selectedPermisos, setSelectedPermisos] = useState<string[]>([])  
  
  // Permisos predefinidos del sistema  
  const permisosBase: PermisoType[] = [  
    {  
      id: "ordenes_read",  
      nombre: "Ver Órdenes",  
      descripcion: "Permite visualizar órdenes de trabajo",  
      categoria: "ordenes",  
      activo: true  
    },  
    {  
      id: "ordenes_write",  
      nombre: "Crear/Editar Órdenes",  
      descripcion: "Permite crear y modificar órdenes de trabajo",  
      categoria: "ordenes",  
      activo: true  
    },  
    {  
      id: "ordenes_delete",  
      nombre: "Eliminar Órdenes",  
      descripcion: "Permite eliminar órdenes de trabajo",  
      categoria: "ordenes",  
      activo: true  
    },  
    {  
      id: "vehiculos_read",  
      nombre: "Ver Vehículos",  
      descripcion: "Permite visualizar información de vehículos",  
      categoria: "vehiculos",  
      activo: true  
    },  
    {  
      id: "vehiculos_write",  
      nombre: "Gestionar Vehículos",  
      descripcion: "Permite crear y modificar vehículos",  
      categoria: "vehiculos",  
      activo: true  
    },  
    {  
      id: "clientes_read",  
      nombre: "Ver Clientes",  
      descripcion: "Permite visualizar información de clientes",  
      categoria: "clientes",  
      activo: true  
    },  
    {  
      id: "clientes_write",  
      nombre: "Gestionar Clientes",  
      descripcion: "Permite crear y modificar clientes",  
      categoria: "clientes",  
      activo: true  
    },  
    {  
      id: "inventario_read",  
      nombre: "Ver Inventario",  
      descripcion: "Permite visualizar el inventario",  
      categoria: "inventario",  
      activo: true  
    },  
    {  
      id: "inventario_write",  
      nombre: "Gestionar Inventario",  
      descripcion: "Permite modificar el inventario",  
      categoria: "inventario",  
      activo: true  
    },  
    {  
      id: "reportes_read",  
      nombre: "Ver Reportes",  
      descripcion: "Permite acceder a reportes del sistema",  
      categoria: "reportes",  
      activo: true  
    },  
    {  
      id: "configuracion_write",  
      nombre: "Configurar Sistema",  
      descripcion: "Permite modificar configuraciones del sistema",  
      categoria: "configuracion",  
      activo: true  
    },  
    {  
      id: "facturas_read",  
      nombre: "Ver Facturas",  
      descripcion: "Permite visualizar facturas",  
      categoria: "facturas",  
      activo: true  
    },  
    {  
      id: "facturas_write",  
      nombre: "Gestionar Facturas",  
      descripcion: "Permite crear y modificar facturas",  
      categoria: "facturas",  
      activo: true  
    }  
  ]  
  
  useEffect(() => {  
    loadEmpleados()  
    setPermisosDisponibles(permisosBase)  
  }, [])  
  
  const loadEmpleados = async () => {  
    try {  
      setLoading(true)  
      const data = await TECNICO_SERVICES.GET_ALL_DETALLE_TECNICOS()  
      setEmpleados(data)  
        
      // Simular carga de permisos existentes  
      const empleadosConPermisos: EmpleadoPermisoType[] = data.map(empleado => ({  
        empleado_id: empleado.id.toString(),  
        empleado_nombre: `${empleado.nombre} ${empleado.apellido}`,  
        empleado_email: empleado.email,  
        empleado_cargo: empleado.cargo,  
        permisos: permisosBase.slice(0, Math.floor(Math.random() * 5) + 2), // Permisos aleatorios para demo  
        activo: empleado.disponible,  
        fecha_asignacion: new Date().toISOString().split('T')[0]  
      }))  
        
      setEmpleadosPermisos(empleadosConPermisos)  
    } catch (error) {  
      toast({  
        title: "Error",  
        description: "No se pudieron cargar los empleados",  
        variant: "destructive"  
      })  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const openPermisosDialog = (empleado: TecnicoConDetallesType) => {  
    setSelectedEmpleado(empleado)  
    const empleadoPermisos = empleadosPermisos.find(ep => ep.empleado_id === empleado.id.toString())  
    setSelectedPermisos(empleadoPermisos?.permisos.map(p => p.id) || [])  
    setIsPermisosDialogOpen(true)  
  }  
  
  const handleSavePermisos = () => {  
    if (!selectedEmpleado) return  
  
    const permisosAsignados = permisosDisponibles.filter(p => selectedPermisos.includes(p.id))  
      
    setEmpleadosPermisos(prev => {  
      const updated = prev.map(ep => {  
        if (ep.empleado_id === selectedEmpleado.id.toString()) {  
          return {  
            ...ep,  
            permisos: permisosAsignados,  
            fecha_asignacion: new Date().toISOString().split('T')[0]  
          }  
        }  
        return ep  
      })  
        
      // Si no existe, crear nuevo registro  
      if (!updated.find(ep => ep.empleado_id === selectedEmpleado.id.toString())) {  
        updated.push({  
          empleado_id: selectedEmpleado.id.toString(),  
          empleado_nombre: `${selectedEmpleado.nombre} ${selectedEmpleado.apellido}`,  
          empleado_email: selectedEmpleado.email,  
          empleado_cargo: selectedEmpleado.cargo,  
          permisos: permisosAsignados,  
          activo: true,  
          fecha_asignacion: new Date().toISOString().split('T')[0]  
        })  
      }  
        
      return updated  
    })  
  
    toast({  
      title: "Permisos actualizados",  
      description: `Permisos de ${selectedEmpleado.nombre} actualizados correctamente`  
    })  
  
    setIsPermisosDialogOpen(false)  
    setSelectedEmpleado(null)  
    setSelectedPermisos([])  
  }  
  
  const togglePermiso = (permisoId: string) => {  
    setSelectedPermisos(prev => {  
      if (prev.includes(permisoId)) {  
        return prev.filter(id => id !== permisoId)  
      } else {  
        return [...prev, permisoId]  
      }  
    })  
  }  
  
  const getCategoriaColor = (categoria: string) => {  
    const colors = {  
      ordenes: "bg-blue-100 text-blue-800",  
      vehiculos: "bg-green-100 text-green-800",  
      clientes: "bg-purple-100 text-purple-800",  
      inventario: "bg-yellow-100 text-yellow-800",  
      reportes: "bg-orange-100 text-orange-800",  
      configuracion: "bg-red-100 text-red-800",  
      facturas: "bg-indigo-100 text-indigo-800"  
    }  
    return colors[categoria as keyof typeof colors] || "bg-gray-100 text-gray-800"  
  }  
  
  const filteredEmpleados = empleados.filter(empleado =>  
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase())  
  )  
  
  const permisosGrouped = permisosDisponibles.reduce((acc, permiso) => {  
    if (!acc[permiso.categoria]) {  
      acc[permiso.categoria] = []  
    }  
    acc[permiso.categoria].push(permiso)  
    return acc  
  }, {} as Record<string, PermisoType[]>)  
  
  return (  
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">  
            <Shield className="h-8 w-8" />  
            Gestión de Permisos de Empleados  
          </h1>  
          <p className="text-muted-foreground">  
            Administra los permisos y accesos de los empleados del taller  
          </p>  
        </div>  
        <Button onClick={() => setIsDialogOpen(true)}>  
          <Settings className="mr-2 h-4 w-4" />  
          Configurar Permisos  
        </Button>  
      </div>  
  
      <div className="flex items-center space-x-2">  
        <Search className="h-4 w-4" />  
        <Input  
          placeholder="Buscar empleados..."  
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}  
          className="max-w-sm"  
        />  
      </div>  
  
      <Tabs defaultValue="empleados" className="space-y-4">  
        <TabsList>  
          <TabsTrigger value="empleados">Empleados</TabsTrigger>  
          <TabsTrigger value="permisos">Permisos Disponibles</TabsTrigger>  
          <TabsTrigger value="resumen">Resumen</TabsTrigger>  
        </TabsList>  
  
        <TabsContent value="empleados" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Lista de Empleados</CardTitle>  
              <CardDescription>  
                {filteredEmpleados.length} empleado(s) encontrado(s)  
              </CardDescription>  
            </CardHeader>  
            <CardContent>  
              <Table>  
                <TableHeader>  
                  <TableRow>  
                    <TableHead>Empleado</TableHead>  
                    <TableHead>Cargo</TableHead>  
                    <TableHead>Email</TableHead>  
                    <TableHead>Permisos Asignados</TableHead>  
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
                  ) : filteredEmpleados.length === 0 ? (  
                    <TableRow>  
                      <TableCell colSpan={6} className="text-center">  
                        No se encontraron empleados  
                      </TableCell>  
                    </TableRow>  
                  ) : (  
                    filteredEmpleados.map((empleado) => {  
                      const empleadoPermisos = empleadosPermisos.find(ep => ep.empleado_id === empleado.id.toString())  
                      return (  
                        <TableRow key={empleado.id}>  
                          <TableCell className="font-medium">  
                            {empleado.nombre} {empleado.apellido}  
                          </TableCell>  
                          <TableCell>{empleado.cargo}</TableCell>  
                          <TableCell>{empleado.email}</TableCell>  
                          <TableCell>  
                            <div className="flex flex-wrap gap-1">  
                              {empleadoPermisos?.permisos.slice(0, 3).map((permiso) => (  
                                <Badge key={permiso.id} variant="outline" className="text-xs">  
                                  {permiso.nombre}  
                                </Badge>  
                              ))}  
                              {empleadoPermisos && empleadoPermisos.permisos.length > 3 && (  
                                <Badge variant="outline" className="text-xs">  
                                  +{empleadoPermisos.permisos.length - 3}  
                                </Badge>  
                              )}  
                              {!empleadoPermisos?.permisos.length && (  
                                <span className="text-sm text-muted-foreground">Sin permisos</span>  
                              )}  
                            </div>  
                                                      </TableCell>  
                          <TableCell>  
                            <Badge variant={empleadoPermisos?.activo ? "default" : "secondary"}>  
                              {empleadoPermisos?.activo ? "Activo" : "Inactivo"}  
                            </Badge>  
                          </TableCell>  
                          <TableCell>  
                            <div className="flex items-center gap-2">  
                              <Button  
                                variant="outline"  
                                size="sm"  
                                onClick={() => openPermisosDialog(empleado)}  
                              >  
                                <Edit className="h-4 w-4" />  
                                Permisos  
                              </Button>  
                            </div>  
                          </TableCell>  
                        </TableRow>  
                      )  
                    })  
                  )}  
                </TableBody>  
              </Table>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="permisos" className="space-y-4">  
          <Card>  
            <CardHeader>  
              <CardTitle>Permisos Disponibles</CardTitle>  
              <CardDescription>  
                Configuración de permisos del sistema  
              </CardDescription>  
            </CardHeader>  
            <CardContent>  
              <div className="space-y-6">  
                {Object.entries(permisosGrouped).map(([categoria, permisos]) => (  
                  <div key={categoria} className="space-y-3">  
                    <h3 className="text-lg font-semibold capitalize flex items-center gap-2">  
                      <Badge className={getCategoriaColor(categoria)}>  
                        {categoria}  
                      </Badge>  
                    </h3>  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">  
                      {permisos.map((permiso) => (  
                        <Card key={permiso.id} className="p-4">  
                          <div className="flex items-start justify-between">  
                            <div>  
                              <h4 className="font-medium">{permiso.nombre}</h4>  
                              <p className="text-sm text-muted-foreground">  
                                {permiso.descripcion}  
                              </p>  
                            </div>  
                            <Badge variant={permiso.activo ? "default" : "secondary"}>  
                              {permiso.activo ? "Activo" : "Inactivo"}  
                            </Badge>  
                          </div>  
                        </Card>  
                      ))}  
                    </div>  
                  </div>  
                ))}  
              </div>  
            </CardContent>  
          </Card>  
        </TabsContent>  
  
        <TabsContent value="resumen" className="space-y-4">  
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">  
            <Card>  
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
                <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>  
                <Users className="h-4 w-4 text-muted-foreground" />  
              </CardHeader>  
              <CardContent>  
                <div className="text-2xl font-bold">{empleados.length}</div>  
                <p className="text-xs text-muted-foreground">  
                  Empleados registrados  
                </p>  
              </CardContent>  
            </Card>  
            <Card>  
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
                <CardTitle className="text-sm font-medium">Con Permisos</CardTitle>  
                <UserCheck className="h-4 w-4 text-muted-foreground" />  
              </CardHeader>  
              <CardContent>  
                <div className="text-2xl font-bold">  
                  {empleadosPermisos.filter(ep => ep.permisos.length > 0).length}  
                </div>  
                <p className="text-xs text-muted-foreground">  
                  Empleados con permisos asignados  
                </p>  
              </CardContent>  
            </Card>  
            <Card>  
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
                <CardTitle className="text-sm font-medium">Sin Permisos</CardTitle>  
                <UserX className="h-4 w-4 text-muted-foreground" />  
              </CardHeader>  
              <CardContent>  
                <div className="text-2xl font-bold">  
                  {empleados.length - empleadosPermisos.filter(ep => ep.permisos.length > 0).length}  
                </div>  
                <p className="text-xs text-muted-foreground">  
                  Empleados sin permisos  
                </p>  
              </CardContent>  
            </Card>  
            <Card>  
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  
                <CardTitle className="text-sm font-medium">Permisos Totales</CardTitle>  
                <Shield className="h-4 w-4 text-muted-foreground" />  
              </CardHeader>  
              <CardContent>  
                <div className="text-2xl font-bold">{permisosDisponibles.length}</div>  
                <p className="text-xs text-muted-foreground">  
                  Permisos disponibles  
                </p>  
              </CardContent>  
            </Card>  
          </div>  
        </TabsContent>  
      </Tabs>  
  
      {/* Dialog para asignar permisos */}  
      <Dialog open={isPermisosDialogOpen} onOpenChange={setIsPermisosDialogOpen}>  
        <DialogContent className="max-w-4xl">  
          <DialogHeader>  
            <DialogTitle>  
              Asignar Permisos - {selectedEmpleado?.nombre} {selectedEmpleado?.apellido}  
            </DialogTitle>  
            <DialogDescription>  
              Seleccione los permisos que desea asignar a este empleado  
            </DialogDescription>  
          </DialogHeader>  
          <div className="space-y-6 max-h-96 overflow-y-auto">  
            {Object.entries(permisosGrouped).map(([categoria, permisos]) => (  
              <div key={categoria} className="space-y-3">  
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">  
                  <Badge className={getCategoriaColor(categoria)}>  
                    {categoria}  
                  </Badge>  
                </h3>  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">  
                  {permisos.map((permiso) => (  
                    <div key={permiso.id} className="flex items-center space-x-2 p-3 border rounded-lg">  
                      <input  
                        type="checkbox"  
                        id={`permiso-${permiso.id}`}  
                        checked={selectedPermisos.includes(permiso.id)}  
                        onChange={() => togglePermiso(permiso.id)}  
                        className="rounded"  
                      />  
                      <div className="flex-1">  
                        <Label htmlFor={`permiso-${permiso.id}`} className="font-medium">  
                          {permiso.nombre}  
                        </Label>  
                        <p className="text-sm text-muted-foreground">  
                          {permiso.descripcion}  
                        </p>  
                      </div>  
                    </div>  
                  ))}  
                </div>  
              </div>  
            ))}  
          </div>  
          <DialogFooter>  
            <Button variant="outline" onClick={() => setIsPermisosDialogOpen(false)}>  
              Cancelar  
            </Button>  
            <Button onClick={handleSavePermisos}>  
              Guardar Permisos  
            </Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog>  
    </div>  
  )  
}