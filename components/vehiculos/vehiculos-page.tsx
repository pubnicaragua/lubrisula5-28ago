"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Edit, Trash2, FileCheck, Car } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoVehiculoForm } from "./nuevo-vehiculo-form"
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
import VEHICULO_SERVICES, { VehiculoType } from "@/services/VEHICULOS.SERVICE"
import HojaInspeccion from "./hoja-inspeccion"
import EstadoVehiculoComponent from "../ui/EstadoVehiculo"

export function VehiculosPage() {
  const [State_Vehiculos, SetState_Vehiculos] = useState<VehiculoType[]>([])
  const [open, setOpen] = useState(false)
  const [editingVehiculo, setEditingVehiculo] = useState<VehiculoType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehiculoToDelete, setVehiculoToDelete] = useState<VehiculoType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [State_DialogInspeccion, SetState_DialogInspeccion] = useState<boolean>(false)
  const { toast } = useToast()

  const FN_GET_ALL_VEHICULOS = async () => {
    const DataVehichulos = await VEHICULO_SERVICES.GET_ALL_VEHICULOS();
    console.log(DataVehichulos)
    SetState_Vehiculos(DataVehichulos)
  }

  const FN_ADD_VEHICULO = (nuevoVehiculo: VehiculoType) => {
    SetState_Vehiculos((prev) => [...prev, nuevoVehiculo])
    setOpen(false)
    toast({
      title: "Vehículo registrado",
      description: "El vehículo ha sido registrado exitosamente",
    })
  }

  const FN_EDIT_VEHICULO = (vehiculoEditado: VehiculoType) => {
    if (!editingVehiculo) return
    // const cliente = State_Clientes.find((c) => c.id === vehiculoEditado.client_id)
    console.log(vehiculoEditado)
    SetState_Vehiculos((prev) => prev.map((v) => (v.id === vehiculoEditado.id ? vehiculoEditado : v)))
    setEditingVehiculo(null)
    setOpen(false)

    toast({
      title: "Vehículo actualizado",
      description: "Los datos del vehículo han sido actualizados exitosamente",
    })
  }

  const FN_DELETE_VEHICULO = async () => {
    if (!vehiculoToDelete) return
    await VEHICULO_SERVICES.DELETE_VEHICULO(vehiculoToDelete.id)
    SetState_Vehiculos((prev) => prev.filter((v) => v.id !== vehiculoToDelete.id))
    setDeleteDialogOpen(false)
    setVehiculoToDelete(null)

    toast({
      title: "Vehículo eliminado",
      description: "El vehículo ha sido eliminado exitosamente",
    })
  }

  const openEditDialog = (vehiculo: VehiculoType) => {
    console.log(vehiculo)
    setEditingVehiculo(vehiculo)
    setOpen(true)
  }
  const Fn_OpenDialogHolaInspeccion = (vehiculo: VehiculoType) => {
    // console.log(vehiculo)
    setEditingVehiculo(vehiculo)
    SetState_DialogInspeccion(true)
  }

  const openDeleteDialog = (vehiculo: VehiculoType) => {
    setVehiculoToDelete(vehiculo)
    setDeleteDialogOpen(true)
  }

  const filteredVehiculos = State_Vehiculos.filter(
    (vehiculo) =>
      vehiculo?.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo?.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  useEffect(() => {
    FN_GET_ALL_VEHICULOS()
  }, [])
  return (
    <main className="container mx-auto h-full overflow-auto">
      {/* <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header> */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Vehículos</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingVehiculo(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Vehículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingVehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}</DialogTitle>
                  <DialogDescription>
                    {editingVehiculo
                      ? "Modifica la información del vehículo."
                      : "Ingresa la información del nuevo vehículo."}
                  </DialogDescription>
                </DialogHeader>
                <NuevoVehiculoForm
                  onSubmit={editingVehiculo ? FN_EDIT_VEHICULO : FN_ADD_VEHICULO}
                  vehiculoExistente={editingVehiculo}
                  clients={[]}
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
              placeholder="Buscar vehículos por marca, modelo, placa o cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar vehículos</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar vehículos</span>
          </Button>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todos">Todos ({filteredVehiculos.length})</TabsTrigger>
            <TabsTrigger value="activos">
              Activos ({filteredVehiculos.filter((v) => v.estado === "Activo").length})
            </TabsTrigger>
            <TabsTrigger value="servicio">
              En Servicio ({filteredVehiculos.filter((v) => v.estado === "En Servicio").length})
            </TabsTrigger>
            <TabsTrigger value="entregados">
              Entregados ({filteredVehiculos.filter((v) => v.estado === "Entregado").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Vehículos</CardTitle>
                <CardDescription>
                  Mostrando {filteredVehiculos.length} vehículos registrados en el sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Kilometraje</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>                  </TableHeader>
                  <TableBody>
                    {filteredVehiculos.map((vehiculo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>
                                {vehiculo.marca} {vehiculo.modelo}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {vehiculo.ano} • {vehiculo.color}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{vehiculo.placa}</TableCell>
                        <TableCell>{vehiculo.client_name}</TableCell>
                        <TableCell><EstadoVehiculoComponent estado={vehiculo.estado} /></TableCell>
                        <TableCell>{vehiculo.kilometraje || "N/A"}</TableCell>
                        <TableCell>{vehiculo.created_at}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(vehiculo)}
                              title="Editar vehículo"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Hoja de inspección"
                              onClick={() => Fn_OpenDialogHolaInspeccion(vehiculo)}
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(vehiculo)}
                              title="Eliminar vehículo"
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
          {["activos", "servicio", "entregados"].map((tab) => {
            const estadoMap = {
              activos: "Activo",
              servicio: "En Servicio",
              entregados: "Entregado",
            }
            const estado = estadoMap[tab as keyof typeof estadoMap] as VehiculoType["estado"]
            const vehiculosFiltrados = filteredVehiculos.filter((v) => v.estado === estado)

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Vehículos {estado}s</CardTitle>
                    <CardDescription>
                      Mostrando {vehiculosFiltrados.length} vehículos con estado {estado.toLowerCase()}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehículo</TableHead>
                          <TableHead>Placa</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Kilometraje</TableHead>
                          <TableHead>Fecha Registro</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehiculosFiltrados.map((vehiculo) => (
                          <TableRow key={vehiculo.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div>
                                    {vehiculo.marca} {vehiculo.modelo}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {vehiculo.ano} • {vehiculo.color}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{vehiculo.placa}</TableCell>
                            <TableCell>{vehiculo.client_name}</TableCell>
                            <TableCell>{vehiculo.kilometraje || "N/A"}</TableCell>
                            <TableCell>{vehiculo.created_at}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(vehiculo)}
                                  title="Editar vehículo"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Hoja de inspección" onClick={() => SetState_DialogInspeccion(true)}>
                                  <FileCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(vehiculo)}
                                  title="Eliminar vehículo"
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo{" "}
              <strong>
                {vehiculoToDelete?.marca} {vehiculoToDelete?.modelo} ({vehiculoToDelete?.placa})
              </strong>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={FN_DELETE_VEHICULO}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={State_DialogInspeccion} onOpenChange={SetState_DialogInspeccion}  >
        {/* <DialogTrigger asChild>
          <Button onClick={() => setEditingVehiculo(null)}>
            <Plus className="mr-2 h-4 w-4" /> hoja
          </Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[600px] h-[100vh]">
          <DialogHeader>
            <DialogTitle>Inspeccion</DialogTitle>
            <DialogDescription>
              Inspeccion de vehiculo
            </DialogDescription>
          </DialogHeader>
          {editingVehiculo && <HojaInspeccion vehiculoId={editingVehiculo?.id} />}
        </DialogContent>
      </Dialog>
    </main >
  )
}
