"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
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

interface Vehiculo {
  id: string
  marca: string
  modelo: string
  año: number
  placa: string
  vin: string
  color: string
  clienteId: string
  clienteNombre: string
  estado: "Activo" | "En Servicio" | "Entregado" | "Inactivo"
  fechaRegistro: string
  kilometraje?: string
}

// Datos mock iniciales
const vehiculosIniciales: Vehiculo[] = [
  {
    id: "1",
    marca: "Toyota",
    modelo: "Corolla",
    año: 2020,
    placa: "ABC-123",
    vin: "1HGBH41JXMN109186",
    color: "Blanco",
    clienteId: "1",
    clienteNombre: "Juan Pérez",
    estado: "Activo",
    fechaRegistro: "2023-01-15",
    kilometraje: "45,000",
  },
  {
    id: "2",
    marca: "Honda",
    modelo: "Civic",
    año: 2019,
    placa: "DEF-456",
    vin: "2HGBH41JXMN109187",
    color: "Negro",
    clienteId: "2",
    clienteNombre: "María González",
    estado: "En Servicio",
    fechaRegistro: "2023-02-20",
    kilometraje: "38,500",
  },
  {
    id: "3",
    marca: "Ford",
    modelo: "Focus",
    año: 2021,
    placa: "GHI-789",
    vin: "3HGBH41JXMN109188",
    color: "Azul",
    clienteId: "3",
    clienteNombre: "Carlos Rodríguez",
    estado: "Activo",
    fechaRegistro: "2023-03-10",
    kilometraje: "22,100",
  },
]

export function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedVehiculos = localStorage.getItem("vehiculos")
    const savedClientes = localStorage.getItem("clientes")

    if (savedVehiculos) {
      setVehiculos(JSON.parse(savedVehiculos))
    } else {
      setVehiculos(vehiculosIniciales)
      localStorage.setItem("vehiculos", JSON.stringify(vehiculosIniciales))
    }

    if (savedClientes) {
      setClientes(JSON.parse(savedClientes))
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (vehiculos.length > 0) {
      localStorage.setItem("vehiculos", JSON.stringify(vehiculos))
    }
  }, [vehiculos])

  const handleAddVehiculo = (nuevoVehiculo: any) => {
    const cliente = clientes.find((c) => c.id === nuevoVehiculo.clienteId)

    const vehiculo: Vehiculo = {
      id: Date.now().toString(),
      marca: nuevoVehiculo.marca,
      modelo: nuevoVehiculo.modelo,
      año: nuevoVehiculo.año,
      placa: nuevoVehiculo.placa,
      vin: nuevoVehiculo.vin,
      color: nuevoVehiculo.color,
      clienteId: nuevoVehiculo.clienteId,
      clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no encontrado",
      estado: nuevoVehiculo.estado || "Activo",
      fechaRegistro: new Date().toISOString().split("T")[0],
      kilometraje: nuevoVehiculo.kilometraje,
    }

    setVehiculos((prev) => [...prev, vehiculo])
    setOpen(false)

    toast({
      title: "Vehículo registrado",
      description: "El vehículo ha sido registrado exitosamente",
    })
  }

  const handleEditVehiculo = (vehiculoEditado: any) => {
    if (!editingVehiculo) return

    const cliente = clientes.find((c) => c.id === vehiculoEditado.clienteId)

    const vehiculoActualizado: Vehiculo = {
      ...editingVehiculo,
      marca: vehiculoEditado.marca,
      modelo: vehiculoEditado.modelo,
      año: vehiculoEditado.año,
      placa: vehiculoEditado.placa,
      vin: vehiculoEditado.vin,
      color: vehiculoEditado.color,
      clienteId: vehiculoEditado.clienteId,
      clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente no encontrado",
      estado: vehiculoEditado.estado,
      kilometraje: vehiculoEditado.kilometraje,
    }

    setVehiculos((prev) => prev.map((v) => (v.id === editingVehiculo.id ? vehiculoActualizado : v)))
    setEditingVehiculo(null)
    setOpen(false)

    toast({
      title: "Vehículo actualizado",
      description: "Los datos del vehículo han sido actualizados exitosamente",
    })
  }

  const handleDeleteVehiculo = () => {
    if (!vehiculoToDelete) return

    setVehiculos((prev) => prev.filter((v) => v.id !== vehiculoToDelete.id))
    setDeleteDialogOpen(false)
    setVehiculoToDelete(null)

    toast({
      title: "Vehículo eliminado",
      description: "El vehículo ha sido eliminado exitosamente",
    })
  }

  const openEditDialog = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo)
    setOpen(true)
  }

  const openDeleteDialog = (vehiculo: Vehiculo) => {
    setVehiculoToDelete(vehiculo)
    setDeleteDialogOpen(true)
  }

  const filteredVehiculos = vehiculos.filter(
    (vehiculo) =>
      vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado: Vehiculo["estado"]) => {
    const colors = {
      Activo: "bg-green-500 hover:bg-green-600",
      "En Servicio": "bg-blue-500 hover:bg-blue-600",
      Entregado: "bg-purple-500 hover:bg-purple-600",
      Inactivo: "bg-gray-500 hover:bg-gray-600",
    }
    return <Badge className={colors[estado]}>{estado}</Badge>
  }

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
                  onSubmit={editingVehiculo ? handleEditVehiculo : handleAddVehiculo}
                  clients={clientes}
                  vehiculoExistente={editingVehiculo}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehiculos.map((vehiculo) => (
                      <TableRow key={vehiculo.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>
                                {vehiculo.marca} {vehiculo.modelo}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {vehiculo.año} • {vehiculo.color}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{vehiculo.placa}</TableCell>
                        <TableCell>{vehiculo.clienteNombre}</TableCell>
                        <TableCell>{getEstadoBadge(vehiculo.estado)}</TableCell>
                        <TableCell>{vehiculo.kilometraje || "N/A"}</TableCell>
                        <TableCell>{vehiculo.fechaRegistro}</TableCell>
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
                            <Button variant="ghost" size="icon" title="Hoja de inspección">
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
            const estado = estadoMap[tab as keyof typeof estadoMap] as Vehiculo["estado"]
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
                                    {vehiculo.año} • {vehiculo.color}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{vehiculo.placa}</TableCell>
                            <TableCell>{vehiculo.clienteNombre}</TableCell>
                            <TableCell>{vehiculo.kilometraje || "N/A"}</TableCell>
                            <TableCell>{vehiculo.fechaRegistro}</TableCell>
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
                                <Button variant="ghost" size="icon" title="Hoja de inspección">
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
            <AlertDialogAction onClick={handleDeleteVehiculo}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
