"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, Users, BarChart, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevaFlotaForm } from "./nueva-flota-form"
import { Badge } from "@/components/ui/badge"
import { DetalleFlota } from "./detalle-flota"
import { ConductoresFlota } from "./conductores-flota"
import { RendimientoFlota } from "./rendimiento-flota"
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

interface Flota {
  id: string
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  fechaRegistro: string
  ultimaActualizacion: string
  descripcion?: string
}

// Datos mock iniciales
const flotasIniciales: Flota[] = [
  {
    id: "1",
    nombre: "Flota Logística Norte",
    empresa: "Transportes Rápidos S.A.",
    contacto: "Carlos Mendoza",
    telefono: "9876-5432",
    email: "carlos.mendoza@transportesrapidos.com",
    cantidadVehiculos: 12,
    estado: "Activa",
    fechaRegistro: "2023-01-15",
    ultimaActualizacion: "2023-04-10",
    descripcion: "Flota especializada en transporte de carga pesada",
  },
  {
    id: "2",
    nombre: "Flota Distribución Central",
    empresa: "Distribuidora Nacional",
    contacto: "Ana Martínez",
    telefono: "8765-4321",
    email: "ana.martinez@distribuidoranacional.com",
    cantidadVehiculos: 8,
    estado: "Activa",
    fechaRegistro: "2023-02-20",
    ultimaActualizacion: "2023-04-05",
    descripcion: "Distribución urbana y regional",
  },
  {
    id: "3",
    nombre: "Flota Ejecutiva Capital",
    empresa: "Servicios Corporativos XYZ",
    contacto: "Roberto Sánchez",
    telefono: "7654-3210",
    email: "roberto.sanchez@corporativosxyz.com",
    cantidadVehiculos: 5,
    estado: "En Negociación",
    fechaRegistro: "2023-03-10",
    ultimaActualizacion: "2023-03-25",
    descripcion: "Servicios ejecutivos y corporativos",
  },
]

