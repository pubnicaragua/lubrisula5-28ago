"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TallerLayout } from "./taller-layout"
import { Car, Search, Filter, Plus, Clock, User, FileText, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function OrdenesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const ordenes = [
    {
      id: "ORD-1001",
      cliente: "Juan Pérez",
      vehiculo: "Toyota Corolla",
      placa: "ABC-123",
      fecha: "10/05/2024",
      estado: "En proceso",
      tecnico: "Técnico 1",
      servicios: ["Mantenimiento", "Cambio de aceite"],
      total: "$1,250",
    },
    {
      id: "ORD-1002",
      cliente: "María Rodríguez",
      vehiculo: "Honda Civic",
      placa: "XYZ-789",
      fecha: "08/05/2024",
      estado: "Pendiente",
      tecnico: "Técnico 2",
      servicios: ["Diagnóstico", "Revisión de frenos"],
      total: "$850",
    },
    {
      id: "ORD-1003",
      cliente: "Carlos Gómez",
      vehiculo: "Nissan Sentra",
      placa: "DEF-456",
      fecha: "05/05/2024",
      estado: "Completada",
      tecnico: "Técnico 3",
      servicios: ["Reparación", "Cambio de suspensión"],
      total: "$2,100",
    },
    {
      id: "ORD-1004",
      cliente: "Ana López",
      vehiculo: "Kia Sportage",
      placa: "GHI-789",
      fecha: "03/05/2024",
      estado: "Entregada",
      tecnico: "Técnico 4",
      servicios: ["Pintura", "Reparación de carrocería"],
      total: "$1,500",
    },
    {
      id: "ORD-1005",
      cliente: "Pedro Martínez",
      vehiculo: "Ford Explorer",
      placa: "JKL-012",
      fecha: "01/05/2024",
      estado: "Cancelada",
      tecnico: "Técnico 1",
      servicios: ["Mantenimiento", "Alineación y balanceo"],
      total: "$950",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en proceso":
        return "bg-blue-100 text-blue-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "entregada":
        return "bg-purple-100 text-purple-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrdenes = ordenes.filter(
    (orden) =>
      orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.placa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <TallerLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Órdenes de Servicio</h1>
            <p className="text-muted-foreground">Gestiona las órdenes de servicio del taller</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar órdenes..."
                className="w-[200px] pl-8 md:w-[300px] rounded-full bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="rounded-full" onClick={() => router.push("/taller/ordenes/nueva")}>
              <Plus className="mr-2 h-4 w-4" /> Nueva Orden
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todas" className="space-y-4">
          <TabsList className="custom-tabs">
            <TabsTrigger value="todas" className="custom-tab">
              Todas
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="custom-tab">
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="en-proceso" className="custom-tab">
              En Proceso
            </TabsTrigger>
            <TabsTrigger value="completadas" className="custom-tab">
              Completadas
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-2 mr-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="Filtrar por técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los técnicos</SelectItem>
                  <SelectItem value="tecnico1">Técnico 1</SelectItem>
                  <SelectItem value="tecnico2">Técnico 2</SelectItem>
                  <SelectItem value="tecnico3">Técnico 3</SelectItem>
                  <SelectItem value="tecnico4">Técnico 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 mr-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="Filtrar por servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servicios</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="pintura">Pintura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="todas">
            <div className="space-y-4">
              {filteredOrdenes.map((orden, index) => (
                <Card key={index} className="dashboard-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{orden.id}</CardTitle>
                          <CardDescription>{orden.fecha}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(orden.estado)}>{orden.estado}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}/editar`)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancelar orden</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-2 h-4 w-4" />
                          <span className="font-medium text-foreground">Cliente:</span>
                        </div>
                        <p>{orden.cliente}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Car className="mr-2 h-4 w-4" />
                          <span className="font-medium text-foreground">Vehículo:</span>
                        </div>
                        <p>
                          {orden.vehiculo} ({orden.placa})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span className="font-medium text-foreground">Técnico:</span>
                        </div>
                        <p>{orden.tecnico}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium mb-1">Servicios:</p>
                        <div className="flex flex-wrap gap-1">
                          {orden.servicios.map((servicio, i) => (
                            <Badge key={i} variant="outline">
                              {servicio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total:</p>
                        <p className="text-lg font-bold">{orden.total}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    <Button variant="outline" onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                      Ver Detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pendientes">
            <div className="space-y-4">
              {filteredOrdenes
                .filter((orden) => orden.estado.toLowerCase() === "pendiente")
                .map((orden, index) => (
                  <Card key={index} className="dashboard-card">
                    {/* Contenido similar al de "todas" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{orden.id}</CardTitle>
                            <CardDescription>{orden.fecha}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(orden.estado)}>{orden.estado}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}/editar`)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancelar orden</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Cliente:</span>
                          </div>
                          <p>{orden.cliente}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Car className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Vehículo:</span>
                          </div>
                          <p>
                            {orden.vehiculo} ({orden.placa})
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Técnico:</span>
                          </div>
                          <p>{orden.tecnico}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium mb-1">Servicios:</p>
                          <div className="flex flex-wrap gap-1">
                            {orden.servicios.map((servicio, i) => (
                              <Badge key={i} variant="outline">
                                {servicio}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total:</p>
                          <p className="text-lg font-bold">{orden.total}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="outline" onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                        Ver Detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="en-proceso">
            <div className="space-y-4">
              {filteredOrdenes
                .filter((orden) => orden.estado.toLowerCase() === "en proceso")
                .map((orden, index) => (
                  <Card key={index} className="dashboard-card">
                    {/* Contenido similar al de "todas" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{orden.id}</CardTitle>
                            <CardDescription>{orden.fecha}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(orden.estado)}>{orden.estado}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}/editar`)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancelar orden</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Cliente:</span>
                          </div>
                          <p>{orden.cliente}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Car className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Vehículo:</span>
                          </div>
                          <p>
                            {orden.vehiculo} ({orden.placa})
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Técnico:</span>
                          </div>
                          <p>{orden.tecnico}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium mb-1">Servicios:</p>
                          <div className="flex flex-wrap gap-1">
                            {orden.servicios.map((servicio, i) => (
                              <Badge key={i} variant="outline">
                                {servicio}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total:</p>
                          <p className="text-lg font-bold">{orden.total}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="outline" onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                        Ver Detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completadas">
            <div className="space-y-4">
              {filteredOrdenes
                .filter(
                  (orden) => orden.estado.toLowerCase() === "completada" || orden.estado.toLowerCase() === "entregada",
                )
                .map((orden, index) => (
                  <Card key={index} className="dashboard-card">
                    {/* Contenido similar al de "todas" */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{orden.id}</CardTitle>
                            <CardDescription>{orden.fecha}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(orden.estado)}>{orden.estado}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>Generar factura</DropdownMenuItem>
                              <DropdownMenuItem>Enviar por email</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Cliente:</span>
                          </div>
                          <p>{orden.cliente}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Car className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Vehículo:</span>
                          </div>
                          <p>
                            {orden.vehiculo} ({orden.placa})
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="font-medium text-foreground">Técnico:</span>
                          </div>
                          <p>{orden.tecnico}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium mb-1">Servicios:</p>
                          <div className="flex flex-wrap gap-1">
                            {orden.servicios.map((servicio, i) => (
                              <Badge key={i} variant="outline">
                                {servicio}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total:</p>
                          <p className="text-lg font-bold">{orden.total}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="outline" onClick={() => router.push(`/taller/ordenes/${orden.id}`)}>
                        Ver Detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TallerLayout>
  )
}
