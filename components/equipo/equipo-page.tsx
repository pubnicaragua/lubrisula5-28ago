"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, Clock, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoMiembroForm } from "./nuevo-miembro-form"
import { Badge } from "@/components/ui/badge"
import { DetalleMiembro } from "./detalle-miembro"
import { HorariosMiembro } from "./horarios-miembro"
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

interface MiembroEquipo {
  id: string
  nombre: string
  apellido: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  fechaContratacion: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  horasTrabajadas: number
  ordenesCompletadas: number
  salario?: number
}

// Datos mock iniciales
const miembrosIniciales: MiembroEquipo[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Martínez",
    cargo: "Técnico Senior",
    especialidad: "Mecánica General",
    telefono: "9876-5432",
    email: "juan.martinez@taller.com",
    fechaContratacion: "2020-03-15",
    estado: "Activo",
    horasTrabajadas: 160,
    ordenesCompletadas: 45,
    salario: 25000,
  },
  {
    id: "2",
    nombre: "María",
    apellido: "López",
    cargo: "Técnico",
    especialidad: "Pintura",
    telefono: "8765-4321",
    email: "maria.lopez@taller.com",
    fechaContratacion: "2021-05-10",
    estado: "Activo",
    horasTrabajadas: 152,
    ordenesCompletadas: 38,
    salario: 20000,
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    cargo: "Técnico Senior",
    especialidad: "Carrocería",
    telefono: "7654-3210",
    email: "carlos.rodriguez@taller.com",
    fechaContratacion: "2019-11-20",
    estado: "De Vacaciones",
    horasTrabajadas: 120,
    ordenesCompletadas: 32,
    salario: 24000,
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Sánchez",
    cargo: "Administrativo",
    especialidad: "Atención al Cliente",
    telefono: "6543-2109",
    email: "ana.sanchez@taller.com",
    fechaContratacion: "2022-01-15",
    estado: "Activo",
    horasTrabajadas: 168,
    ordenesCompletadas: 0,
    salario: 18000,
  },
]

