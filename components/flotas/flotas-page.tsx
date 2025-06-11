"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, Eye, Users, BarChart } from "lucide-react"
import { useState } from "react"
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

interface Flota {
  id: number
  nombre: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  cantidadVehiculos: number
  estado: "Activa" | "Inactiva" | "En Negociación"
  fechaRegistro: string
  ultimaActualizacion: string
}

export function FlotasPage() {
  const [flotas, setFlotas] = useState<Flota[]>([
    {
      id: 1,
      nombre: "Flota Logística Norte",
      empresa: "Transportes Rápidos S.A.",
      contacto: "Carlos Mendoza",
      telefono: "9876-5432",
      email: "carlos.mendoza@transportesrapidos.com",
      cantidadVehiculos: 12,
      estado: "Activa",
      fechaRegistro: "2023-01-15",
      ultimaActualizacion: "2023-04-10",
    },
    {
      id: 2,
      nombre: "Flota Distribución Central",
      empresa: "Distribuidora Nacional",
      contacto: "Ana Martínez",
      telefono: "8765-4321",
      email: "ana.martinez@distribuidoranacional.com",
      cantidadVehiculos: 8,
      estado: "Activa",
      fechaRegistro: "2023-02-20",
      ultimaActualizacion: "2023-04-05",
    },
    {
      id: 3,
      nombre: "Flota Ejecutiva Capital",
      empresa: "Servicios Corporativos XYZ",
      contacto: "Roberto Sánchez",
      telefono: "7654-3210",
      email: "roberto.sanchez@corporativosxyz.com",
      cantidadVehiculos: 5,
      estado: "En Negociación",
      fechaRegistro: "2023-03-10",
      ultimaActualizacion: "2023-03-25",
    },
    {
      id: 4,
      nombre: "Flota Mensajería Express",
      empresa: "Mensajeros Rápidos",
      contacto: "Laura Guzmán",
      telefono: "6543-2109",
      email: "laura.guzman@mensajerosrapidos.com",
      cantidadVehiculos: 15,
      estado: "Activa",
      fechaRegistro: "2022-11-05",
      ultimaActualizacion: "2023-04-12",
    },
    {
      id: 5,
      nombre: "Flota Turismo Premium",
      empresa: "Viajes Exclusivos",
      contacto: "Daniel Torres",
      telefono: "5432-1098",
      email: "daniel.torres@viajesexclusivos.com",
      cantidadVehiculos: 7,
      estado: "Inactiva",
      fechaRegistro: "2022-12-18",
      ultimaActualizacion: "2023-02-28",
    },
  ])

  const [open, setOpen] = useState(false)
  const [flotaSeleccionada, setFlotaSeleccionada] = useState<Flota | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarConductores, setMostrarConductores] = useState(false)
  const [mostrarRendimiento, setMostrarRendimiento] = useState(false)

  const handleAddFlota = (nuevaFlota: Omit<Flota, "id">) => {
    const id = flotas.length > 0 ? Math.max(...flotas.map((o) => o.id)) + 1 : 1
    setFlotas([...flotas, { ...nuevaFlota, id }])
    setOpen(false)
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
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Flota
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Nueva Flota</DialogTitle>
                  <DialogDescription>
                    Ingresa la información de la nueva flota. Haz clic en guardar cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                <NuevaFlotaForm onSubmit={handleAddFlota} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar flotas por nombre, empresa o contacto..." className="pl-8" />
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
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="activas">Activas</TabsTrigger>
            <TabsTrigger value="negociacion">En Negociación</TabsTrigger>
            <TabsTrigger value="inactivas">Inactivas</TabsTrigger>
          </TabsList>
          <TabsContent value="todas">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Flotas</CardTitle>
                <CardDescription>Mostrando {flotas.length} flotas registradas en el sistema.</CardDescription>
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
                    {flotas.map((flota) => (
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activas">
            <Card>
              <CardHeader>
                <CardTitle>Flotas Activas</CardTitle>
                <CardDescription>Flotas que están actualmente operativas.</CardDescription>
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
                    {flotas
                      .filter((flota) => flota.estado === "Activa")
                      .map((flota) => (
                        <TableRow key={flota.id}>
                          <TableCell className="font-medium">{flota.nombre}</TableCell>
                          <TableCell>{flota.empresa}</TableCell>
                          <TableCell>{flota.contacto}</TableCell>
                          <TableCell>{flota.cantidadVehiculos}</TableCell>
                          <TableCell>{getEstadoBadge(flota.estado)}</TableCell>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="negociacion">
            <Card>
              <CardHeader>
                <CardTitle>Flotas en Negociación</CardTitle>
                <CardDescription>Flotas que están en proceso de negociación.</CardDescription>
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
                    {flotas
                      .filter((flota) => flota.estado === "En Negociación")
                      .map((flota) => (
                        <TableRow key={flota.id}>
                          <TableCell className="font-medium">{flota.nombre}</TableCell>
                          <TableCell>{flota.empresa}</TableCell>
                          <TableCell>{flota.contacto}</TableCell>
                          <TableCell>{flota.cantidadVehiculos}</TableCell>
                          <TableCell>{getEstadoBadge(flota.estado)}</TableCell>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inactivas">
            <Card>
              <CardHeader>
                <CardTitle>Flotas Inactivas</CardTitle>
                <CardDescription>Flotas que están actualmente inactivas.</CardDescription>
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
                    {flotas
                      .filter((flota) => flota.estado === "Inactiva")
                      .map((flota) => (
                        <TableRow key={flota.id}>
                          <TableCell className="font-medium">{flota.nombre}</TableCell>
                          <TableCell>{flota.empresa}</TableCell>
                          <TableCell>{flota.contacto}</TableCell>
                          <TableCell>{flota.cantidadVehiculos}</TableCell>
                          <TableCell>{getEstadoBadge(flota.estado)}</TableCell>
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
    </div>
  )
}
