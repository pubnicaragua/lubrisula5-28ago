"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, Edit, Trash2, Clock, User, Car } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevaOrdenForm } from "./nueva-orden-form"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ORDENES_TRABAJO_SERVICES, { OrdenTrabajoType } from "@/services/ORDENES.SERVICE"

export function OrdenesPage() {
  const [State_OrdenesTrabajo, SetState_OrdenesTrabajo] = useState<OrdenTrabajoType[]>([])
  const [open, setOpen] = useState(false)
  const [editingOrden, setEditingOrden] = useState<OrdenTrabajoType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ordenToDelete, setOrdenToDelete] = useState<OrdenTrabajoType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const FN_GET_ALL_ORDENES_TRABAJO = async () => {
    const data = await ORDENES_TRABAJO_SERVICES.GET_ALL_ORDENES();
    console.log(data)
    SetState_OrdenesTrabajo(data)

  }

  const generateOrderNumber = () => {
    const year = new Date().getFullYear()
    const orderCount = State_OrdenesTrabajo.length + 1
    return `ORD-${year}-${orderCount.toString().padStart(3, "0")}`
  }

  const FN_ADD_NEW_ORDEN = async (nuevaOrden: OrdenTrabajoType) => {
    await FN_GET_ALL_ORDENES_TRABAJO()
    setOpen(false)
    toast({
      title: "Orden creada",
      description: "La orden de trabajo ha sido creada exitosamente",
    })
  }

  const FN_UPDATE_ORDEN = async (orden: OrdenTrabajoType) => {
    await FN_GET_ALL_ORDENES_TRABAJO()
    setEditingOrden(null)
    setOpen(false)

    toast({
      title: "Orden actualizada",
      description: "Los datos de la orden han sido actualizados exitosamente",
    })
  }

  const FN_DELETE_ORDEN = async () => {
    if (!ordenToDelete) return
    await ORDENES_TRABAJO_SERVICES.DELETE_ORDEN(ordenToDelete.id)
    SetState_OrdenesTrabajo((prev) => prev.filter((o) => o.id !== ordenToDelete.id))
    setDeleteDialogOpen(false)
    setOrdenToDelete(null)

    toast({
      title: "Orden eliminada",
      description: "La orden ha sido eliminada exitosamente",
    })
  }

  const openEditDialog = (orden: OrdenTrabajoType) => {
    setEditingOrden(orden)
    setOpen(true)
  }

  const openDeleteDialog = (orden: OrdenTrabajoType) => {
    setOrdenToDelete(orden)
    setDeleteDialogOpen(true)
  }

  const filteredOrdenes = State_OrdenesTrabajo.filter(
    (orden) =>
      // orden.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.vehicle_marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado: string) => {
    const colors = {
      Pendiente: "bg-yellow-500 hover:bg-yellow-600",
      "En Proceso": "bg-blue-500 hover:bg-blue-600",
      Completada: "bg-green-500 hover:bg-green-600",
      Entregada: "bg-purple-500 hover:bg-purple-600",
      Cancelada: "bg-red-500 hover:bg-red-600",
    }
    return <Badge className={colors[estado]}>{estado}</Badge>
  }


  const getPrioridadBadge = (prioridad: OrdenTrabajoType["prioridad"]) => {
    const colors = {
      Baja: "bg-gray-500 hover:bg-gray-600",
      Normal: "bg-blue-500 hover:bg-blue-600",
      Alta: "bg-orange-500 hover:bg-orange-600",
      Urgente: "bg-red-500 hover:bg-red-600",
    }
    return (
      <Badge variant="outline" className={colors[prioridad]}>
        {prioridad}
      </Badge>
    )
  }


  useEffect(() => {
    FN_GET_ALL_ORDENES_TRABAJO()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header> */}
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Trabajo</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingOrden(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Orden
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{editingOrden ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"}</DialogTitle>
                  <DialogDescription>
                    {editingOrden
                      ? "Modifica la información de la orden de trabajo."
                      : "Crea una nueva orden de trabajo para un cliente."}
                  </DialogDescription>
                </DialogHeader>
                <NuevaOrdenForm
                  onSubmit={editingOrden ? FN_UPDATE_ORDEN : FN_ADD_NEW_ORDEN}
                  ordenExistente={editingOrden}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar órdenes por número, cliente, vehículo o descripción..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar órdenes</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar órdenes</span>
          </Button>
        </div>

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todas">Todas ({filteredOrdenes.length})</TabsTrigger>
            <TabsTrigger value="pendientes">
              Pendientes ({filteredOrdenes.filter((o) => o.estado === "Pendiente").length})
            </TabsTrigger>
            <TabsTrigger value="proceso">
              En Proceso ({filteredOrdenes.filter((o) => o.estado === "En Proceso").length})
            </TabsTrigger>
            <TabsTrigger value="completadas">
              Completadas ({filteredOrdenes.filter((o) => o.estado === "Completada").length})
            </TabsTrigger>
            <TabsTrigger value="entregadas">
              Entregadas ({filteredOrdenes.filter((o) => o.estado === "Completada").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Órdenes</CardTitle>
                <CardDescription>Mostrando {filteredOrdenes.length} órdenes registradas en el sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Técnico</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha Entrega</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrdenes.map((orden) => (
                      <TableRow key={orden.id}>
                        <TableCell className="font-medium">{orden.numero_orden}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{orden.client_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{orden.vehicle_marca} {orden.vehiculo_modelo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{orden.servicio_name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {orden.descripcion}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{orden.tecnico_name}</TableCell>
                        <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                        <TableCell>{getPrioridadBadge(orden.prioridad)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{orden.fecha_entrega}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" title="Ver detalles">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(orden)}
                              title="Editar orden"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(orden)}
                              title="Eliminar orden"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tabs filtradas por estado */}
          {["pendientes", "proceso", "completadas", "entregadas"].map((tab) => {
            const estadoMap = {
              pendientes: "Pendiente",
              proceso: "En Proceso",
              completadas: "Completada",
              entregadas: "Entregada",
            }
            const estado = estadoMap[tab as keyof typeof estadoMap] as OrdenTrabajoType["estado"]
            const ordenesFiltradas = filteredOrdenes.filter((o) => o.estado === estado)

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Órdenes {estado}s</CardTitle>
                    <CardDescription>
                      Mostrando {ordenesFiltradas.length} órdenes con estado {estado.toLowerCase()}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Vehículo</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Técnico</TableHead>
                          <TableHead>Prioridad</TableHead>
                          <TableHead>Fecha Entrega</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordenesFiltradas.map((orden) => (
                          <TableRow key={orden.id}>
                            <TableCell className="font-medium">{orden.numero_orden}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{orden.client_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{orden.vehicle_marca}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">...</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {orden.descripcion}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{orden.tecnico_name}</TableCell>
                            <TableCell>{getPrioridadBadge(orden.prioridad)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{orden.fecha_entrega}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" title="Ver detalles">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(orden)}
                                  title="Editar orden"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(orden)}
                                  title="Eliminar orden"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la orden{" "}
              <strong>{ordenToDelete?.numero_orden}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={FN_DELETE_ORDEN}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