export function EquipoPage() {
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([])
  const [open, setOpen] = useState(false)
  const [editingMiembro, setEditingMiembro] = useState<MiembroEquipo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [miembroToDelete, setMiembroToDelete] = useState<MiembroEquipo | null>(null)
  const [miembroSeleccionado, setMiembroSeleccionado] = useState<MiembroEquipo | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarHorarios, setMostrarHorarios] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedMiembros = localStorage.getItem("miembros")
    if (savedMiembros) {
      setMiembros(JSON.parse(savedMiembros))
    } else {
      setMiembros(miembrosIniciales)
      localStorage.setItem("miembros", JSON.stringify(miembrosIniciales))
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (miembros.length > 0) {
      localStorage.setItem("miembros", JSON.stringify(miembros))
    }
  }, [miembros])

  const handleAddMiembro = (
    nuevoMiembro: Omit<MiembroEquipo, "id" | "fechaContratacion" | "horasTrabajadas" | "ordenesCompletadas">,
  ) => {
    const miembro: MiembroEquipo = {
      ...nuevoMiembro,
      id: Date.now().toString(),
      fechaContratacion: new Date().toISOString().split("T")[0],
      horasTrabajadas: 0,
      ordenesCompletadas: 0,
    }

    setMiembros((prev) => [...prev, miembro])
    setOpen(false)

    toast({
      title: "Miembro agregado",
      description: "El miembro del equipo ha sido registrado exitosamente",
    })
  }

  const handleEditMiembro = (
    miembroEditado: Omit<MiembroEquipo, "id" | "fechaContratacion" | "horasTrabajadas" | "ordenesCompletadas">,
  ) => {
    if (!editingMiembro) return

    const miembroActualizado: MiembroEquipo = {
      ...editingMiembro,
      ...miembroEditado,
    }

    setMiembros((prev) => prev.map((m) => (m.id === editingMiembro.id ? miembroActualizado : m)))
    setEditingMiembro(null)
    setOpen(false)

    toast({
      title: "Miembro actualizado",
      description: "Los datos del miembro han sido actualizados exitosamente",
    })
  }

  const handleDeleteMiembro = () => {
    if (!miembroToDelete) return

    setMiembros((prev) => prev.filter((m) => m.id !== miembroToDelete.id))
    setDeleteDialogOpen(false)
    setMiembroToDelete(null)

    toast({
      title: "Miembro eliminado",
      description: "El miembro ha sido eliminado exitosamente",
    })
  }

  const openEditDialog = (miembro: MiembroEquipo) => {
    setEditingMiembro(miembro)
    setOpen(true)
  }

  const openDeleteDialog = (miembro: MiembroEquipo) => {
    setMiembroToDelete(miembro)
    setDeleteDialogOpen(true)
  }

  const verDetalle = (miembro: MiembroEquipo) => {
    setMiembroSeleccionado(miembro)
    setMostrarDetalle(true)
  }

  const verHorarios = (miembro: MiembroEquipo) => {
    setMiembroSeleccionado(miembro)
    setMostrarHorarios(true)
  }

  const filteredMiembros = miembros.filter(
    (miembro) =>
      miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.especialidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoBadge = (estado: MiembroEquipo["estado"]) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-500 hover:bg-green-600">{estado}</Badge>
      case "Inactivo":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{estado}</Badge>
      case "De Vacaciones":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>
      case "Permiso":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{estado}</Badge>
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
          <h1 className="text-3xl font-bold tracking-tight">Equipo de Trabajo</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingMiembro(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Miembro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>{editingMiembro ? "Editar Miembro" : "Nuevo Miembro del Equipo"}</DialogTitle>
                  <DialogDescription>
                    {editingMiembro
                      ? "Modifica la información del miembro del equipo."
                      : "Ingresa la información del nuevo miembro."}
                  </DialogDescription>
                </DialogHeader>
                <NuevoMiembroForm
                  onSubmit={editingMiembro ? handleEditMiembro : handleAddMiembro}
                  miembroExistente={editingMiembro}
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
              placeholder="Buscar miembros por nombre, cargo o especialidad..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar miembros</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar lista</span>
          </Button>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="todos">Todos ({filteredMiembros.length})</TabsTrigger>
            <TabsTrigger value="tecnicos">
              Técnicos ({filteredMiembros.filter((m) => m.cargo.includes("Técnico")).length})
            </TabsTrigger>
            <TabsTrigger value="administrativos">
              Administrativos ({filteredMiembros.filter((m) => m.cargo.includes("Administrativo")).length})
            </TabsTrigger>
            <TabsTrigger value="ausentes">
              Ausentes ({filteredMiembros.filter((m) => m.estado === "De Vacaciones" || m.estado === "Permiso").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Miembros</CardTitle>
                <CardDescription>
                  Mostrando {filteredMiembros.length} miembros registrados en el sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Especialidad</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Órdenes Completadas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMiembros.map((miembro) => (
                      <TableRow key={miembro.id}>
                        <TableCell className="font-medium">
                          {miembro.nombre} {miembro.apellido}
                        </TableCell>
                        <TableCell>{miembro.cargo}</TableCell>
                        <TableCell>{miembro.especialidad}</TableCell>
                        <TableCell>{miembro.telefono}</TableCell>
                        <TableCell>{getEstadoBadge(miembro.estado)}</TableCell>
                        <TableCell>{miembro.ordenesCompletadas}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => verDetalle(miembro)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => verHorarios(miembro)}
                              title="Ver horarios"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(miembro)}
                              title="Editar miembro"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(miembro)}
                              title="Eliminar miembro"
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

          {/* Tabs filtradas por tipo */}
          {["tecnicos", "administrativos", "ausentes"].map((tab) => {
            let miembrosFiltrados: MiembroEquipo[] = []

            if (tab === "tecnicos") {
              miembrosFiltrados = filteredMiembros.filter((m) => m.cargo.includes("Técnico"))
            } else if (tab === "administrativos") {
              miembrosFiltrados = filteredMiembros.filter((m) => m.cargo.includes("Administrativo"))
            } else if (tab === "ausentes") {
              miembrosFiltrados = filteredMiembros.filter((m) => m.estado === "De Vacaciones" || m.estado === "Permiso")
            }

            return (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {tab === "tecnicos" && "Técnicos"}
                      {tab === "administrativos" && "Administrativos"}
                      {tab === "ausentes" && "Miembros Ausentes"}
                    </CardTitle>
                    <CardDescription>Mostrando {miembrosFiltrados.length} miembros en esta categoría.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>{tab === "ausentes" ? "Fecha de Regreso" : "Órdenes Completadas"}</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {miembrosFiltrados.map((miembro) => (
                          <TableRow key={miembro.id}>
                            <TableCell className="font-medium">
                              {miembro.nombre} {miembro.apellido}
                            </TableCell>
                            <TableCell>{miembro.cargo}</TableCell>
                            <TableCell>{miembro.especialidad}</TableCell>
                            <TableCell>{miembro.telefono}</TableCell>
                            <TableCell>{getEstadoBadge(miembro.estado)}</TableCell>
                            <TableCell>
                              {tab === "ausentes"
                                ? miembro.estado === "De Vacaciones"
                                  ? "2023-05-15"
                                  : "2023-04-25"
                                : miembro.ordenesCompletadas}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => verDetalle(miembro)}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => verHorarios(miembro)}
                                  title="Ver horarios"
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(miembro)}
                                  title="Editar miembro"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(miembro)}
                                  title="Eliminar miembro"
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

      {/* Diálogo para mostrar detalles del miembro */}
      <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalle del Miembro</DialogTitle>
            <DialogDescription>Información completa del miembro seleccionado</DialogDescription>
          </DialogHeader>
          {miembroSeleccionado && <DetalleMiembro miembro={miembroSeleccionado} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar horarios del miembro */}
      <Dialog open={mostrarHorarios} onOpenChange={setMostrarHorarios}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Horarios del Miembro</DialogTitle>
            <DialogDescription>Horarios y calendario de trabajo</DialogDescription>
          </DialogHeader>
          {miembroSeleccionado && <HorariosMiembro miembro={miembroSeleccionado} />}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
              <strong>
                {miembroToDelete?.nombre} {miembroToDelete?.apellido}
              </strong>{" "}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMiembro}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
