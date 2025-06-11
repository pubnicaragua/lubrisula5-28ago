"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, Clock } from "lucide-react"
import { useState } from "react"
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

interface MiembroEquipo {
  id: number
  nombre: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  fechaContratacion: string
  estado: "Activo" | "Inactivo" | "De Vacaciones" | "Permiso"
  horasTrabajadas: number
  ordenesCompletadas: number
}

export function EquipoPage() {
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([
    {
      id: 1,
      nombre: "Juan Martínez",
      cargo: "Técnico Senior",
      especialidad: "Mecánica General",
      telefono: "9876-5432",
      email: "juan.martinez@taller.com",
      fechaContratacion: "2020-03-15",
      estado: "Activo",
      horasTrabajadas: 160,
      ordenesCompletadas: 45,
    },
    {
      id: 2,
      nombre: "María López",
      cargo: "Técnico",
      especialidad: "Pintura",
      telefono: "8765-4321",
      email: "maria.lopez@taller.com",
      fechaContratacion: "2021-05-10",
      estado: "Activo",
      horasTrabajadas: 152,
      ordenesCompletadas: 38,
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      cargo: "Técnico Senior",
      especialidad: "Carrocería",
      telefono: "7654-3210",
      email: "carlos.rodriguez@taller.com",
      fechaContratacion: "2019-11-20",
      estado: "De Vacaciones",
      horasTrabajadas: 120,
      ordenesCompletadas: 32,
    },
    {
      id: 4,
      nombre: "Ana Sánchez",
      cargo: "Administrativo",
      especialidad: "Atención al Cliente",
      telefono: "6543-2109",
      email: "ana.sanchez@taller.com",
      fechaContratacion: "2022-01-15",
      estado: "Activo",
      horasTrabajadas: 168,
      ordenesCompletadas: 0,
    },
    {
      id: 5,
      nombre: "Roberto Méndez",
      cargo: "Técnico",
      especialidad: "Electricidad",
      telefono: "5432-1098",
      email: "roberto.mendez@taller.com",
      fechaContratacion: "2020-08-05",
      estado: "Permiso",
      horasTrabajadas: 80,
      ordenesCompletadas: 15,
    },
  ])

  const [open, setOpen] = useState(false)
  const [miembroSeleccionado, setMiembroSeleccionado] = useState<MiembroEquipo | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarHorarios, setMostrarHorarios] = useState(false)

  const handleAddMiembro = (nuevoMiembro: Omit<MiembroEquipo, "id">) => {
    const id = miembros.length > 0 ? Math.max(...miembros.map((o) => o.id)) + 1 : 1
    setMiembros([...miembros, { ...nuevoMiembro, id }])
    setOpen(false)
  }

  const verDetalle = (miembro: MiembroEquipo) => {
    setMiembroSeleccionado(miembro)
    setMostrarDetalle(true)
  }

  const verHorarios = (miembro: MiembroEquipo) => {
    setMiembroSeleccionado(miembro)
    setMostrarHorarios(true)
  }

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
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Miembro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Miembro del Equipo</DialogTitle>
                  <DialogDescription>
                    Ingresa la información del nuevo miembro. Haz clic en guardar cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                <NuevoMiembroForm onSubmit={handleAddMiembro} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar miembros por nombre, cargo o especialidad..." className="pl-8" />
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
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="tecnicos">Técnicos</TabsTrigger>
            <TabsTrigger value="administrativos">Administrativos</TabsTrigger>
            <TabsTrigger value="ausentes">Ausentes</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Miembros</CardTitle>
                <CardDescription>Mostrando {miembros.length} miembros registrados en el sistema.</CardDescription>
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
                    {miembros.map((miembro) => (
                      <TableRow key={miembro.id}>
                        <TableCell className="font-medium">{miembro.nombre}</TableCell>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tecnicos">
            <Card>
              <CardHeader>
                <CardTitle>Técnicos</CardTitle>
                <CardDescription>Miembros del equipo técnico.</CardDescription>
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
                    {miembros
                      .filter((miembro) => miembro.cargo.includes("Técnico"))
                      .map((miembro) => (
                        <TableRow key={miembro.id}>
                          <TableCell className="font-medium">{miembro.nombre}</TableCell>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="administrativos">
            <Card>
              <CardHeader>
                <CardTitle>Administrativos</CardTitle>
                <CardDescription>Miembros del equipo administrativo.</CardDescription>
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
                      <TableHead>Horas Trabajadas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {miembros
                      .filter((miembro) => miembro.cargo.includes("Administrativo"))
                      .map((miembro) => (
                        <TableRow key={miembro.id}>
                          <TableCell className="font-medium">{miembro.nombre}</TableCell>
                          <TableCell>{miembro.cargo}</TableCell>
                          <TableCell>{miembro.especialidad}</TableCell>
                          <TableCell>{miembro.telefono}</TableCell>
                          <TableCell>{getEstadoBadge(miembro.estado)}</TableCell>
                          <TableCell>{miembro.horasTrabajadas}</TableCell>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ausentes">
            <Card>
              <CardHeader>
                <CardTitle>Miembros Ausentes</CardTitle>
                <CardDescription>Miembros que están de vacaciones o con permiso.</CardDescription>
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
                      <TableHead>Fecha de Regreso</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {miembros
                      .filter((miembro) => miembro.estado === "De Vacaciones" || miembro.estado === "Permiso")
                      .map((miembro) => (
                        <TableRow key={miembro.id}>
                          <TableCell className="font-medium">{miembro.nombre}</TableCell>
                          <TableCell>{miembro.cargo}</TableCell>
                          <TableCell>{miembro.especialidad}</TableCell>
                          <TableCell>{miembro.telefono}</TableCell>
                          <TableCell>{getEstadoBadge(miembro.estado)}</TableCell>
                          <TableCell>{miembro.estado === "De Vacaciones" ? "2023-05-15" : "2023-04-25"}</TableCell>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
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
    </div>
  )
}