export function FlotasPage() {
  const [flotas, setFlotas] = useState<Flota[]>([])
  const [open, setOpen] = useState(false)
  const [editingFlota, setEditingFlota] = useState<Flota | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [flotaToDelete, setFlotaToDelete] = useState<Flota | null>(null)
  const [flotaSeleccionada, setFlotaSeleccionada] = useState<Flota | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarConductores, setMostrarConductores] = useState(false)
  const [mostrarRendimiento, setMostrarRendimiento] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedFlotas = localStorage.getItem("flotas")
    if (savedFlotas) {
      setFlotas(JSON.parse(savedFlotas))
    } else {
      setFlotas(flotasIniciales)
      localStorage.setItem("flotas", JSON.stringify(flotasIniciales))
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (flotas.length > 0) {
      localStorage.setItem("flotas", JSON.stringify(flotas))
    }
  }, [flotas])

  const handleAddFlota = (nuevaFlota: Omit<Flota, "id" | "fechaRegistro" | "ultimaActualizacion">) => {
    const flota: Flota = {
      ...nuevaFlota,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split("T")[0],
      ultimaActualizacion: new Date().toISOString().split("T")[0],
    }

    setFlotas((prev) => [...prev, flota])
    setOpen(false)

    toast({
      title: "Flota creada",
      description: "La flota ha sido registrada exitosamente",
    })
  }

  const handleEditFlota = (flotaEditada: Omit<Flota, "id" | "fechaRegistro" | "ultimaActualizacion">) => {
    if (!editingFlota) return

    const flotaActualizada: Flota = {
      ...editingFlota,
      ...flotaEditada,
      ultimaActualizacion: new Date().toISOString().split("T")[0],
    }

    setFlotas((prev) => prev.map((f) => (f.id === editingFlota.id ? flotaActualizada : f)))
    setEditingFlota(null)
    setOpen(false)

    toast({
      title: "Flota actualizada",
      description: "Los datos de la flota han sido actualizados exitosamente",
    })
  }

  const handleDeleteFlota = () => {
    if (!flotaToDelete) return

    setFlotas((prev) => prev.filter((f) => f.id !== flotaToDelete.id))
    setDeleteDialogOpen(false)
    setFlotaToDelete(null)

    toast({
      title: "Flota eliminada",
      description: "La flota ha sido eliminada exitosamente",
    })
  }

  const openEditDialog = (flota: Flota) => {
    setEditingFlota(flota)
    setOpen(true)
  }

  const openDeleteDialog = (flota: Flota) => {
    setFlotaToDelete(flota)
    setDeleteDialogOpen(true)
  }

  const verDetalle = (flota: Flota) => {
    setFlotaSeleccionada(flota)
    setMostrarDetalle(true)
  }

  const verConductores = (flota: Flota) => {
    setFlotaSeleccionada(flota)
    setMostrarConductores(true)
  }

  const verRendimiento = (flota: Flota) => {
    setFlotaSeleccionada(flota)
    setMostrarRendimiento(true)
  }

  const filteredFlotas = flotas.filter(
    (flota) =>
      flota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flota.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flota.contacto.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado: Flota["estado"]) => {
    switch (estado) {
      case "Activa":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Inactiva":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "En Negociación":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Flotas</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFlota(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Flota
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>{editingFlota ? "Editar Flota" : "Nueva Flota"}</DialogTitle>
                  <DialogDescription>
                    {editingFlota
                      ? "Modifica la información de la flota."
                      : "Ingresa la información de la nueva flota."}
                  </DialogDescription>
                </DialogHeader>
                <NuevaFlotaForm
                  onSubmit={editingFlota ? handleEditFlota : handleAddFlota}
                  flotaExistente={editingFlota}
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
              placeholder="Buscar flotas por nombre, empresa o contacto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar flotas</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar flotas</span>
          </Button>
        </div>

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todas">Todas ({filteredFlotas.length})</TabsTrigger>
            <TabsTrigger value="activas">
              Activas ({filteredFlotas.filter((f) => f.estado === "Activa").length})
            </TabsTrigger>
            <TabsTrigger value="negociacion">
              En Negociación ({filteredFlotas.filter((f) => f.estado === "En Negociación").length})
            </TabsTrigger>
            <TabsTrigger value="inactivas">
              Inactivas ({filteredFlotas.filter((f) => f.estado === "Inactiva").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Flotas</CardTitle>
                <CardDescription>Mostrando {filteredFlotas.length} flotas registradas en el sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Vehículos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última Actualización</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlotas.map((flota) => (
                      <TableRow key={flota.id}>
                        <TableCell className="font-medium">{flota.nombre}</TableCell>
                        <TableCell>{flota.empresa}</TableCell>
                        <TableCell>{flota.contacto}</TableCell>
                        <TableCell>{flota.cantidadVehiculos}</TableCell>
                        <TableCell>{getEstadoBadge(flota.estado)}</TableCell>
                        <TableCell>{flota.ultimaActualizacion}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => verDetalle(flota)} title="Ver detalles">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => verConductores(flota)}
                              title="Ver conductores"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => verRendimiento(flota)}
                              title="Ver rendimiento"
                            >
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(flota)}
                              title="Editar flota"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(flota)}
                              title="Eliminar flota"
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
          {["activas", "negociacion", "inactivas"].map((tab) => {
            const estadoMap = {
              activas: "Activa",
              negociacion: "En Negociación",
              inactivas: "Inactiva",
            }
            const estado = estadoMap[tab as keyof typeof estadoMap] as Flota["estado"]
            const flotasFiltradas = filteredFlotas.filter((f) => f.estado === estado)

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Flotas {estado}s</CardTitle>
                    <CardDescription>
                      Mostrando {flotasFiltradas.length} flotas con estado {estado.toLowerCase()}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Vehículos</TableHead>
                          <TableHead>Última Actualización</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flotasFiltradas.map((flota) => (
                          <TableRow key={flota.id}>
                            <TableCell className="font-medium">{flota.nombre}</TableCell>
                            <TableCell>{flota.empresa}</TableCell>
                            <TableCell>{flota.contacto}</TableCell>
                            <TableCell>{flota.cantidadVehiculos}</TableCell>
                            <TableCell>{flota.ultimaActualizacion}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => verDetalle(flota)}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => verConductores(flota)}
                                  title="Ver conductores"
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => verRendimiento(flota)}
                                  title="Ver rendimiento"
                                >
                                  <BarChart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(flota)}
                                  title="Editar flota"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(flota)}
                                  title="Eliminar flota"
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

      {/* Diálogo para mostrar detalles de la flota */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalle de Flota</DialogTitle>
            <DialogDescription>Información completa de la flota seleccionada</DialogDescription>
          </DialogHeader>
          {flotaSeleccionada && <DetalleFlota flota={flotaSeleccionada} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar conductores de la flota */}
      <Dialog open={mostrarConductores} onOpenChange={setMostrarConductores}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Conductores de la Flota</DialogTitle>
            <DialogDescription>Listado de conductores asignados a esta flota</DialogDescription>
          </DialogHeader>
          {flotaSeleccionada && <ConductoresFlota flota={flotaSeleccionada} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar rendimiento de la flota */}
      <Dialog open={mostrarRendimiento} onOpenChange={setMostrarRendimiento}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Rendimiento de la Flota</DialogTitle>
            <DialogDescription>Estadísticas y métricas de rendimiento</DialogDescription>
          </DialogHeader>
          {flotaSeleccionada && <RendimientoFlota flota={flotaSeleccionada} />}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la flota{" "}
              <strong>{flotaToDelete?.nombre}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFlota}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
